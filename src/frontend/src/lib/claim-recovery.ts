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
// - No expiry: claims NEVER age out (`grit.mo` cleanupExpiredClaims is a
//   no-op). #pending stays #pending until the burn verifies or the backend
//   reports a definitive on-chain failure; the UI reflects whatever the
//   backend reports.

import { type ClaimRecord, ClaimStatus, isPendingFee } from "../types";
import { fetchDexScreenerPrice } from "../utils/dexscreener";

export type ClaimAction =
  | { kind: "verifying_burn"; label: "Confirming burn" }
  | { kind: "recheck_burn"; label: "Re-check Burn" }
  | { kind: "pay_fee"; label: "Pay Fee" }
  | { kind: "verifying_fee"; label: "Confirming fee" }
  | { kind: "recheck_fee"; label: "Re-check Fee" }
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
      //   - the BURN never verified on-chain (burn tx failed/reverted) →
      //     amountBurned stays 0.0
      //   - the burn DID verify and the FEE stage failed definitively
      //     (binding mismatch, replaced/rejected fee, ...) → amountBurned > 0
      //
      // AKK-CRIT-7: the two flavors recover DIFFERENTLY. Re-sending the same
      // doomed fee tx was the fee-stage dead end: Retry Claim submitted
      // claim.feeTxHash ?? "" and the backend refused every non-#pendingFee
      // status — a deterministic failure loop whose only exit was a new burn.
      //   - burn verified → Pay Fee, with a NEW fee hash: the backend's
      //     retryFeeClaim now accepts a #failed claim whose burn verified
      //     (stores the new hash, #pendingFee rescue, then #verified credit).
      //   - burn never verified → Retry Claim: re-initiate the claim (the
      //     backend resurrects the record and re-verifies the burn; a fee
      //     could not be priced on it anyway).
      const burnVerified = claim.amountBurned > 0;
      if (burnVerified) {
        return { kind: "pay_fee", label: "Pay Fee" };
      }
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
  return action.kind === "pay_fee" || action.kind === "retry_claim";
}

/**
 * Shown when the live price cannot be established for a recovery fee send.
 * Never send a fee the backend cannot size-check — the same fail-closed rule
 * as the zero-usdValue guard it replaces.
 */
export const LIVE_PRICE_UNAVAILABLE_MSG =
  "Live price unavailable — try again in a moment; sending a fee now would be mis-sized.";

/**
 * AKK-CRIT-10: size a recovery fee the way the BACKEND checks it.
 *
 * retryFeeClaim floors a new fee against the CURRENT oracle price of the
 * on-chain confirmed burn amount (grit-api.mo `usdValueRetry = amountBurned ×
 * effectivePrice`), so the frontend must size the send from
 * `amountBurned × live price` at send time. The stored claim-time `usdValue`
 * goes stale on any price move — after a >7% rise a fee sized from it fails
 * the backend's underpaid floor even though the send was "correct" at claim
 * time (the AKK-CRIT-3 sizing rule used the stored value; this replaces it).
 *
 * Returns null when the live price is unavailable (fetch failed or <= 0).
 * Callers MUST NOT send a fee in that case and should surface
 * LIVE_PRICE_UNAVAILABLE_MSG instead.
 */
export async function liveBurnValueUsd(
  claim: ClaimRecord,
): Promise<number | null> {
  // Per-claim fetch with the claim's own chain: the shared util prefers pairs
  // on that chain (and falls back to base-token-true pairs elsewhere).
  const price = await fetchDexScreenerPrice(claim.tokenAddress, claim.chain);
  if (price === null || !(price > 0)) return null;
  const value = Number(claim.amountBurned) * price;
  return value > 0 ? value : null;
}
