# AKK Mining-Vulnerability Handoff — remaining queue after AKK-4

Written 2026-08-29. AKK-2, AKK-3, AKK-4, AKK-8 are **done and live** (AKK-2 CAS
guard, AKK-3 fail-closed pricing, AKK-4 Option B FeeCollector + FeePaid check,
AKK-8 fee binding/single-use). This file covers what remains: **AKK-5 (HIGH),
AKK-6, AKK-7, AKK-9, AKK-10 (all MEDIUM)**. Full exploit paths in
`vulnerability-audit-v264.md`; this file is the working plan.

## Suggested order (exploitability × blast-radius × diff size)

### 1. AKK-5 — Block-timer reentrancy — HIGH — ✅ FIXED on `mining-akk-vulnerable` (preview pending)
`runBlockCycle` (main.mo:479) does many sequential ledger awaits; Motoko
recurring timers do NOT serialize async callbacks. With a pendingMints backlog
a cycle exceeds the 690s interval and overlaps the next fire: miners' GRIT
drained twice in one window, two winners share one blockId (second's reward
silently voided), BlockRecord built with post-await blockNumber (duplicate
history numbers).
**Shipped fix**: `transient var blockCycleGuard` (lib/cycle-guard.mo) checked-and-set at
runBlockCycle entry — overlapping fires are no-ops and the next aligned fire picks up the work;
released on success AND in a re-throwing catch (a rejected await can never latch mining off).
`transient` keeps the flag out of the stable layout (mops stable-compat passed, no migration)
and resets it on every upgrade. `tryEnterStale` self-heals a wedged guard after 4h. processBlock
takes the caller-captured `thisBlockId`; `buildBlockRecord` height-CAS-rejects (returns null, no
trap) any block that no longer extends the live counter. Tests: `src/backend/test/` via
`mops test` (15 tests across cycle-guard + mining-blockrecord).
**Still do post-deploy**: regression-test live claim flows (AKK-2/3/4/8) per session mechanics.

### 2. AKK-10 — Fee-AMOUNT verification + same-user fee reuse — MED — ✅ FIXED on `security/akk-vuln-queue` (preview pending)
Was blocked ("no path to verify amount"); **FeeCollector events unblocked it**.
**Shipped fix**: `lib/fee-amount.mo` (feeBpsFromPercent, minimumFeeWei with ceil,
decodeFeePaidValue = last 32-byte word of the FeePaid log data) + `feePaidLogValue`
in verification.mo (single receipt scan returns #found(value)/#missing/#unparseable —
replaced the Bool scanner; #missing/#unparseable stay PENDING per the recovery model).
verifyFeeBinding gained a `usdValue : ?Float` param; the amount check runs only when
the FeePaid check is armed AND a native-token price exists (WETH addresses for
ethereum/base/optimism; **celo skips the check** — no verified ERC-20 CELO address,
deliberately not guessed). Tolerance = 700 bps, mirroring the frontend-price
deviation gate (fee is sized on the frontend price, checked against the oracle).
Fee-reuse half: **already closed by AKK-8's calldata binding** (payload names the
exact burn hash) — verified, not assumed. Comparator values (deep-review outcome):
claim-verification and both timer rechecks use the STORED claim-time usdValue (the
fee was sized then; a recheck-time value would fail honest claims after price
rises); retryFeeClaim (Pay Fee = NEW fee) uses the CURRENT oracle value (fetch
moved before the fee check). Tests: test/fee-amount.test.mo (11).

### 3. AKK-9 — Post-cap mining drains GRIT for zero reward — MED — ✅ FIXED on `security/akk-vuln-queue` (preview pending)
Once totalAkkMined hits the cap, blockReward() = 0 but processBlock already
drained every active miner's GRIT and records a winnerless block. Users keep
paying fuel for zero win probability.
**Shipped fix**: processBlock computes the reward BEFORE the fuel-drain loop;
when 0 (cap reached OR halving schedule exhausted, block ≥ ~2.35M), the block
is a no-op — no fuel billed, no winnerless block appended, counter untouched.
Tests: test/mining-postcap.test.mo (3).
**Still open (PRODUCT, not code)**: whether to compensate GRIT drained by
historical winnerless blocks — user's call; live history must be checked
(the current draft canister has none).

### 4. AKK-7 — Weak ledger idempotency — MED — ✅ FIXED on `security/akk-vuln-queue` (preview pending)
ICRC-1 dedup keys on (caller, memo, created_at_time); every mint retry sends
`created_at_time = now` — fresh each time, so retries are never duplicates. A
lost response after a committed ledger transfer minted twice.
**Shipped fix**: `lib/ledger-mint.mintCreatedAtTime(blockId, now)` — deterministic
ts (EPOCH 2026-01-01 + blockId×690s) used by ALL THREE mint paths (primary,
drainPendingMints, creditAbandonedMints). Ledger ground truth verified:
icrc1-mo dedups on the FULL request hash (incl. ts AND memo) within a 24h
transaction_window. Two subtleties the deep review caught: (1) a 690s-grid
clamp could straddle grid boundaries between drains → different ts per retry →
dedup hole reopened — fixed with a WINDOW-grid clamp (22h step; entries are
drained/abandoned within ~1h, far inside one window); cross-block ts collision
is safe because the memo already encodes blockId. (2) blockIds can outrun
wall-clock → future-derived ts rejected by is_in_future — symmetric clamp
handles it. Lost-response-after-commit now self-heals: retry carries the same
hash → ledger #Duplicate → recorded without double mint.

### 5. AKK-6 — 21M cap bypass on retry paths — MED — ✅ FIXED on `security/akk-vuln-queue` (preview pending)
Primary mint path clamps against icrc1_total_supply; NOT enforced in
tryLedgerMint (drainPendingMints), creditAbandonedMints (documented "No supply
cap check"), and primary proceeds UNCAPPED if the supply query throws (bare
catch). **Shipped fix**: `lib/ledger-mint.capDecision(supply, cap, amount)`
shared by all three paths; supply-query failure now defers — primary enqueues
to the retry queue (attempts=0), drain returns false (entry stays queued),
abandoned replay leaves the entry for a later admin run — instead of minting
blind. A genuinely-capped replay (decision 0) records + retires the entry
(reward can never mint). Clamp is idempotent, so deferral-then-drain
double-clamping is harmless.

## Session mechanics (unchanged)

- One task at a time in a fresh worktree; gates = mops check (+stable-compat),
  mops build, pnpm bindgen, tsc, biome, vite build; ONE caffeine push per
  user go-ahead; verify draft hash before retrying; user promotes + syncs
  GitHub.
- AKK-5/6/7/9 touch mining + ledger paths: regression-test AKK-2/3/4/8 claim
  flows after each (they share initiateClaim/recheckClaim plumbing).
- AKK-10 touches verifyFeeBinding: regression-test the FeePaid anti-squat
  check (armed on live) and the transient-vs-structural guard — the new
  amount check must ALSO be transient-safe (missing/empty event data ≠ fraud).
- After each fix: update vulnerability-audit-v264.md status column + deploy
  log row; per-push context post into the Caffeine project chat.

## Live-prod notes for this queue

- All five fixes are backend-only → draft bundle hash unchanged; verify by
  behavior + mops stable-compat.
- Live config is healthy (recipient=collector, FeePaid armed). Any new admin
  knobs (e.g. AKK-10 tolerance bps) should follow the feeState pattern
  (separate stable record, appended at END of layout, migration chain link).
