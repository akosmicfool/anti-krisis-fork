# Security review record — mining path + AKK-10 recheck (2026-09-10)

Scope: an adversarial read of the branch that closes AKK-1…AKK-10 plus the
W0/W1A/W1B/W3A/W3B packages, done by the builder (not an independent validator)
against the tree at `e4eadfb`. Every item below is evidence-backed: a file:line,
a command output, or a computed number. Findings are labelled F# and carry an
explicit disposition; the two not fixed here are called out as residuals.

Companion documents: `vulnerability-audit-v264.md` (original findings),
`security-remediation-plan.md` (package plan).

---

## 1. Verified closed in this pass

| # | Claim | Evidence |
|---|-------|----------|
| AKK-1 | Anonymous can never hold admin | `lib/allowlist.mo:50-68` — `isAdmin` + `addAdmin` reject both anonymous shapes (single-byte sentinel and `fromText("aaaaa-aa")`); every admin setter gated (`mixins/allowlist-api.mo:72-94`, `mixins/mining-api.mo:229-490`) |
| AKK-2 | GRIT credit is exactly-once | `lib/grit.mo:113-182` — CAS = single find → mapInPlace → credit, **no await** between reads and writes; only `#pending`/`#pendingFee` may transition. `lib/grit.mo:165` is the ONLY balance-increment site in the backend |
| AKK-4 | Burn ↔ fee binding | `lib/verification.mo:839-897` — requires recipient == collector (or an event proof), sender == burn sender (or the resolved burn owner for relayed burns), and binding calldata naming **this claimant + this exact burn tx hash**, compared case-insensitively and failing closed |
| AKK-5 | No overlapping cycles / stable height | guard bound as `transient var` (`main.mo:265`, entered at `main.mo:554`), `thisBlockId` captured before any await (`main.mo:562`), CAS on append (`lib/mining.mo:261`) |
| AKK-6 | Cap on all three mint paths | `capDecision` at `main.mo:414` (primary), `main.mo:510` (drain), `mixins/mining-api.mo:404` (admin replay); a failed supply query defers instead of minting blind |
| AKK-9 | Zero prize never charges fuel | reward computed + cap-clamped **before** the charge loop (`lib/mining.mo:325-333`) |
| AKK-10 | Underpaid fee rejected | `mixins/grit-api.mo:321-344` — FeePaid value decode + `minimumFeeWei` with tolerance |
| Gates | All green | `mops test` 12 files; stable-compat ✓ with the migration chain; lint ✓; build ✓; `.did` unchanged |

Economic invariant re-checked: AKK cannot be obtained without burning real
tokens — block weights come from GRIT (burn-earned), weights are frozen before
`raw_rand`, the draw is exact Nat arithmetic (`randNat * totalGritSpent <
cumulative * maxU64`), and the 21M cap holds on every mint path.

---

## 2. Findings

### F2 — retry timestamp was not actually deterministic (FIXED)

`mintCreatedAtTime` clamps into the ledger's 24h validity window on a ~22h grid.
Because the anchor is `Time.now()`, two attempts could straddle a grid boundary
and hash differently. Measured over 200,000 consecutive blockIds: **8,715
blocks (4.36%)** produce a different value by the last retry of a ~57.5 min
burst. Since the ledger dedups on the hash of the full transfer request, a
transfer that committed but was never reported (aborted message, e.g. an upgrade
landing mid-await) would be re-sent under a new hash and minted twice instead of
being rejected `#Duplicate`.

Fix: the value chosen for the FIRST attempt is frozen on the queue entry
(`MintRetryEntry.createdAtTime : Nat64`) and reused verbatim by
`tryLedgerMint` and `creditAbandonedMints`. New chain step
`migrations/20260910_200000.mo` adds the field and rewrites only the two mint
queues, reconstructing pre-existing entries with the value their last attempt
would have derived. Six tests in `test/mint-freeze.test.mo`, including a pin
that the migration's inlined derivation equals `lib/ledger-mint.mo` across 36
(blockId, now) inputs.

### F3 — 4h staleness bypass was still live (FIXED)

Contrary to the W3A plan, `tryEnterStale` / `DEFAULT_MAX_AGE` / `enteredAt`
were still present. The bypass guarded a state that cannot occur (an IC message
cannot stay parked 4h; a trap rolls back the guard write itself) while being the
only path able to admit an overlapping cycle. Removed; `GuardState` is now
`{ var busy : Bool }`, and `test/cycle-guard.test.mo` pins the strictness (1000
overlapping fires rejected).

### F6 / F7 — consistency and dead weight (FIXED)

- F6: the reward/halving epoch read the live `state.blockNumber` while the
  record it is written into used the captured `thisBlockId`. Equal at entry
  today (no await between), so no behaviour change — but two sources of truth
  for a block's identity is how the duplicate-history-id class returns. Both now
  derive from `thisBlockId`.
- F7: the drain "un-credited" the internal `akkBalances` buffer on success. In
  ledger mode nothing ever credits that map, so it was dead weight that could
  silently shrink a leftover draft-era balance. Removed; pinned by a test that
  fails against the old code.

### F8 — drain batch bound was arithmetic, not measured (VALIDATED)

Measured the drain's exact call sequence against the pinned ledger in PocketIC
(`.pocketic/drain-timing.mjs`, sender = backend principal, payload shape
mirroring `main.mo`):

| metric | value |
|---|---|
| `icrc1_total_supply` (query) | avg 5.8 ms, max 7.5 ms |
| `icrc1_transfer` (update) | avg 7.9 ms, max 11.1 ms |
| per entry | avg 14.2 ms, max 17.0 ms |
| **full 25-entry drain** | **0.42 s** = 0.06% of the 690 s window |

The local replica is a floor (no consensus round trips). Real mainnet round
trips on the target canister, same day: **update 1609 / 1804 / 1732 ms**,
**query 2009 / 1149 / 897 ms** (CLI-inclusive, i.e. conservative). Worst case
for a full drain on a real subnet ≈ 25 × (1.8 + 1.0) ≈ **70 s**, or ~150 s if
every one of the 50 calls took 3 s — 10–22% of the window. `DRAIN_BATCH_MAX = 25`
is well sized; no change.

Also validated by the same run: the backend **installs cleanly on the fresh
path** with this build (`{}`→Init plus the new F2 migration), and harness mint
accounting asserts exactly.

---

## 3. Residuals (not fixed — deliberate)

### F1 — `blockHistory` grows without bound (MEDIUM, cost/availability)

No trim has ever existed in any revision (`git log -S MAX_BLOCK_HISTORY` empty;
no trim lines in any revision where `blockHistory` is touched), yet
`mixins/mining-api.mo:707` claims "capped at 100" — a stale comment. Each record
embeds three arrays sized by miner count (`types/mining.mo:63-77`): ≈0.5 KB per
block at 5 miners, ≈7.9 KB at 100. At 125 blocks/day that is ≈22 MB/year at 5
miners, ≈360 MB/year at 100, multiple GB at 1000. The history is re-read by the
scoring rebuild (`lib/scoring.mo:209`), tribe totals (`lib/tribe.mo:661`) and
per-user stats (`mixins/mining-api.mo:690`), so a naive trim silently changes
those results — which is why this is a scoped task, not a quick cap.

Recommended shape: keep the lightweight fields (blockNumber, timestamp, winner,
reward, totalGritSpent) forever, drop the participant arrays beyond a recent
window. NOT a merge blocker: mining is not yet live (draft `blockNumber = 0`),
and the growth is bounded by real mining time.

### F5 — AKK-10 fee-amount check fails OPEN without a native price (LOW)

`mixins/grit-api.mo:324-328`: when `fetchNativePrice` returns null the check is
skipped and logged. An attacker could underpay the platform fee during a
price-feed outage — but must still burn real tokens and pay some fee, and GRIT
issuance stays fail-closed, so there is no free GRIT. Deliberate trade-off
(blocking honest claims during every outage is worse). Documented here; tighten
only if fee underpayment ever becomes material.

### Informational

- F4: if a future change ever reintroduced an overlapping cycle, the CAS
  rejection path in `processBlock` would leave fuel charged and counters
  incremented with no block record. Funds are safe (same `blockId` → ledger
  `#Duplicate` + `mintedBlockIds`), only fuel accounting is exposed. Unreachable
  while the guard is strict (F3).
- The batch bound interacts with the platform's per-message budget; the F8
  numbers put a 25-entry drain at ~70–150 s worst case, which is far inside any
  plausible bound. Re-measure if `DRAIN_BATCH_MAX` ever rises.

---

## 4. Process note

This review was performed by the builder against its own branch. It does not
replace the independent adversarial validation (W4) required before a live push,
nor the PocketIC upgrade rehearsal (install the previous build, upgrade with this
one, assert the mint queues migrate and mining resumes).

---

## 5. Addendum — second audit pass (same day, after the F2 fix landed)

The F2 freeze was re-read the same way it was written, looking for bugs the fix
itself introduced. Two were found.

### F9 — the freeze removed the timestamp's ability to refresh (FIXED)

`mintCreatedAtTime` clamps the value to age 1h..23h. Freezing it at enqueue
means it no longer refreshes. The normal retry horizon is MAX_MINT_ATTEMPTS
drain cycles (~57.5 min), which takes the OLDEST possible frozen value to
~23.96h — about **2.5 minutes** of margin inside the ledger's 24h window, and
any longer delay (a skipped cycle, a ledger outage, an upgrade) crosses it.
Because the value is frozen, every later attempt AND the admin replay would
then fail `#TooOld` forever: the block reward becomes permanently unpayable.
That failure mode did not exist before freezing (each attempt re-derived a
fresh value) — a regression the first pass introduced.

Fix: `LedgerMint.isFrozenStale(frozen, now)` + a re-freeze in
`drainPendingMints` and `creditAbandonedMints`, applied only once the value is
within `FREEZE_SAFETY_NS` (30 min) of the edge. Identity therefore holds for
the whole normal horizon, and at the point of re-freezing the ledger's own
24h-scoped dedup record is expiring anyway — nothing that still exists is given
up. Re-freezing an abandoned entry is safe by construction: every retry
failing means no transfer ever committed (a committed one would have returned
`#Duplicate` on the next identical attempt). Three tests added; the field
became `var` (its only writers are construction, the net, and the migration —
documented on the type).

### F10 — the committed backend artifact is stale (OPEN — needs a decision)

`src/backend/dist/backend.wasm` has been byte-identical since `d6bc520`
(sha256 prefix `7668134a51a5`) while the source moved on for eight commits.
Proof it does not match its own source: installed fresh in PocketIC it TRAPS
with `migration src/backend/migrations/20260826_000000.mo: field 'adminState'
expected but not found in state` — the pre-W1B fresh-install trap — even though
the source at that commit contains the `{}`→Init fix. A build of the CURRENT
source installs cleanly and seeds 6 tokens (`.pocketic/install-check.mjs`).

Impact: any deploy/recovery path that installs the committed artifact rather
than building from source would fail on empty state. Caffeine builds from
source, so deploys are unaffected; a manual disaster-recovery install is not.
Disposition: the refreshed artifact is committed as its OWN dist-only commit
(separate from the source fixes), so the tracked binary matches the tree again
and the change can be reverted on its own if the repo should instead stop
tracking build output. The alternative — drop `dist/` from version control and
make "build from source" explicit — remains open for the call.

### Also validated

- Every `MintRetryEntry` construction site (4 in main.mo, 3 in tests) sets the
  frozen timestamp; the runtime derivation and the migration's inlined copy
  still match (test).
- The `var` change is consistent across `types/mining.mo`, the migration's
  `NewActor`, and all constructions — `mops check` and `mops build` catch any
  drift (they caught exactly this during the pass).
- 12 test files green, stable-compat ✓ with the 2-step migration chain, lint ✓.

### Upgrade rehearsal — DONE, on the live draft

A local old→new rehearsal could not run: the only old artifact available (the
stale one, F10) cannot install fresh, so there was nothing to upgrade FROM.
Instead the draft push itself served as the rehearsal, and it is the stronger
one — the real canister, the real state:

- draft v336 upgraded canister `ov22c-…` IN PLACE, migration chain applied, no
  layout failure (the canister answers update calls afterwards);
- every piece of state the draft held survived: fee recipient = collector
  `0x6cBB…aCD2` ✓, FeePaid check armed ✓, fee percent 0.69 ✓, allowlist 6
  tokens ✓, `getTotalBlockCount` 0 ✓, mint queue depth 0 with no retries or
  abandons ✓.

What this does NOT cover: the queue-rewrite path with entries actually present
(the draft has no miners, so its queues are empty). That path is pinned by unit
tests instead — `migrationUpgradeEntry` (field-by-field preservation +
reconstruction) and the runtime/migration derivation equivalence across 36
inputs. To exercise it end-to-end, pass both wasms to
`.pocketic/install-check.mjs <old> <new>` after rebuilding the previous
revision.

---

## 6. W4 — independent adversarial pass (2026-09-10, fresh-context reviewers)

Six reviewers were dispatched, one per area, each with a falsification mandate,
quoted-evidence rules and an explicit ban on fabrication.

**Delivery reality:** 4 of 6 hit the 600s wall (this model/provider averages
30–50s per tool call, so long mandates cannot finish). Their transcripts were
salvaged rather than discarded; the remaining coverage was re-dispatched as
micro-tasks with hard call budgets. Partial coverage is stated as such — the
pass did NOT cover every area end-to-end.

**What was independently established before the wall:**
- The migration's inlined timestamp derivation is **token-identical** to the
  runtime helper (mechanically compared, comments stripped) — one of the
  riskier F2 claims.
- The 22h clamp-grid straddle rates were re-measured and reproduced
  (4.36% per 5-attempt burst, 0.871% per 690s gap).
- `mops test` → 12 files green, and the fresh-install harness reproduced
  (installs clean, seeds 6 tokens).
- Mutation checks in a `/tmp` sandbox: reverting F7 makes a test trap
  (`buffer balance unchanged by the drain`); reverting F2's freeze makes
  `drain passes the entry's frozen timestamp verbatim` fail. Both
  FAIL-IF-REVERTED — those two fixes are test-enforced.
- The reviewer left the repository untouched (verified independently).

**Confirmed findings against the claim/fee path (fixed in cdb4f14):**
- **F1 (high)** — the AKK-10 amount check used `paid > 0` as a precondition, so a
  ZERO-value fee transaction skipped it entirely and still credited full GRIT
  (the collector's `fallback()` emits `FeePaid(..., msg.value)` with no minimum).
  The whole platform fee was evadable at gas cost. Fixed by extracting
  `FeeAmount.amountCheckFloor` and comparing `paid < floor` unconditionally.
- **F2 (medium)** — a claim whose burn was still unindexed (`amountBurned 0.0`)
  could be terminalized `#verified` with zero GRIT by the fee-verification paths,
  which prove the fee but never the burn; `#verified` is sticky and claims never
  expire, so the real burn became permanently uncreditable. Fixed at the choke
  point (`GritLib.updateClaimStatus` refuses a zero-credit `#verified` when the
  effective amountBurned is 0.0).

**Open items surfaced by the same reviewer (NOT fixed — decisions for the owner):**
- **F3** — pre-W1A claim rows stored non-canonical hash spellings; `isDuplicateClaim`
  compares text exactly, so such a row could be claimed twice. Precondition is a
  canister upgraded across W1A while holding legacy rows; the draft was reset
  after W1A and prod is a fresh reinstall, so it is likely moot — but it is real
  if this build is ever promoted onto a pre-W1A canister. Cheap closure if
  wanted: canonicalize both sides in `isDuplicateClaim` / `resurrectFailedClaim`
  (no migration needed).
- **F4** — claim squatting: `initiateClaim` binds `claimant = caller` before any
  ownership proof, claims never expire, and `resurrectFailedClaim` requires the
  original claimant, so a watcher can seize a public burn hash first and
  permanently lock the genuine burner out of their GRIT (neither party gains).
  This is the "claim ownership before proof" item the original plan left to W4.
- **F5** — exactly-once is per-canister-generation: after a reset, historical
  burns can be re-claimed with their already-paid fee txs. Operational hygiene
  for launch (deny-list / cutoff), not a code bug.
- Minor: `nativeWrappedAddress` covers 4 chains while `rpcUrlForChain` serves
  more (allowlisting on the others would fail the amount check open — not
  currently reachable); `feePaidLogValue` reads value/binding from any-payer
  log while the payer check is a separate scan (not reachable with a collector
  that emits one event per call).

### Mutation checks (what is TEST-enforced vs REVIEW-enforced)

An independent reviewer ran revert experiments in a `/tmp` sandbox (real repo
untouched, verified clean). Results, with the correction they force:

| Fix | Revert experiment | Verdict |
|---|---|---|
| F7 (dead buffer decrement) | restore the pre-fix decrement | **FAIL-IF-REVERTED** (traps `buffer balance unchanged by the drain`) |
| F2 (frozen timestamp) | recompute per attempt | **FAIL-IF-REVERTED** (`retry sent a recomputed timestamp instead of the frozen one`) |
| E5 (migration inlined derivation) | perturb one constant | **FAIL-IF-REVERTED** (equivalence test fails) |
| E2 (F3 guard strictness) | restore the pre-F3 guard + main.mo call | **WOULD-STILL-PASS** — the suite cannot see it: the test runtime has no clock and the test file never touches one |
| E4 (staleness-net WIRING) | delete the net from drainPendingMints | **WOULD-STILL-PASS** — only `LedgerMint`'s helpers were pinned, not the drain's use of them |

**Correction to this document:** §2's F3 section implied the guard test "pins the
decision against silent reintroduction". That is **overstated** — the bypass's
reintroduction is invisible to the test suite, so F3 is review-enforced, not
test-enforced. The honest statement: the guard MODULE exposes only
tryEnter/release/isActive (a reintroduced bypass would have to add a function and
rewire main.mo), and the strict-entry behaviour of `tryEnter` itself IS pinned.

**E4 was fixable and is now closed:** `drainPendingMintsAt` injects a clock, so a
stale entry can be driven through the drain in tests. Two tests pin the wiring —
a stale entry IS re-frozen to the derived value, a usable entry is NOT — both of
which fail if the net is removed. The net is now TEST-enforced.

### Owner dispositions (2026-09-11)

- **F4 (claim squatting)** — FIXED (uncredited claims are adoptable; see the
  `adoptUncreditedClaim` commit). 5 tests.
- **F6 (miner spam)** — deferred by the owner to production launch ("I will
  enable F6 manually in production"). ⚠ CAUTION recorded here because it is easy
  to misread: `setMinerCreationFee` only STORES a per-chain fee for display —
  nothing in `createMiner` verifies it, so setting it does NOT gate miner
  creation. A per-address or global miner cap, or a raised minimum creation
  stake, still requires a code change.
- **F3-replay single-flight / F4-rollback ts anchor** — accepted as trivial-risk
  by the owner (both LOW, admin-triggered or 0.871%-gap paths).
- **F5 (reset re-claims) / F3-legacy (pre-W1A spellings)** — accepted; moot under
  the planned fresh reinstall for production. Do NOT promote this build onto a
  pre-W1A canister without a claims migration or a deny-list.
