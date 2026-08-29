# AKK-4 Session Handoff — Fee Binding via FeeCollector Contract

Written 2028-08-27 for a fresh session. Read this before touching the code.
Companion docs: `vulnerability-audit-v264.md` (all findings), `icp-build-deploy-playbook.md` (build/deploy chain).

## Where things stand

- **Live prod = Caffeine v277 = GitHub main (`06d5908`)**: contains AKK-1b, AKK-2, AKK-3,
  UX price-note. NO AKK-4. Stable and working.
- **Draft v279**: adds AKK-4-v1 binding-in-fee-tx + error-surfacing fixes. BROKEN for
  users: wallets reject calldata-carrying transfers to internal accounts (viem error
  "External transactions to internal accounts cannot include data"), so the fee tx can
  never be signed. This is the version to build on.
- **Local commit `ce21506` (AKK-4b self-send design)**: BUILT BUT REJECTED by user —
  do not push; revert it before starting Option B work.

## Agreed decision (do not re-litigate)

Option B: **FeeCollector contract** per EVM chain, same address everywhere via CREATE2,
becomes the fee recipient. Binding calldata rides ON the fee tx again (2-tx UX, no extra
popup). This resurrects AKK-4-v1 code (`bb42486`) almost verbatim — the ONLY reason it
failed was the internal-account recipient. Rollback scope = revert ONLY `ce21506` on
branch `security/akk3-fail-closed-pricing`. Do NOT revert to v277 (would discard the
on-chain binding verification machinery + error-surfacing fixes that Option B consumes).

Design decisions already made by the user:
- ONE contract address across all EVM chains (CREATE2/same-nonce deploy); future
  allowlisted chains just need the same deploy on the new chain.
- Backend binding check should additionally require a FeePaid event from the collector
  address in the fee receipt (defeats address-squatting on not-yet-deployed chains).
- Phase 2 consolidation: ONE bridge aggregator with per-chain routers (shortlist: Across,
  deBridge — verify canister-callability), NOT per-chain canonical bridges.
- DEX: **ICPSwap** (ICRC-2, canister-callable). KongSwap is NONFUNCTIONAL — do not use.
- Phase 2 watchdog tops up ALL app canisters (frontend, backend, AKK ledger) via
  notify_top_up; threshold-triggered + Telegram alarm (user prefers event-driven).
- FeeCollector: `receive() + FeePaid(payer, binding, value) event + owner-gated
  sweep(target)`; owner starts as user's EOA, later transferred to canister tECDSA
  address WITHOUT redeploy. Same address on all chains via CREATE2.

## Work plan for the new session

1. `git revert ce21506` on branch `security/akk3-fail-closed-pricing` (back to
   binding-in-fee-tx). Keep the error-surfacing commit (0674712).
2. Write `FeeCollector.sol`: receive() emits FeePaid(payer, msg.data, msg.value);
   owner-gated sweep(target). Owner = user's EOA for now; transferable to canister
   tECDSA address in Phase 2.
3. Prepare CREATE2 deploy (bytecode + salt + per-chain deploy commands) for user to
   sign in their wallet: Base 8453, Ethereum 1, Optimism 10, Celo 42220.
4. Admin panel: setFeeRecipient → contract address.
5. Backend: add FeePaid-event-from-collector check to the binding verification
   (defeats address-squatting on undeployed chains).
6. Gates: mops check (root! not src/backend), mops build, pnpm bindgen, tsc, pnpm build.
7. ONE `caffeine preview --build --project . --json` push, then STOP and report.
8. User retests: burn → ONE wallet popup (fee w/ calldata, now to a contract) → claim.

## Process rules (learned the hard way)

- ONE caffeine push attempt per user go-ahead; always run with `--json` (their CLI logs
  success unconditionally and swallows errors; --json surfaces size/504/524 causes).
- CONSULT the user before product-decision changes (extra txs, UX changes). Design →
  explain → get go → build. Security fixes inside agreed scope don't need asking.
- Push to Caffeine first; user pushes to GitHub after verifying. Never push GitHub unprompted.
- Draft URL asset hash = ground truth of what's deployed; live URL hides script tags (CDN
  transform) so hash-compare only works on the DRAFT url.
- Two backend canisters exist: draft runs `cfi3s-2iaaa-aaaau-aabnq-cai`
  (ground truth = draft frontend's `env.json`, verified 2026-08-28), live runs
  `g4i7o-xaaaa-aaaau-ag3bq-cai`. The earlier note naming `zonjj-kiaaa-aaaai-atj7q-cai`
  as the draft backend was stale — that canister carries no backend methods.
  Query with icp CLI (query methods need --query, explicit `()` args, and
  `--candid src/backend/dist/backend.did`).
- `caffeine preview --build --project .` from repo root; use --json; 504/524 flakiness is
  their side, retry later or ask user to check dashboard.
- mops must run from REPO ROOT in the v264+ layout (vendor paths break from src/backend).

## Remaining findings queue (after AKK-4 lands)

AKK-5 timer reentrancy (HIGH) · AKK-6 cap bypass retries (MED) · AKK-7 ledger idempotency
(MED) · AKK-9 post-cap drain (MED) · AKK-10 fee-AMOUNT verification + same-user fee reuse
(MED, merged with 8; now has a path via FeeCollector events).
Phase 2 (separate project): tECDSA canister wallet → single aggregator bridge
(shortlist Across/deBridge, verify canister-callability) → ckETH minter → ICPSwap
ckETH→ICP → notify_top_up to frontend/backend/ledger canisters + cycles watchdog.
