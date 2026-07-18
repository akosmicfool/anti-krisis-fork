import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Loader2,
  Pause,
  Play,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { MinerView } from "../backend";
import { MinerStatus } from "../backend";
import { useEditMiner, useMyBalance } from "../hooks/use-backend";
import { formatGrit } from "../types";

interface EditMinerModalProps {
  miner: MinerView;
  open: boolean;
  onClose: () => void;
}

export function EditMinerModal({ miner, open, onClose }: EditMinerModalProps) {
  const { data: gritBalance = 0n } = useMyBalance();
  const editMiner = useEditMiner();

  const [name, setName] = useState(miner.name);
  const [topUpInput, setTopUpInput] = useState("");
  const [rate, setRate] = useState(Number(miner.miningRate) / 1_000_000_000);
  const [step, setStep] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Reset when miner changes
  useEffect(() => {
    void miner.id; // ensure re-run when miner identity changes
    setName(miner.name);
    setTopUpInput("");
    setRate(Number(miner.miningRate) / 1_000_000_000);
    setStep("idle");
    setErrorMsg(null);
  }, [miner.id, miner.name, miner.miningRate]);

  const topUpParsed = topUpInput.trim()
    ? BigInt(Math.floor(Number(topUpInput.trim()) * 1_000_000_000))
    : null;
  const hasInsufficientTopUp =
    topUpParsed !== null && topUpParsed > gritBalance;

  const isBusy = step === "saving";
  const isPaused = miner.status === MinerStatus.paused;
  const isExhausted = miner.status === MinerStatus.exhausted;

  const rateDisplay = rate.toFixed(0);

  function handleClose() {
    if (isBusy) return;
    onClose();
  }

  async function handleSave() {
    if (isBusy) return;
    setErrorMsg(null);
    setStep("saving");

    try {
      const nameChanged = name.trim() !== miner.name ? name.trim() : null;
      const rateChanged =
        BigInt(rate) * 1_000_000_000n !== miner.miningRate
          ? BigInt(rate) * 1_000_000_000n
          : null;

      const result = await editMiner.mutateAsync({
        minerId: miner.id,
        nameChange: nameChanged,
        topUp: topUpParsed,
        rateChange: rateChanged,
        pause: null,
      });

      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }

      setStep("done");
      toast.success("Miner updated successfully.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      setErrorMsg(msg);
      setStep("error");
    }
  }

  async function handleTogglePause() {
    if (isBusy || isExhausted) return;
    setErrorMsg(null);
    setStep("saving");

    try {
      const result = await editMiner.mutateAsync({
        minerId: miner.id,
        nameChange: null,
        topUp: null,
        rateChange: null,
        pause: !isPaused,
      });

      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }

      setStep("done");
      toast.success(isPaused ? "Miner resumed." : "Miner paused.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      setErrorMsg(msg);
      setStep("error");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid="mining.edit_miner_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display font-black uppercase tracking-widest flex items-center gap-2">
            <Cpu className="h-5 w-5 text-accent" />
            Edit Miner
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-1">
          {/* Current status */}
          <div className="flex items-center justify-between rounded border border-border/60 bg-muted/20 px-3 py-2">
            <span className="text-xs font-mono text-white uppercase tracking-widest">
              Status
            </span>
            <div className="flex items-center gap-2">
              {miner.status === MinerStatus.active && (
                <span className="inline-flex items-center px-2 py-0.5 rounded border font-mono text-[10px] uppercase tracking-widest bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                  Active
                </span>
              )}
              {miner.status === MinerStatus.paused && (
                <span className="inline-flex items-center px-2 py-0.5 rounded border font-mono text-[10px] uppercase tracking-widest bg-yellow-500/15 text-yellow-400 border-yellow-500/30">
                  Paused
                </span>
              )}
              {miner.status === MinerStatus.exhausted && (
                <span className="inline-flex items-center px-2 py-0.5 rounded border font-mono text-[10px] uppercase tracking-widest bg-red-500/15 text-red-400 border-red-500/30">
                  Exhausted
                </span>
              )}
              <span className="font-mono text-xs text-muted-foreground">
                <Zap className="h-3 w-3 inline mr-1 text-accent" />
                {formatGrit(miner.gritBalance)} GRIT
              </span>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="edit-miner-name"
              className="text-xs uppercase tracking-widest text-white font-mono"
            >
              Miner Name
            </label>
            <input
              id="edit-miner-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isBusy || step === "done"}
              maxLength={48}
              className="w-full bg-background border border-border rounded-md h-10 px-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-50 transition-smooth"
              data-ocid="mining.edit_name_input"
            />
          </div>

          {/* Top up GRIT */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="edit-topup"
                className="text-xs uppercase tracking-widest text-white font-mono"
              >
                Top Up GRIT
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
                id="edit-topup"
                type="number"
                min="0"
                step="any"
                value={topUpInput}
                onChange={(e) => setTopUpInput(e.target.value)}
                placeholder="Optional top-up amount"
                disabled={isBusy || step === "done"}
                className={[
                  "w-full bg-background border rounded-md h-10 px-3 pr-16 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-50 transition-smooth",
                  hasInsufficientTopUp ? "border-red-500/60" : "border-border",
                ].join(" ")}
                data-ocid="mining.edit_topup_input"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
                GRIT
              </span>
            </div>
            {hasInsufficientTopUp && (
              <p
                className="text-xs text-red-400 font-mono"
                data-ocid="mining.edit_topup_input.field_error"
              >
                Insufficient GRIT balance.
              </p>
            )}
          </div>

          {/* Mining rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="edit-rate"
                className="text-xs uppercase tracking-widest text-white font-mono"
              >
                Mining Rate
              </label>
              <span className="font-mono text-sm font-bold text-accent">
                {rateDisplay} B GRIT/day
              </span>
            </div>
            <input
              id="edit-rate"
              type="range"
              min={1}
              max={10}
              step={1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              disabled={isBusy || step === "done"}
              className="w-full accent-accent cursor-pointer disabled:opacity-50"
              data-ocid="mining.edit_rate_slider"
            />
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
              <span>1B/day (min)</span>
              <span>10B/day (max)</span>
            </div>
          </div>

          {/* Pause / Resume toggle */}
          {!isExhausted && (
            <Button
              type="button"
              variant="outline"
              onClick={handleTogglePause}
              disabled={isBusy || step === "done"}
              className={[
                "w-full border font-mono text-xs uppercase tracking-widest gap-2 transition-smooth",
                isPaused
                  ? "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                  : "border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10",
              ].join(" ")}
              data-ocid="mining.edit_pause_toggle"
            >
              {isPaused ? (
                <>
                  <Play className="h-3.5 w-3.5" /> Resume Miner
                </>
              ) : (
                <>
                  <Pause className="h-3.5 w-3.5" /> Pause Miner
                </>
              )}
            </Button>
          )}

          {/* Step indicator */}
          <AnimatePresence mode="wait">
            {isBusy && (
              <motion.div
                key="saving"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="flex items-center gap-2 text-sm font-mono text-accent"
                data-ocid="mining.edit_loading_state"
              >
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                Saving changes…
              </motion.div>
            )}
            {step === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm font-mono text-emerald-400"
                data-ocid="mining.edit_success_state"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Changes saved!
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
                data-ocid="mining.edit_error_state"
              >
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-400">{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

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
                  data-ocid="mining.edit_cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isBusy || hasInsufficientTopUp || step === "error"}
                  className="flex-1 bg-accent text-background hover:bg-accent/90 font-display font-black uppercase tracking-widest gap-2 transition-smooth disabled:opacity-40"
                  data-ocid="mining.edit_save_button"
                >
                  {isBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  Save
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={handleClose}
                className="w-full bg-accent text-background hover:bg-accent/90 font-display font-black uppercase tracking-widest transition-smooth"
                data-ocid="mining.edit_close_button"
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
