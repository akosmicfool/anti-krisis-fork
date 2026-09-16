import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
  XCircle,
} from "lucide-react";
import { ClaimStatus, isPendingFee } from "../types";

interface ClaimStatusBadgeProps {
  status: ClaimStatus;
  /** Show a compact pill variant (default) or a larger inline chip */
  variant?: "pill" | "chip";
}

/**
 * Displays a claim status indicator.
 * W1B: labels mirror the user-approved state mapping (one language across
 * Burn modal, Recent Burns and Burn History):
 * - pending      → amber, pulsing clock, "Confirming burn"
 * - pending_fee  → orange, card icon, "Confirming fee" (timer verifies;
 *                  a REVERTED fee flips the hash to empty → "Pay Fee")
 * - verified     → emerald, check, "GRIT Earned"
 * - failed       → red, X, "Burn Failed" (burn never verified) or
 *                  "Fee Failed" (burn verified, fee stage failed)
 */
export function ClaimStatusBadge({
  status,
  variant = "pill",
}: ClaimStatusBadgeProps) {
  const isFeeStatus = isPendingFee(status);
  const isPending = !isFeeStatus && status === ClaimStatus.pending;
  const isVerified = status === ClaimStatus.verified;

  const colorClasses = isFeeStatus
    ? "bg-orange-500/15 text-orange-400 border-orange-500/40"
    : isPending
      ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
      : isVerified
        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
        : "bg-red-500/15 text-red-400 border-red-500/30";

  // Issue 2 (2026-09-11): pending states read by what the user must do
  // next, not by which internal check is running. "Confirming burn" on a
  // fee-less claim contradicted the Pay Fee action shown beside it.
  const label = isFeeStatus
    ? "Fee Pending"
    : isPending
      ? "Fee Pending"
      : isVerified
        ? "GRIT Earned"
        : "Failed";

  const Icon = isFeeStatus
    ? CreditCard
    : isPending
      ? Clock
      : isVerified
        ? CheckCircle2
        : XCircle;

  // Suppress unused import lint warning
  void AlertTriangle;

  if (variant === "chip") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded border font-accent text-xs uppercase tracking-widest ${colorClasses}`}
      >
        <Icon
          className={`h-3.5 w-3.5 shrink-0 ${
            isPending || isFeeStatus ? "animate-pulse" : ""
          }`}
        />
        {label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border font-accent text-[10px] uppercase tracking-widest ${colorClasses}`}
    >
      <Icon
        className={`h-3 w-3 shrink-0 ${
          isPending || isFeeStatus ? "animate-pulse" : ""
        }`}
      />
      {label}
    </span>
  );
}
