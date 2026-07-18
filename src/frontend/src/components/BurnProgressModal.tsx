import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export type BurnStep =
  | "idle"
  | "burning"
  | "awaiting_confirm"
  | "confirming_on_chain"
  | "paying_fee"
  | "awaiting_fee_confirm"
  | "submitting_claim"
  | "pending_verification"
  | "pending_fee"
  | "verified"
  | "failed";

interface BurnProgressModalProps {
  open: boolean;
  step: BurnStep;
  verifiedGrit: bigint | null;
  errorMsg: string | null;
  priceNote?: string | null;
  userRejected?: boolean;
  onClose: () => void;
  onContinueInBackground: () => void;
  formatGrit: (v: bigint) => string;
}

// Map FSM step → modal step index (1-based)
function getModalStep(step: BurnStep): 1 | 2 | 3 {
  if (
    step === "burning" ||
    step === "awaiting_confirm" ||
    step === "confirming_on_chain"
  )
    return 1;
  if (
    step === "paying_fee" ||
    step === "awaiting_fee_confirm" ||
    step === "submitting_claim" ||
    step === "pending_verification" ||
    step === "pending_fee"
  )
    return 2;
  return 3; // verified | failed
}

function getStepStatus(step: BurnStep): string {
  switch (step) {
    case "burning":
    case "awaiting_confirm":
      return "Awaiting wallet confirmation…";
    case "confirming_on_chain":
      return "Waiting for RPC indexing…";
    case "paying_fee":
      return "Calculating platform fee…";
    case "submitting_claim":
      return "Submitting claim to ICP…";
    case "pending_verification":
      return "Pending — monitoring transaction…";
    case "pending_fee":
      return "Awaiting platform fee confirmation... This may take a few minutes on Ethereum.";
    case "awaiting_fee_confirm":
      return "Waiting for platform fee to confirm…";
    case "verified":
      return "GRIT Minted!";
    case "failed":
      return "Transaction failed";
    default:
      return "";
  }
}

const STEP_LABELS = [
  "Confirming burn transaction",
  "Paying platform fees",
  "GRIT credit status",
];

function StepDot({
  index,
  activeIndex,
  isCompleted,
  isFailed,
  userRejected,
}: {
  index: number;
  activeIndex: number;
  isCompleted: boolean;
  isFailed: boolean;
  userRejected: boolean;
}) {
  const isActive = index === activeIndex;
  const isPast = index < activeIndex;

  // When user rejected before any tx was submitted, past steps should show
  // as cancelled (X), not done (checkmark) — they never actually completed.
  if (isPast && userRejected) {
    return (
      <div className="w-7 h-7 rounded-none border-2 border-red-500/60 bg-red-500/10 flex items-center justify-center shrink-0">
        <XCircle className="h-4 w-4 text-red-400/80" />
      </div>
    );
  }

  if (isPast && !isFailed) {
    return (
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-7 h-7 rounded-none border-2 border-accent bg-accent/20 flex items-center justify-center shrink-0"
      >
        <CheckCircle2 className="h-4 w-4 text-accent" />
      </motion.div>
    );
  }

  if (isActive && isFailed) {
    return (
      <div className="w-7 h-7 rounded-none border-2 border-red-500 bg-red-500/10 flex items-center justify-center shrink-0">
        <XCircle className="h-4 w-4 text-red-400" />
      </div>
    );
  }

  if (isActive && isCompleted) {
    return (
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-7 h-7 rounded-none border-2 border-accent bg-accent/20 flex items-center justify-center shrink-0"
      >
        <Sparkles className="h-4 w-4 text-accent" />
      </motion.div>
    );
  }

  if (isActive) {
    return (
      <div className="w-7 h-7 rounded-none border-2 border-accent bg-accent/10 flex items-center justify-center shrink-0 animate-energy-glow">
        <Loader2 className="h-3.5 w-3.5 text-accent animate-spin" />
      </div>
    );
  }

  // Future step
  return (
    <div className="w-7 h-7 rounded-none border-2 border-border/50 bg-muted/20 flex items-center justify-center shrink-0">
      <span className="text-xs font-accent text-muted-foreground/60">
        {index + 1}
      </span>
    </div>
  );
}

export function BurnProgressModal({
  open,
  step,
  verifiedGrit,
  errorMsg,
  priceNote,
  userRejected = false,
  onClose,
  onContinueInBackground,
  formatGrit,
}: BurnProgressModalProps) {
  const activeIndex = getModalStep(step) - 1; // 0-based
  const isVerified = step === "verified";
  const isFailed = step === "failed";
  const isTerminal = isVerified || isFailed;
  const canBackground = !isTerminal;
  const statusText = getStepStatus(step);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
            onClick={isTerminal ? onClose : onContinueInBackground}
            data-ocid="burn_modal.backdrop"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-md bg-card border-2 border-accent/40 shadow-[0_0_32px_rgba(0,255,65,0.15)] p-0 overflow-hidden"
              data-ocid="burn_modal.dialog"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-accent/20 bg-accent/5">
                <h2 className="font-display text-2xl text-accent uppercase tracking-widest">
                  Burn Progress
                </h2>
                <button
                  type="button"
                  onClick={isTerminal ? onClose : onContinueInBackground}
                  className="w-7 h-7 flex items-center justify-center border border-border/60 hover:border-accent/60 hover:text-accent text-muted-foreground transition-colors duration-200"
                  aria-label="Close burn progress"
                  data-ocid="burn_modal.close_button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Steps */}
              <div className="px-5 py-5 space-y-4">
                {STEP_LABELS.map((label, i) => {
                  const isActive = i === activeIndex;
                  const isPast = i < activeIndex;
                  const stepIsVerifiedFinal = isVerified && i === 2;
                  const stepIsFailedFinal = isFailed && i === activeIndex;

                  return (
                    <motion.div
                      key={label}
                      initial={false}
                      animate={{
                        opacity: i > activeIndex ? 0.45 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start gap-4"
                      data-ocid={`burn_modal.step.${i + 1}`}
                    >
                      <StepDot
                        index={i}
                        activeIndex={activeIndex}
                        isCompleted={stepIsVerifiedFinal}
                        isFailed={stepIsFailedFinal}
                        userRejected={userRejected}
                      />

                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-accent uppercase tracking-widest ${
                              isActive || isPast
                                ? "text-accent/70"
                                : "text-muted-foreground/50"
                            }`}
                          >
                            Step {i + 1}
                          </span>
                          {(isPast || stepIsVerifiedFinal) && !userRejected && (
                            <span className="text-xs font-accent text-accent/50 uppercase tracking-widest">
                              ✓ Done
                            </span>
                          )}
                          {isPast && userRejected && (
                            <span className="text-xs font-accent text-red-400/70 uppercase tracking-widest">
                              Cancelled
                            </span>
                          )}
                        </div>
                        <p
                          className={`font-display text-xl uppercase tracking-wide ${
                            isActive
                              ? isFailed
                                ? "text-red-400"
                                : isVerified
                                  ? "text-accent"
                                  : "text-foreground"
                              : isPast
                                ? "text-foreground/60"
                                : "text-muted-foreground/40"
                          }`}
                        >
                          {label}
                        </p>

                        {/* Active status text */}
                        <AnimatePresence mode="wait">
                          {isActive && statusText && (
                            <motion.p
                              key={step}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 6 }}
                              transition={{ duration: 0.2 }}
                              className={`text-sm font-body mt-1 ${
                                isFailed
                                  ? "text-red-400"
                                  : isVerified
                                    ? "text-accent"
                                    : "text-muted-foreground"
                              }`}
                              data-ocid="burn_modal.status_text"
                            >
                              {isVerified && "🎉 "}
                              {statusText}
                            </motion.p>
                          )}
                        </AnimatePresence>

                        {/* GRIT amount on verified */}
                        {stepIsVerifiedFinal &&
                          verifiedGrit !== null &&
                          verifiedGrit > 0n && (
                            <motion.p
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="font-mono font-bold text-accent text-lg mt-1 energy-pulse"
                              data-ocid="burn_modal.grit_amount"
                            >
                              +{formatGrit(verifiedGrit)} GRIT
                            </motion.p>
                          )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Error message — only shown for genuine failures */}
              <AnimatePresence>
                {errorMsg && isFailed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mx-5 mb-4 rounded border border-red-500/30 bg-red-500/10 px-3 py-2.5 flex items-start gap-2"
                    data-ocid="burn_modal.error_state"
                  >
                    <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-400 font-body">{errorMsg}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Non-fatal price note — shown as grey info, never red */}
              <AnimatePresence>
                {priceNote && !isFailed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mx-5 mb-4 rounded border border-border/40 bg-muted/20 px-3 py-2.5 flex items-start gap-2"
                    data-ocid="burn_modal.price_note"
                  >
                    <AlertTriangle className="h-4 w-4 text-muted-foreground/60 shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground font-body">
                      {priceNote}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Failed fee note — shown only for failed state, no retry button here */}
              <AnimatePresence>
                {isFailed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mx-5 mb-1"
                    data-ocid="burn_modal.failed_fee_note"
                  >
                    <p className="text-xs text-muted-foreground font-body">
                      If a fee payment failed, check Burn History to retry.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer actions */}
              <div className="px-5 pb-5 flex flex-col gap-2">
                {isTerminal ? (
                  <Button
                    type="button"
                    onClick={onClose}
                    className="w-full h-11 bg-accent text-background hover:bg-accent/90 font-display text-lg uppercase tracking-widest transition-smooth"
                    data-ocid="burn_modal.close_button"
                  >
                    {isVerified ? "Done" : "Close"}
                  </Button>
                ) : canBackground ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onContinueInBackground}
                    className="w-full h-11 border-border/60 hover:border-accent/60 font-body text-sm text-muted-foreground hover:text-accent tracking-wide transition-smooth"
                    data-ocid="burn_modal.background_button"
                  >
                    Continue in background
                  </Button>
                ) : null}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
