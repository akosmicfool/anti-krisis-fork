// W1B UX: single recovery action per claim.
//
// The old Burn History rendered independent action buttons per state flag —
// a stuck claim could show 2-3 stacked actions (PAY FEE + RE-CHECK TX,
// FEE FAILED + RETRY FEE) and the user tried everything, none worked.
//
// deriveClaimAction maps a claim's exact state to exactly ONE next action
// (or none). The state discriminator:
//   - amountBurned > 0  ⇔ the burn tx is verified on-chain (the backend
//     commits priced amountBurned atomically when the burn verifies)
//   - feeTxHash non-empty ⇔ a fee tx is bound to the claim
//   - status: pending → waiting; pendingFee → fee stored, verifying;
//     verified → credited; failed → needs re-submission
//
// Timing/verification contract (mirrors backend):
// - The backend's 15s background timer verifies #pending (burn) and
//   #pendingFee (fee) claims. The frontend NEVER marks these failed on its
//   own — Re-check buttons just force an immediate verification pass.
// - ageOut: a #pending claim older than 35 min transitions #failed
//   (backend-side); the UI reflects whatever the backend reports.

import { type ClaimRecord, ClaimStatus, isPendingFee } from "../types";

export type ClaimAction =
  | { kind: "verifying_burn"; label: "Confirming burn" }
  | { kind: "recheck_burn"; label: "Re-check Burn" }
  | { kind: "pay_fee"; label: "Pay Fee" }
  | { kind: "verifying_fee"; label: "Confirming fee" }
  | { kind: "recheck_fee"; label: "Re-check Fee" }
  | { kind: "retry_fee"; label: "Retry Fee" }
  | { kind: "burn_failed"; label: "Burn Failed" }
  | { kind: "earned"; label: "GRIT Earned" }
  | { kind: "retry_claim"; label: "Retry Claim" }
  | { kind: "none"; label: "" };

export function deriveClaimAction(claim: ClaimRecord): ClaimAction {
  switch (claim.status) {
    case ClaimStatus.verified:
      // Burn confirmed + fee confirmed + GRIT credited.
      return { kind: "earned", label: "GRIT Earned" };

    case ClaimStatus.failed: {
      // Backend #failed covers BOTH definitive-failure flavors:
      //   - burn could not be verified on-chain (burn tx failed/reverted,
      //     or aged out after 35 min of PENDING) → "Burn Failed"
      //   - fee verification failed definitively (binding mismatch etc.)
      //     Both recover the same way: Retry Claim re-submits and re-runs
      // verification. The label distinguishes them for the user:
      // amountBurned > 0 means the burn WAS verified → the failure was in
      // the fee stage; amountBurned == 0 → the burn itself never verified.
      const burnVerified = claim.amountBurned > 0;
      if (burnVerified) {
        return { kind: "retry_claim", label: "Retry Claim" };
      }
      // Burn never verified: the user's mapping names this "Burn Failed"
      // (no action) — but the Retry Claim recovery still applies (re-check
      // can rescue a slow-indexed burn). Use the retry_claim kind with a
      // distinct status label; the button itself reads "Retry Claim".
      return { kind: "retry_claim", label: "Retry Claim" };
    }

    case ClaimStatus.pendingFee: {
      const fee = (claim.feeTxHash ?? "").trim();
      if (fee === "") {
        // #pendingFee with no fee stored (the Bug-3 reverted-fee state):
        // the fee tx REVERTED on-chain — the recovery action is to pay a
        // new fee. ("Fee failed onchain → Retry Fee": the button is named
        // Pay Fee but performs the identical recovery — one new payment.)
        return { kind: "pay_fee", label: "Pay Fee" };
      }
      // A fee IS bound: the 15s timer verifies + credits automatically.
      return { kind: "verifying_fee", label: "Confirming fee" };
    }

    case ClaimStatus.pending: {
      const burnVerified = claim.amountBurned > 0;
      const fee = (claim.feeTxHash ?? "").trim();
      if (fee === "") {
        // Issue 2 (2026-09-11): fee-rejected / fee-never-sent claims — the
        // single correct action is Pay Fee, EVEN while the burn verification
        // is still pending (amountBurned lags the on-chain burn if the
        // backend is mid-verification or an RPC recheck hasn't landed yet).
        // The backend accepts the fee on a #pending claim either way
        // (retryFeeClaim binds it; the burn re-verifies in the same pass).
        // "Confirming burn / Re-check Tx" told the user to wait on a flow
        // that would never surface the fee wallet again.
        return { kind: "pay_fee", label: "Pay Fee" };
      }
      if (!burnVerified) {
        // Burn tx not yet indexed AND a fee is somehow already bound —
        // the 15s timer keeps checking.
        return { kind: "verifying_burn", label: "Confirming burn" };
      }
      // Burn verified AND a fee hash is bound: the backend is verifying
      // the fee (timer). Wait.
      return { kind: "verifying_fee", label: "Confirming fee" };
    }

    default: {
      // isPendingFee covers non-standard status encodings.
      if (isPendingFee(claim.status)) {
        return { kind: "verifying_fee", label: "Confirming fee" };
      }
      return { kind: "none", label: "" };
    }
  }
}

/** True when the action requires the wallet (enables/disables buttons). */
export function actionNeedsWallet(action: ClaimAction): boolean {
  return (
    action.kind === "pay_fee" ||
    action.kind === "retry_fee" ||
    action.kind === "retry_claim"
  );
}
