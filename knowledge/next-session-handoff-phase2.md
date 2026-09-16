# AKK-4 → Phase 2 Session Handoff

Written 2026-08-29 after the AKK-4 + kVCM-reliability chapter **shipped to live**.
Read this before touching the code. Companion docs: `caffeine-deploy-log.md`
(v281–LIVE rows = the complete change story), `contracts/DEPLOYMENT.md`
(FeeCollector addresses + deploy record), `vulnerability-audit-v264.md`.

## Where things stand (all verified on live 2026-08-29)

- **LIVE runs the full v297 build** on backend `g4i7o-xaaaa-aaaau-ag3bq-cai`:
  AKK-4 Option B (FeeCollector binding + FeePaid anti-squat check ARMED),
  kVCM whitelist + route simulation, pair-aware oracle, no-expiry recovery
  model, Pay Fee / Retry Fee / Retry Claim paths. User smoke-tested live:
  "Looking good so far!"
- **FeeCollector contract**: `0x6cBB624D23eeeFd23c7F02912F7F35129174aCD2`
  deployed on ethereum, base, optimism, celo (identical bytecode, owner =
  `0x66Cc129C0f758B52d561F0bD2AC8ECf37f19C052`, the fee EOA). Collector holds
  dust from test fees (~cents) — recoverable via owner `sweep()`.
- **Config on live (verified)**: feeRecipient = collector, collectorAddress =
  collector, FeePaid check = true, feePercent = 0.69.
- GitHub main is BEHIND live until the user syncs (their flow).
- Draft-reset lesson: Caffeine occasionally resets draft backends to fresh
  canisters. After ANY draft reset or promotion, re-run the 3-set config
  (setFeeRecipient / setFeeCollectorAddress / setFeePaidCheckEnabled) via the
  akk-deployer CLI identity — readbacks verified — before letting users burn.

## Phase 2 — the actual next phase (agreed design, not built)

Goal: make the platform self-funding — canisters pay their own cycles from
fee revenue, no manual top-ups.

Pipeline (in order):
1. **tECDSA canister wallet** — transfer FeeCollector ownership to the
   backend canister's tECDSA address (`transferOwnership`, no redeploy — the
   address is fixed). Canister then holds/sweeps fees itself. Owner-gated
   sweep already supports this.
2. **Fee consolidation** — single bridge aggregator with per-chain routers.
   Shortlist: **Across, deBridge** — VERIFY canister-callability first
   (HTTP outcall compatible, deterministic responses). NOT per-chain
   canonical bridges.
3. **ckETH minter** — bridge ETH-asset fees to ckETH.
4. **ICPSwap** — ckETH → ICP. **ICPSwap confirmed as the DEX** (ICRC-2,
   canister-callable). KongSwap is NONFUNCTIONAL — do not use.
5. **notify_top_up + watchdog** — top up ALL app canisters (frontend,
   backend, AKK ledger) from the ICP balance; threshold-triggered,
   Telegram alarm (user prefers event-driven over polling).

Also queued (from vulnerability-audit-v264, in priority order):
AKK-5 timer reentrancy (HIGH) · AKK-6 cap bypass retries (MED) ·
AKK-7 ledger idempotency (MED) · AKK-9 post-cap drain (MED) ·
AKK-10 fee-AMOUNT verification + same-user fee reuse (MED — now has a path
via FeeCollector events; the FeePaid event carries `value`).

## Hard-won process rules (still true)

- ONE `caffeine preview --build --project . --json` push per user go-ahead;
  502/504s often still land server-side — verify the draft URL's bundle
  hash before retrying, and kill retry loops on match (double-versioning).
- `mops check/build` from REPO ROOT (vendor paths break from src/backend).
- Gates before any push: mops check (+ stable-compat), mops build, pnpm
  bindgen, tsc, biome, vite build.
- Gateway/verifier lesson that shaped the whole chapter: **never treat an
  RPC artifact as a definitive verdict** — transient errors (missing
  fields, empty calldata, not-found) keep claims pending; only structural
  mismatches (wrong recipient/sender/calldata) fail a claim. Claims never
  expire; every failure is user-recoverable.
- The user's wallet occasionally accept-then-drops txs (relay behavior):
  burn side defended by route simulation; fee side by binding check +
  Retry Fee. Keep both defenses when touching the flow.
- Klima credits: fixed-price inventory, NOT AMM pools. Whitelist in
  `kvcm-retirement.ts` (9 credits, tiers by inventory ceiling) — rescan
  with the scripts pattern in git history if retirements spike. Happy path
  makes ZERO subgraph calls (Goldsky rate-limited); discovery is
  fallback-only.
