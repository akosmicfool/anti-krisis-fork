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
 * - pending      → amber, pulsing clock, "Confirming…"
 * - pending_fee  → orange, warning/card icon, "Retry Fee"
 * - verified     → emerald, check, "Verified"
 * - failed       → red, X, "Failed"
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

  const label = isFeeStatus
    ? "Fee Failed — Retry"
    : isPending
      ? "Confirming…"
      : isVerified
        ? "Verified"
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
