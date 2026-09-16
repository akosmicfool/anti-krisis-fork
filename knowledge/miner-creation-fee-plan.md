# Miner creation fee — binding + verification (scoped plan)

Status: **approved to build** (owner, 2026-09-11). Not started.

## Why

The configured miner-creation fee is **not enforced anywhere**. `createMiner`'s
only gates are the launch-time check and having the GRIT stake; the only reader of
`minerCreationFees` is the display query (`lib/mining.mo:561`). The frontend
already shows the per-chain fee and already has a "Step 1" (wallet) before
"Step 2: call createMiner", but the canister never checks that Step 1 happened —
so a direct canister call creates miners for free, and raising the configured fee
later would change nothing. This plan implements the owner's stated design: free
to create *as long as the fee is actually paid*, with the fee raising-able later.

## Reused machinery (do not reinvent)

`lib/verification.mo` already owns the whole surface:
- `feePaidLogValue(json, collector, expectedPayer)` -> `#found({ valueWei; bindingHex }) | #missing | #unparseable`
- `feePaidPayerMatches(json, collector, payer)`
- `extractBindingHex(dataHex)`
- `fetchTxByHash` / `verifyFeeTxWithReceipt` + `transformResponse`
`grit-api.mo`'s `verifyFeeBinding` shows the exact verification order to mirror.

## Binding payload (must NOT be cross-usable with a claim fee)

- Claim (existing): `0x || byte(principalLen) || principalText || 32-byte burnHash`
- Miner (new):     `0x || byte(principalLen) || principalText || "MINE" (4 bytes)`
The trailing shapes differ, so each decoder rejects the other — a paid *claim*
fee can never be replayed as a *creation* fee, and vice versa. The principal must
be the CALLER's principal text, byte-exact (same rule as claims).

## Decisions (defaults chosen — confirm or override)

1. **Fee = 0 or unconfigured chain => creation is FREE** (gate off), matching the
   owner's "I will enable it in production" intent: setting a per-chain fee turns
   the gate on. Trade-off: forgetting to configure = spam stays open, exactly as
   today. (Alternative rejected: fee=0 => reject, which would block creation until
   configured and diverge from the stated launch plan.)
2. **Single-use enforcement needs state**: a consumed-fee map
   `minerFeeTxs : Map<Text, Bool>` (keyed by lowercased fee tx hash) in mining
   state, plus a migration in the chain (same pattern as 20260910_200000.mo).
   Without it one paid fee could create unlimited miners. (Alternative rejected:
   scanning `MinerRecord`s is O(miners) per creation and `MinerRecord` is a large
   stable type to change.)
3. **Candid change is accepted**: `createMiner(name, gritAmount, rate)` ->
   `createMiner(name, gritAmount, rate, feeChain, feeTxHash)`. Requires
   `pnpm bindgen` + frontend updates (`CreateMinerModal`, `useCreateMiner`,
   `mocks/backend.ts`).

## Backend work (test-first)

1. `lib/verification.mo`: `decodeMinerFeeBinding(bindingHex, expectedPrincipal) : { #ok; #err : Text }`
   + a pure `minerFeeShortfall(paidWei, requiredWei) : ?Nat` decision helper
   (mirrors `FeeAmount.amountCheckFloor`, so both are unit-testable).
2. `lib/mining.mo` state: `minerFeeTxs : Map<Text, Bool>`; `newMiningState` updated.
3. `mixins/mining-api.mo` `createMiner`: verify BEFORE any GRIT debit or state
   change — (a) fee configured for `feeChain` and > 0, else skip (decision 1);
   (b) receipt success; (c) collector `FeePaid` event present, payer == tx.from;
   (d) binding decodes to the CALLER's principal with the MINE tag; (e) paid >=
   configured fee (tolerance: exact-or-more, no tolerance band — the fee is a fixed
   amount, not a percentage); (f) fee tx not already consumed. Then mark consumed
   and create.
   Error strings must be actionable ("MINER_FEE_UNDERPAID", "MINER_FEE_REPLAY",
   "MINER_FEE_BINDING", "MINER_FEE_NOT_CONFIGURED").
4. `migrations/<ts>.mo`: chain step adding `minerFeeTxs` (empty map), OldActor /
   NewActor inlined like its predecessor.
5. Tests: binding decode (accept own shape; reject claim shape, wrong principal,
   truncated, non-hex); shortfall decision (0 paid vs required, exact, over);
   consumed-set (replay rejected, second distinct fee accepted); review-fix style
   test that the gate is skipped only when feeWei == 0.

## Frontend work

1. `lib/fee-binding.ts`: `buildMinerFeeBindingData(principalText)` (mirror of the
   claim builder, MINE tag).
2. `CreateMinerModal`: keep Step 1 (wallet pays `feeWei` to the collector with the
   new payload), capture the tx hash, pass `feeChain` + `feeTxHash` to
   `createMiner`; surface the backend error codes as user-facing messages.
3. Regen bindings; update the mock actor; typecheck/lint/build.

## Open item for the owner

The frontend's current Step 1 must be checked to see whether it already builds a
*claim-shaped* payload (it would then need the MINE variant) and whether it
already sends the fee to the collector — if it does, only the backend check is
missing; if not, both sides change.
