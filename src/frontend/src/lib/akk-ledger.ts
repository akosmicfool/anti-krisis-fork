import { Actor, HttpAgent, type Identity } from "@icp-sdk/core/agent";
import type { IDL } from "@icp-sdk/core/candid";
import type { Principal } from "@icp-sdk/core/principal";

const idlFactory: IDL.InterfaceFactory = ({ IDL: I }) => {
  const Account = I.Record({
    owner: I.Principal,
    subaccount: I.Opt(I.Vec(I.Nat8)),
  });
  const TransferArg = I.Record({
    from_subaccount: I.Opt(I.Vec(I.Nat8)),
    to: Account,
    amount: I.Nat,
    fee: I.Opt(I.Nat),
    memo: I.Opt(I.Vec(I.Nat8)),
    created_at_time: I.Opt(I.Nat64),
  });
  const TransferError = I.Variant({
    BadFee: I.Record({ expected_fee: I.Nat }),
    BadBurn: I.Record({ min_burn_amount: I.Nat }),
    InsufficientFunds: I.Record({ balance: I.Nat }),
    TooOld: I.Null,
    CreatedInFuture: I.Record({ ledger_time: I.Nat64 }),
    Duplicate: I.Record({ duplicate_of: I.Nat }),
    TemporarilyUnavailable: I.Null,
    GenericError: I.Record({ error_code: I.Nat, message: I.Text }),
  });
  const TransferResult = I.Variant({
    Ok: I.Nat,
    Err: TransferError,
  });
  return I.Service({
    icrc1_fee: I.Func([], [I.Nat], ["query"]),
    icrc1_transfer: I.Func([TransferArg], [TransferResult], []),
  });
};

export type TransferErr = {
  BadFee?: { expected_fee: bigint };
  BadBurn?: { min_burn_amount: bigint };
  InsufficientFunds?: { balance: bigint };
  TooOld?: null;
  CreatedInFuture?: { ledger_time: bigint };
  Duplicate?: { duplicate_of: bigint };
  TemporarilyUnavailable?: null;
  GenericError?: { error_code: bigint; message: string };
};

export type AkkLedgerService = {
  icrc1_fee: () => Promise<bigint>;
  icrc1_transfer: (arg: {
    from_subaccount: [] | [Uint8Array];
    to: { owner: Principal; subaccount: [] | [Uint8Array] };
    amount: bigint;
    fee: [] | [bigint];
    memo: [] | [Uint8Array];
    created_at_time: [] | [bigint];
  }) => Promise<{ Ok: bigint } | { Err: TransferErr }>;
};

/** Resolve IC host from /env.json (same rules as caffeine config). */
export async function resolveBackendHost(): Promise<string | undefined> {
  try {
    const baseUrl = (import.meta.env.BASE_URL || "/").endsWith("/")
      ? import.meta.env.BASE_URL || "/"
      : `${import.meta.env.BASE_URL}/`;
    const response = await fetch(`${baseUrl}env.json`);
    if (!response.ok) return undefined;
    const config = (await response.json()) as { backend_host?: string };
    if (!config.backend_host || config.backend_host === "undefined") {
      return undefined;
    }
    return config.backend_host;
  } catch {
    return undefined;
  }
}

export async function createAkkLedgerActor(
  ledgerId: string,
  identity: Identity,
  host?: string,
): Promise<AkkLedgerService> {
  const agent = await HttpAgent.create({ identity, host });
  if (host?.includes("localhost")) {
    await agent.fetchRootKey().catch(() => undefined);
  }
  return Actor.createActor<AkkLedgerService>(idlFactory, {
    agent,
    canisterId: ledgerId,
  });
}

export async function transferAkk(opts: {
  ledgerId: string;
  identity: Identity;
  to: Principal;
  amountE8s: bigint;
  host?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const actor = await createAkkLedgerActor(
      opts.ledgerId,
      opts.identity,
      opts.host,
    );
    const fee = await actor.icrc1_fee();
    const result = await actor.icrc1_transfer({
      from_subaccount: [],
      to: { owner: opts.to, subaccount: [] },
      amount: opts.amountE8s,
      fee: [fee],
      memo: [],
      created_at_time: [],
    });
    if ("Ok" in result) return { ok: true };
    return { ok: false, error: friendlyTransferError(result.Err) };
  } catch (e) {
    return { ok: false, error: friendlyTransferError(e) };
  }
}

function friendlyTransferError(err: unknown): string {
  if (err && typeof err === "object") {
    const e = err as TransferErr & { message?: string };
    if ("InsufficientFunds" in e && e.InsufficientFunds !== undefined) {
      return "Insufficient AKK balance for this withdrawal.";
    }
    if ("BadFee" in e && e.BadFee !== undefined) {
      return "Incorrect transfer fee. Please try again.";
    }
    if (
      "TemporarilyUnavailable" in e &&
      e.TemporarilyUnavailable !== undefined
    ) {
      return "Ledger temporarily unavailable. Please try again.";
    }
    if ("TooOld" in e && e.TooOld !== undefined) {
      return "Transaction request expired. Please try again.";
    }
    if ("CreatedInFuture" in e && e.CreatedInFuture !== undefined) {
      return "Transaction timestamp is in the future.";
    }
    if ("Duplicate" in e && e.Duplicate !== undefined) {
      return "This transaction was already processed.";
    }
    if ("BadBurn" in e && e.BadBurn !== undefined) {
      return "Transfer amount is below the minimum required.";
    }
    if ("GenericError" in e && e.GenericError) {
      if (typeof e.GenericError.message === "string") {
        return e.GenericError.message;
      }
    }
    if (typeof e.message === "string" && e.message) return e.message;
  }
  if (err instanceof Error && err.message) return err.message;
  return "Withdrawal failed. Please try again.";
}
