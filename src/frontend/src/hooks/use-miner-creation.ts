/**
 * useMinerCreation — owns the entire miner-creation flow for MiningPage.
 *
 * WHY a page-level hook (not the modal): once the fee transaction is
 * broadcast the payment is irreplaceable, but the old flow lived inside
 * CreateMinerModal — closing or reloading it after `wallet.sendTransaction`
 * resolved dropped the tx hash on the floor (orphaned payment, live v340
 * test on Ethereum). Here the flow keeps running to completion for as long
 * as the page lives, the in-flight attempt survives a reload in
 * localStorage, and MiningPage renders it as a pending tile with a retry /
 * repay action.
 *
 * Backend contract: `createMiner(feeChain, feeTxHash)` verifies the fee
 * on-chain and consumes the hash ONLY on success, so retrying with the SAME
 * hash is free and safe. `MINER_FEE_REPLAY` means the hash was already
 * consumed — the miner exists — and is treated as success.
 *
 * Attempt FSM: confirming_fee → creating → (resolved | action_needed |
 * failed_fee). `activeStep` mirrors the attempt the modal is driving;
 * background attempts keep retrying on the 30s loop.
 */
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { buildMinerFeeBindingData } from "../lib/fee-binding";
import { waitBurnReceipt } from "../lib/kvcm-retirement";
import { CHAIN_IDS } from "../types";
import { useAuth } from "./use-auth";
import {
  useCreateMiner,
  useGetFeeRecipient,
  useMinerCreationFees,
} from "./use-backend";
import { useWallet } from "./use-wallet";

// ─── Tuning constants ─────────────────────────────────────────────────────────

/** How often the fee receipt is re-probed on the frontend RPCs. */
export const FEE_RECEIPT_POLL_MS = 5_000;
/** Receipt patience before handing over to the createMiner retry loop — L1. */
export const FEE_RECEIPT_WINDOW_L1_MS = 300_000;
/** Receipt patience before handing over to the createMiner retry loop — L2. */
export const FEE_RECEIPT_WINDOW_L2_MS = 120_000;
/** Auto-retry cadence for confirming/creating attempts. */
export const CREATE_RETRY_INTERVAL_MS = 30_000;
/** Display-only escalation window (never red, never blocks) — L1. */
export const GRACE_L1_MS = 300_000;
/** Display-only escalation window (never red, never blocks) — L2. */
export const GRACE_L2_MS = 90_000;

/** ethereum = L1; base / optimism / celo = L2. */
function isL1(chainId: number | null): boolean {
  return chainId === 1;
}

export function receiptWindowMs(chainId: number | null): number {
  return isL1(chainId) ? FEE_RECEIPT_WINDOW_L1_MS : FEE_RECEIPT_WINDOW_L2_MS;
}

export function graceMs(chainId: number | null): number {
  return isL1(chainId) ? GRACE_L1_MS : GRACE_L2_MS;
}

// ─── Persistence ──────────────────────────────────────────────────────────────

const MINER_ATTEMPTS_PREFIX = "akk.minerAttempts.";

export type MinerAttemptStatus =
  | "confirming_fee"
  | "creating"
  | "action_needed"
  | "failed_fee";

export interface MinerAttempt {
  id: string;
  name: string;
  /** e9-scaled GRIT amount, as a string (bigint-safe JSON). */
  gritAmount: string;
  /** GRIT/day rate, as a string (bigint-safe JSON). */
  rate: string;
  feeChain: string | null;
  chainId: number | null;
  feeTxHash: string | null;
  status: MinerAttemptStatus;
  createdAt: number;
  updatedAt: number;
}

const ATTEMPT_STATUSES: MinerAttemptStatus[] = [
  "confirming_fee",
  "creating",
  "action_needed",
  "failed_fee",
];

function isAttemptStatus(value: unknown): value is MinerAttemptStatus {
  return ATTEMPT_STATUSES.includes(value as MinerAttemptStatus);
}

/** Guarded parse — a corrupted/short record is dropped, never thrown. */
function readAttempts(key: string): MinerAttempt[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is MinerAttempt => {
      const a = entry as Partial<MinerAttempt>;
      return (
        typeof a?.id === "string" &&
        typeof a.name === "string" &&
        typeof a.gritAmount === "string" &&
        typeof a.rate === "string" &&
        isAttemptStatus(a.status)
      );
    });
  } catch {
    return [];
  }
}

/**
 * A fee attempt reloaded without a hash never reached the wallet's relay —
 * there is nothing left to retry, so it becomes a repay. Free-chain
 * attempts legitimately have no hash and stay retryable.
 */
function normalizeAttempt(attempt: MinerAttempt): MinerAttempt {
  if (!attempt.feeTxHash && attempt.feeChain !== null) {
    return { ...attempt, status: "action_needed" };
  }
  return attempt;
}

function newAttemptId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `attempt-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// ─── Error mapping ────────────────────────────────────────────────────────────

/**
 * Maps backend miner-fee gate errors to user-facing messages (unknown
 * prefixes fall through to the raw message). Shared by the modal and the
 * pending-miner tiles so both show the same wording.
 */
export function minerFeeErrorMessage(err: unknown): string {
  const raw = err instanceof Error ? err.message : "Unexpected error occurred.";
  const map: Record<string, string> = {
    MINER_FEE_TX_REQUIRED:
      "A creation fee is required on this chain. Complete the fee payment first, then try again.",
    MINER_FEE_REPLAY:
      "That payment was already used to create a miner. Each fee payment creates exactly one miner.",
    MINER_FEE_UNDERPAID:
      "The creation fee paid on-chain was less than the required amount.",
    MINER_FEE_BINDING:
      "The fee payment's binding data did not match your account. Re-send the fee from this screen.",
    MINER_FEE_TX_FAILED:
      "The fee transaction failed on-chain. Send a new fee payment and try again.",
    MINER_FEE_TX_ERROR:
      "Could not verify the fee transaction. Try again in a moment.",
    MINER_FEE_NOT_CONFIGURED:
      "The creation fee is not fully configured. Contact an admin.",
    MINER_FEE_CHAIN_UNSUPPORTED:
      "No creation fee is configured for this chain right now. Pick a supported chain or contact an admin.",
    PENDING:
      "The fee transaction is not confirmed yet. Try again in a few seconds.",
  };
  const code = Object.keys(map).find((key) => raw.startsWith(key));
  return code ? map[code] : raw;
}

type CreateOutcome =
  /** The miner exists — resolved via ok or a consumed (replayed) hash. */
  | { kind: "success" }
  /** Fee not visible yet / RPC hiccup — keep retrying. */
  | { kind: "transient" }
  /** The fee cannot be used — the user must pay again. */
  | { kind: "action_needed"; message: string }
  /** The fee tx reverted on-chain — definitive, pay again. */
  | { kind: "failed_fee"; message: string };

function classifyCreateError(raw: string): CreateOutcome {
  if (raw.startsWith("MINER_FEE_REPLAY")) return { kind: "success" };
  if (raw.startsWith("MINER_FEE_TX_FAILED")) {
    return {
      kind: "failed_fee",
      message: minerFeeErrorMessage(new Error(raw)),
    };
  }
  if (
    raw.startsWith("MINER_FEE_UNDERPAID") ||
    raw.startsWith("MINER_FEE_BINDING") ||
    raw.startsWith("MINER_FEE_TX_REQUIRED") ||
    // Not on the spec's list: retrying a misconfigured chain forever would
    // burn cycles, and only an admin can clear it — same user action (none).
    raw.startsWith("MINER_FEE_NOT_CONFIGURED") ||
    // Deterministic rejection (chain un-armed at runtime): retrying can never
    // succeed, and only an admin can re-arm it.
    raw.startsWith("MINER_FEE_CHAIN_UNSUPPORTED")
  ) {
    return {
      kind: "action_needed",
      message: minerFeeErrorMessage(new Error(raw)),
    };
  }
  // PENDING, MINER_FEE_TX_ERROR, not-found-class, anything unknown.
  return { kind: "transient" };
}

/** Plain, non-technical message for a wallet rejection during the fee send. */
function walletSendErrorMessage(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  if (/user rejected|user denied|declined/i.test(raw)) {
    return "Wallet signature was rejected. No fee was sent — you can create the miner again.";
  }
  return minerFeeErrorMessage(err);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export type MinerCreationStep =
  | "idle"
  | "paying_fee"
  | "confirming_fee"
  | "creating"
  | "done";

export interface StartMinerCreationParams {
  name: string;
  /** e9-scaled GRIT amount. */
  gritAmount: bigint;
  /** GRIT/day rate. */
  rate: bigint;
}

export interface UseMinerCreationReturn {
  /** All in-flight attempts (persisted per principal). */
  attempts: MinerAttempt[];
  /** Step for the attempt the modal is driving. */
  activeStep: MinerCreationStep;
  /** Error text for the modal (wallet rejection, unusable fee, …). */
  errorMessage: string | null;
  start: (
    params: StartMinerCreationParams,
    options?: { replaceAttemptId?: string },
  ) => Promise<void>;
  /** Immediate same-hash createMiner attempt (no waiting for the loop). */
  retryNow: (attemptId: string) => Promise<void>;
  dismiss: (attemptId: string) => void;
  /** Dismiss is offered once the chain-aware grace window has passed. */
  canDismiss: (attempt: MinerAttempt) => boolean;
  /** True when the attempt is past its grace window (display escalation). */
  isEscalated: (attempt: MinerAttempt) => boolean;
  /** Tick used for grace-window rendering decisions. */
  now: number;
}

export function useMinerCreation(): UseMinerCreationReturn {
  const wallet = useWallet();
  const { principal } = useAuth();
  const { data: feeConfig } = useMinerCreationFees();
  const { data: feeRecipient } = useGetFeeRecipient();
  const createMiner = useCreateMiner();
  const qc = useQueryClient();

  const [attempts, setAttempts] = useState<MinerAttempt[]>([]);
  const [activeStep, setActiveStep] = useState<MinerCreationStep>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // Latest-value refs so the callbacks below stay referentially stable even
  // though useWallet()/useAuth() return fresh objects every render.
  const walletRef = useRef(wallet);
  walletRef.current = wallet;
  const principalRef = useRef(principal);
  principalRef.current = principal;
  const feeConfigRef = useRef(feeConfig);
  feeConfigRef.current = feeConfig;
  const feeRecipientRef = useRef(feeRecipient);
  feeRecipientRef.current = feeRecipient;

  const attemptsRef = useRef<MinerAttempt[]>([]);
  const storageKeyRef = useRef<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  /** Stable across renders (react-query guarantees mutateAsync identity). */
  const createMinerAsyncRef = useRef(createMiner.mutateAsync);
  createMinerAsyncRef.current = createMiner.mutateAsync;
  /** Guards against the loop and a manual retry double-calling createMiner. */
  const inFlightRef = useRef<Set<string>>(new Set());
  /** Per-attempt start of the receipt-confirmation window (session only). */
  const windowStartRef = useRef<Map<string, number>>(new Map());

  const persist = useCallback((next: MinerAttempt[]) => {
    const key = storageKeyRef.current;
    if (!key) return;
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Quota / private mode — the flow still works in memory.
    }
  }, []);

  const commit = useCallback(
    (next: MinerAttempt[]) => {
      attemptsRef.current = next;
      setAttempts(next);
      persist(next);
    },
    [persist],
  );

  const updateAttempt = useCallback(
    (id: string, patch: Partial<MinerAttempt>) => {
      commit(
        attemptsRef.current.map((a) =>
          a.id === id ? { ...a, ...patch, updatedAt: Date.now() } : a,
        ),
      );
    },
    [commit],
  );

  const removeAttempt = useCallback(
    (id: string) => {
      windowStartRef.current.delete(id);
      commit(attemptsRef.current.filter((a) => a.id !== id));
    },
    [commit],
  );

  // Hydrate from localStorage whenever the principal (and so the key) changes.
  useEffect(() => {
    if (!principal) {
      storageKeyRef.current = null;
      activeIdRef.current = null;
      attemptsRef.current = [];
      setAttempts([]);
      return;
    }
    const key = `${MINER_ATTEMPTS_PREFIX}${principal}`;
    storageKeyRef.current = key;
    const loaded = readAttempts(key).map(normalizeAttempt);
    attemptsRef.current = loaded;
    setAttempts(loaded);
    persist(loaded);
  }, [principal, persist]);

  const resolveAttempt = useCallback(
    (id: string) => {
      removeAttempt(id);
      void qc.invalidateQueries({ queryKey: ["myMiners"] });
      void qc.invalidateQueries({ queryKey: ["myBalance"] });
      void qc.refetchQueries({ queryKey: ["myMiners"] });
      toast.success("Miner created!");
      if (activeIdRef.current === id) {
        activeIdRef.current = null;
        setActiveStep("done");
        setErrorMessage(null);
      }
    },
    [removeAttempt, qc],
  );

  const runCreate = useCallback(
    async (id: string): Promise<void> => {
      if (inFlightRef.current.has(id)) return;
      const attempt = attemptsRef.current.find((a) => a.id === id);
      if (!attempt) return;
      inFlightRef.current.add(id);
      try {
        const result = await createMinerAsyncRef.current({
          name: attempt.name,
          gritAmount: BigInt(attempt.gritAmount),
          rate: BigInt(attempt.rate),
          feeChain: attempt.feeChain,
          feeTxHash: attempt.feeTxHash,
        });
        if (result.__kind__ === "ok") {
          resolveAttempt(id);
          return;
        }
        const outcome = classifyCreateError(result.err);
        if (outcome.kind === "success") {
          // MINER_FEE_REPLAY — the hash was already consumed, the miner exists.
          resolveAttempt(id);
          return;
        }
        if (outcome.kind === "transient") {
          updateAttempt(id, {}); // bump updatedAt, wait for the next tick
          return;
        }
        updateAttempt(id, { status: outcome.kind });
        if (activeIdRef.current === id) {
          activeIdRef.current = null;
          setActiveStep("idle");
          setErrorMessage(outcome.message);
        }
      } catch {
        // Network / actor hiccup — never kill the loop, just wait.
        updateAttempt(id, {});
      } finally {
        inFlightRef.current.delete(id);
      }
    },
    [resolveAttempt, updateAttempt],
  );

  const start = useCallback(
    async (
      params: StartMinerCreationParams,
      options?: { replaceAttemptId?: string },
    ) => {
      setErrorMessage(null);
      const w = walletRef.current;
      const chainId = w.chainId ?? null;
      const chainNameKey =
        chainId !== null ? (CHAIN_IDS[chainId] ?? null) : null;
      const feeWei =
        chainNameKey && feeConfigRef.current
          ? (feeConfigRef.current.find((e) => e.chain === chainNameKey)
              ?.feeWei ?? 0n)
          : 0n;
      const needsFee = feeWei > 0n && !!chainNameKey;
      const recipient = feeRecipientRef.current;

      if (needsFee) {
        if (!recipient || !recipient.startsWith("0x")) {
          setErrorMessage("Fee recipient not configured. Contact an admin.");
          return;
        }
        if (!principalRef.current) {
          setErrorMessage(
            "Sign in with Internet Identity first — your principal is required to bind the creation fee.",
          );
          return;
        }
      }

      // Persist BEFORE sendTransaction so a reload during the wallet prompt
      // still shows the tile (hash is null until the wallet returns it).
      const id = options?.replaceAttemptId ?? newAttemptId();
      const stamp = Date.now();
      const attempt: MinerAttempt = {
        id,
        name: params.name,
        gritAmount: params.gritAmount.toString(),
        rate: params.rate.toString(),
        feeChain: needsFee ? chainNameKey : null,
        chainId,
        feeTxHash: null,
        status: needsFee ? "confirming_fee" : "creating",
        createdAt: stamp,
        updatedAt: stamp,
      };
      // Committed raw (not normalized): this session still holds the wallet
      // call, so the tile reads CONFIRMING while the signature prompt is up.
      // normalizeAttempt only applies to records reloaded from storage, where
      // a null hash means the relay never got the tx.
      commit([...attemptsRef.current.filter((a) => a.id !== id), attempt]);
      activeIdRef.current = id;

      if (!needsFee) {
        setActiveStep("creating");
        await runCreate(id);
        return;
      }

      setActiveStep("paying_fee");
      let feeTxHash: string;
      try {
        feeTxHash = await w.sendTransaction({
          to: recipient as `0x${string}`,
          data: buildMinerFeeBindingData(principalRef.current ?? ""),
          value: feeWei,
          chainId: chainId ?? undefined,
        });
      } catch (err) {
        // Nothing was paid — drop the placeholder so the user can click
        // Create again immediately instead of hitting a dead end.
        removeAttempt(id);
        activeIdRef.current = null;
        setActiveStep("idle");
        setErrorMessage(walletSendErrorMessage(err));
        return;
      }

      updateAttempt(id, { feeTxHash, status: "confirming_fee" });
      windowStartRef.current.set(id, Date.now());
      setActiveStep("confirming_fee");

      // Give the chain real time to index the fee before the canister is
      // asked to verify it (the v340 orphan: createMiner raced the RPCs).
      const receipt = await waitBurnReceipt(
        chainId ?? 0,
        feeTxHash,
        receiptWindowMs(chainId),
        FEE_RECEIPT_POLL_MS,
      );
      if (receipt.settled && !receipt.success) {
        // status 0x0 — the fee tx reverted; a retry can never succeed.
        updateAttempt(id, { status: "failed_fee" });
        if (activeIdRef.current === id) {
          activeIdRef.current = null;
          setActiveStep("idle");
          setErrorMessage(
            "The fee transaction failed on-chain. Send a new fee payment to create this miner.",
          );
        }
        return;
      }
      if (receipt.settled) {
        updateAttempt(id, { status: "creating" });
        if (activeIdRef.current === id) setActiveStep("creating");
      } else {
        // Window expired: stay in confirming_fee and let the retry loop drive.
        return;
      }
      await runCreate(id);
    },
    [commit, removeAttempt, runCreate, updateAttempt],
  );

  const retryNow = useCallback(
    async (attemptId: string) => {
      const attempt = attemptsRef.current.find((a) => a.id === attemptId);
      if (!attempt) return;
      if (attempt.feeTxHash === null && attempt.feeChain !== null) {
        updateAttempt(attemptId, { status: "action_needed" });
        return;
      }
      setErrorMessage(null);
      if (activeIdRef.current === attemptId) setActiveStep("creating");
      await runCreate(attemptId);
    },
    [runCreate, updateAttempt],
  );

  const dismiss = useCallback(
    (attemptId: string) => {
      removeAttempt(attemptId);
      if (activeIdRef.current === attemptId) {
        activeIdRef.current = null;
        setActiveStep("idle");
      }
    },
    [removeAttempt],
  );

  // Auto-retry loop. `creating` attempts retry immediately; `confirming_fee`
  // ones join in once their receipt window has elapsed (before that the
  // frontend receipt poll is the cheaper observer). Each attempt is
  // isolated in runCreate's try/catch, so one failure never kills the loop.
  useEffect(() => {
    const iv = setInterval(() => {
      const stamp = Date.now();
      for (const attempt of attemptsRef.current) {
        if (inFlightRef.current.has(attempt.id)) continue;
        if (attempt.feeTxHash === null && attempt.feeChain !== null) continue;
        const windowElapsed =
          stamp - (windowStartRef.current.get(attempt.id) ?? 0) >=
          receiptWindowMs(attempt.chainId);
        const eligible =
          attempt.status === "creating" ||
          (attempt.status === "confirming_fee" && windowElapsed);
        if (!eligible) continue;
        void runCreate(attempt.id);
      }
    }, CREATE_RETRY_INTERVAL_MS);
    return () => clearInterval(iv);
  }, [runCreate]);

  // Slow tick so the grace-window escalation and dismiss button appear
  // without a re-render per second.
  useEffect(() => {
    if (attempts.length === 0) return;
    const iv = setInterval(() => setNow(Date.now()), 5_000);
    return () => clearInterval(iv);
  }, [attempts.length]);

  const canDismiss = useCallback(
    (attempt: MinerAttempt) => {
      if (
        attempt.status === "action_needed" ||
        attempt.status === "failed_fee"
      ) {
        return true;
      }
      return now - attempt.createdAt >= graceMs(attempt.chainId);
    },
    [now],
  );

  const isEscalated = useCallback(
    (attempt: MinerAttempt) => {
      if (
        attempt.status !== "confirming_fee" &&
        attempt.status !== "creating"
      ) {
        return false;
      }
      return now - attempt.createdAt >= graceMs(attempt.chainId);
    },
    [now],
  );

  return {
    attempts,
    activeStep,
    errorMessage,
    start,
    retryNow,
    dismiss,
    canDismiss,
    isEscalated,
    now,
  };
}
