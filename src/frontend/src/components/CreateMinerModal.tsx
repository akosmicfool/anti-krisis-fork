import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle2, Cpu, Loader2, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateMiner,
  useMinerCreationFees,
  useMyBalance,
} from "../hooks/use-backend";
import { useGetFeeRecipient } from "../hooks/use-backend";
import { useWallet } from "../hooks/use-wallet";
import { CHAIN_IDS, formatGrit } from "../types";

interface CreateMinerModalProps {
  open: boolean;
  onClose: () => void;
}

const _MIN_RATE = 1_000_000_000n; // 1 billion GRIT/day
const _MAX_RATE = 10_000_000_000n; // 10 billion GRIT/day

function getChainNameFromId(chainId: number | null): string | null {
  if (chainId === 8453) return "base";
  if (chainId === 42220) return "celo";
  if (chainId === 10) return "optimism";
  if (chainId === 1) return "ethereum";
  return null;
}

function getNativeSymbol(chainId: number | null): string {
  if (chainId === 42220) return "CELO";
  return "ETH";
}

function getChainName(chainId: number | null): string {
  if (!chainId) return "Unknown";
  const map: Record<number, string> = {
    8453: "Base",
    42220: "Celo",
    10: "Optimism",
    1: "Ethereum",
  };
  return map[chainId] ?? `Chain ${chainId}`;
}

export function CreateMinerModal({ open, onClose }: CreateMinerModalProps) {
  const { data: gritBalance = 0n } = useMyBalance();
  const { data: feeConfig } = useMinerCreationFees();
  const { data: feeRecipient } = useGetFeeRecipient();
  const createMiner = useCreateMiner();
  const wallet = useWallet();

  const [name, setName] = useState("");
  const [gritInput, setGritInput] = useState("");
  const [rate, setRate] = useState(1_000_000_000); // store as number for slider
  const [step, setStep] = useState<
    "idle" | "paying_fee" | "creating" | "done" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const chainId = wallet.chainId;
  const chainNameKey = getChainNameFromId(chainId);
  const nativeSymbol = getNativeSymbol(chainId);
  const chainName = getChainName(chainId);

  const creationFeeWei: bigint =
    chainNameKey && feeConfig
      ? (feeConfig.find((e) => e.chain === chainNameKey)?.feeWei ?? 0n)
      : 0n;
  const creationFeeEth = Number(creationFeeWei) / 1e18;

  const parsedGrit = gritInput.trim()
    ? BigInt(Math.floor(Number(gritInput.trim()) * 1_000_000_000))
    : 0n;
  const hasInsufficientGrit = parsedGrit > gritBalance;
  const canCreate =
    step === "idle" &&
    name.trim().length > 0 &&
    parsedGrit > 0n &&
    !hasInsufficientGrit &&
    wallet.isConnected;

  function handleClose() {
    if (step === "paying_fee" || step === "creating") return;
    setName("");
    setGritInput("");
    setRate(1_000_000_000);
    setStep("idle");
    setErrorMsg(null);
    onClose();
  }

  async function handleCreate() {
    if (!canCreate) return;
    setErrorMsg(null);

    try {
      // Step 1: send creation fee if nonzero
      if (creationFeeWei > 0n) {
        if (!feeRecipient || !feeRecipient.startsWith("0x")) {
          setErrorMsg("Fee recipient not configured. Contact an admin.");
          setStep("error");
          return;
        }
        setStep("paying_fee");
        await wallet.sendTransaction({
          to: feeRecipient as `0x${string}`,
          data: "0x" as `0x${string}`,
          value: creationFeeWei,
          chainId: chainId ?? undefined,
        });
      }

      // Step 2: call createMiner on ICP
      setStep("creating");
      const result = await createMiner.mutateAsync({
        name: name.trim(),
        gritAmount: parsedGrit,
        rate: BigInt(rate),
      });

      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }

      setStep("done");
      toast.success(
        "Miner created! It will start competing from the next block.",
      );
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Unexpected error occurred.";
      setErrorMsg(msg);
      setStep("error");
    }
  }

  const isBusy = step === "paying_fee" || step === "creating";
  const rateDisplay = (rate / 1_000_000_000).toFixed(0);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid="mining.create_miner_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display font-black uppercase tracking-widest flex items-center gap-2">
            <Cpu className="h-5 w-5 text-accent" />
            Create Miner
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-1">
          {/* Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="miner-name"
              className="text-xs uppercase tracking-widest text-white font-mono"
            >
              Miner Name
            </label>
            <input
              id="miner-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Miner"
              disabled={isBusy || step === "done"}
              maxLength={20}
              className="w-full bg-background border border-border rounded-md h-10 px-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-50 transition-smooth"
              data-ocid="mining.miner_name_input"
            />
          </div>

          {/* GRIT load */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="grit-load"
                className="text-xs uppercase tracking-widest text-white font-mono"
              >
                Load GRIT
              </label>
              <span className="font-mono text-xs text-muted-foreground">
                Available:{" "}
                <span className="text-accent">
                  {formatGrit(gritBalance)} GRIT
                </span>
              </span>
            </div>
            <div className="relative">
              <input
                id="grit-load"
                type="number"
                min="0"
                step="any"
                value={gritInput}
                onChange={(e) => setGritInput(e.target.value)}
                placeholder="0"
                disabled={isBusy || step === "done"}
                className={[
                  "w-full bg-background border rounded-md h-10 px-3 pr-16 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-50 transition-smooth",
                  hasInsufficientGrit ? "border-red-500/60" : "border-border",
                ].join(" ")}
                data-ocid="mining.grit_load_input"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
                GRIT
              </span>
            </div>
            {hasInsufficientGrit && step !== "done" && (
              <p
                className="text-xs text-red-400 font-mono"
                data-ocid="mining.grit_load_input.field_error"
              >
                Insufficient GRIT balance.
              </p>
            )}
          </div>

          {/* Mining rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="mining-rate"
                className="text-xs uppercase tracking-widest text-white font-mono"
              >
                Mining Rate
              </label>
              <span className="font-mono text-sm font-bold text-accent">
                {rateDisplay} B GRIT/day
              </span>
            </div>
            <input
              id="mining-rate"
              type="range"
              min={1}
              max={10}
              step={1}
              value={rate / 1_000_000_000}
              onChange={(e) => setRate(Number(e.target.value) * 1_000_000_000)}
              disabled={isBusy || step === "done"}
              className="w-full accent-accent cursor-pointer disabled:opacity-50"
              data-ocid="mining.rate_slider"
            />
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
              <span>1B/day (min)</span>
              <span>10B/day (max)</span>
            </div>
          </div>

          {/* Creation fee display */}
          <div className="rounded border border-border/60 bg-muted/20 px-3 py-2.5 flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Creation Fee
            </span>
            <span className="font-mono text-sm font-bold text-foreground">
              {creationFeeWei === 0n
                ? "Free"
                : `${creationFeeEth.toFixed(6)} ${nativeSymbol} on ${chainName}`}
            </span>
          </div>

          {/* Step indicator */}
          <AnimatePresence mode="wait">
            {isBusy && (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="flex items-center gap-2 text-sm font-mono text-accent"
                data-ocid="mining.create_loading_state"
              >
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                {step === "paying_fee"
                  ? "Paying creation fee…"
                  : "Creating miner on ICP…"}
              </motion.div>
            )}
            {step === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm font-mono text-emerald-400"
                data-ocid="mining.create_success_state"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Miner created successfully!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2.5 flex items-start gap-2"
                data-ocid="mining.create_error_state"
              >
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-400">{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wallet not connected warning */}
          {!wallet.isConnected && (
            <div className="rounded border border-amber-500/30 bg-amber-500/10 px-3 py-2 flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <p className="text-xs text-amber-300 font-mono">
                Connect your EVM wallet to pay the creation fee.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            {step !== "done" ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isBusy}
                  className="flex-1 border-border font-mono text-xs uppercase tracking-widest transition-smooth"
                  data-ocid="mining.create_cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleCreate}
                  disabled={!canCreate || isBusy}
                  className="flex-1 bg-accent text-background hover:bg-accent/90 font-display font-black uppercase tracking-widest gap-2 transition-smooth disabled:opacity-40"
                  data-ocid="mining.create_submit_button"
                >
                  {isBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  {step === "paying_fee" ? "Paying…" : "Create"}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={handleClose}
                className="w-full bg-accent text-background hover:bg-accent/90 font-display font-black uppercase tracking-widest transition-smooth"
                data-ocid="mining.create_close_button"
              >
                Done
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
