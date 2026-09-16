# AKK security remediation: integrated implementation plan

Status: proposed, not implemented or approved for deployment.
Planning snapshot: 2026-09-07. Source: `security/akk-vuln-queue` at
`f198d353a1643d179126de7a35651b9b9bbb89e5`.
Companion: `knowledge/vulnerability-audit-v264.md`.
Private security material: do not publish while vulnerabilities remain unresolved.

No build tasks are created or dispatched by this plan. The user manually approves
and routes every task. No commit, merge, preview push or live change is authorized.

## Executive recommendation

Keep the existing product flow: burn, bound fee, GRIT, charged mining round,
random draw, AKK payout. Replace scattered retry mutation with two durable
workflows: a claim workflow and a round/payout workflow. Keep each workflow small,
with explicit states and one owner for its mutations. Do not introduce a generic
workflow framework, extra wallet signature, new canister, or new ledger fork in
this first remediation.

The order is important: freeze participants and weights and charge GRIT BEFORE
requesting randomness. The earlier review recommendation to obtain randomness
before charging was too broad and is superseded here. The defect is not charging
before randomness; it is failing to persist a resumable charged round.

This is a NO-GO release until regression reproductions, migration checks and an
independent adversarial review close the blockers. Green helper tests alone are
not sufficient. No evidence establishes that the exploits have occurred live.

## Evidence and review limitations

The earlier independent subagent batches failed or timed out; they did not provide
an independent sign-off. Existing evidence comprises direct source/diff inspection,
a numerical timestamp boundary reproduction, seven passing Motoko test files,
and successful compile/stable checks. Full application-level attack reproductions
and recovery tests still need to be built. Do not describe source findings as
observed production incidents or as completed independent validation.

Severity is impact; likelihood below is qualitative and conditional, not a measured
frequency. Near-cap failures are unlikely at low supply; deliberate hash replay is
much easier than a rare multi-hour mining overlap. The earlier audit's use of P0
for most mining failures is a release-priority label, not a claim that all are
Critical-severity exploits today.

## Risk-to-work mapping

| Concern | Plain-language failure | Severity / conditional likelihood | Owner |
|---|---|---|---|
| Hash replay (AKK-2/4/8) | One burn has several text spellings and receives several credits | Critical / easy if deliberately attempted | W1A |
| Stale claim writes | A late retry rewrites a completed claim's receipt or price metadata | Medium / plausible with concurrent retries | W1A |
| Claim ownership before proof | Unverified reservations must not permanently lock out the genuine burner | Must test; do not call theft protection complete without it | W1A + W4 |
| Caller-price fallback (AKK-3) | User supplies the credited price during an outage | Original fallback removed in inspected code | W2 regression |
| Wrong-chain pricing | Price of another chain's token/pool is used | High / depends on cross-chain price divergence | W2A |
| Spot-price manipulation | A briefly distorted market price buys excessive GRIT | High / economics unmeasured, higher concern for thin markets | W2B |
| Admin takeover (AKK-1) | A stranger becomes administrator | Original public takeover endpoints removed | W1B regression |
| Anonymous-admin footgun | An admin accidentally grants the shared anonymous identity privileges | High impact / very low likelihood, privileged action required | W1B |
| Incomplete secure configuration | Replacement backend accepts a weaker fee policy or stops valid claims | High / plausible after reset; ordinary upgrade is not necessarily a reset | W1B |
| Fee amount bypass (AKK-10 seam) | Zero paid or unavailable price skips the fee comparison | High / explicit branches present; reproduce complete path | W1B + W2 |
| Mutable mint request (AKK-7) | Retry looks like a new payment | High / requires ambiguous first outcome plus changed timestamp/amount | W3B |
| Supply check race (AKK-6) | Two payout routes spend the same remaining issuance | High / near cap and overlapping routes | W3B |
| Four-hour takeover (AKK-5) | Slow old producer and replacement both process state | High / exceptional prolonged cycle; bound work and fence ownership | W3A |
| Partial charged round | Miners pay but round/history/payout state is lost | High / reject/trap/recovery dependent | W3A |
| Reward/cap disagreement (AKK-9) | Recorded prize exceeds payable reward | High / near cap or accounting divergence | W3A + W3B |
| Missing fault tests | Green tests don't cover the failures above | Release assurance blocker, not a separate exploit | All + W4 |

Fee-amount evidence: `mixins/grit-api.mo:283-305` only compares when `paid > 0`
and `usd > 0`, and skips the check on missing native price. `recheckClaim` passes
an older `record.usdValue` at line 711, which may still be zero despite later local
repricing. These require regressions in the existing claim work, not a separate
rewrite. Also match emitter, payer, binding and amount from the SAME event; the
current unfiltered scan at line 227 and separate payer scan at line 250 must not
combine evidence from different log entries.

## Non-negotiable invariants

1. One canonical on-chain burn identity credits GRIT at most once.
2. Only proven ownership can finalize a claim; an unproven first submission must
   not irreversibly reserve another person's burn.
3. All economic claim fields finalize together without an await. A stale worker
   cannot rewrite a completed record or claim a new credit succeeded.
4. A fee is checked against a known validated valuation; unknown is not zero.
   Zero payment fails whenever a positive fee is required.
5. One charged round owns an immutable participant/weight/spend snapshot. No
   participant can enter, exit, top up or change the weight of that round after
   randomness is requested; later edits apply to later rounds.
6. Recovery never charges that round again, selects a replacement winner after
   a winner is persisted, or silently discards the reward obligation.
7. One immutable payout intent owns ledger ID, recipient, amount, memo, timestamp
   and outcome. Retry never recomputes its identity or silently switches ledgers.
8. Successful issuance plus outstanding issuance reservations stays inside the
   approved budget. An ambiguous mint retains its reservation.
9. History distinguishes earned/owed reward from confirmed ledger delivery.
   Zero payable reward creates no charge; partial payable reward is decided
   before charging and appears consistently in every record.
10. Each claim/round/payout transition and callback validates its current version
    or generation. An expired wall-clock interval is not authority to mutate.

## W0 — baseline, reproduction harness and data inventory

Estimate: 1–2 engineering person-days. First dependency for all builds.

Read AGENTS.md and current manifests. Fetch and compare content against main:
latest fetch shows 67 unique local commits and two upstream-only commits,
`06d5908` and `1ab90e2`. Caffeine squash/export lineage means commit divergence
alone is not proof of missing code. Reconcile content deliberately in the queue
lineage; do not blindly overwrite it with main or fast-forward a divergent tree.

Preserve the uncommitted audit notes and leave the other worktrees untouched.

Identify an executable local test command using the `@dfinity/pic` dependency and
actual pinned ledger WASM. **W0 correction (2026-09-07):** `@dfinity/pic` was a
pnpm dependency whose postinstall (PocketIC server binary download) was blocked
in `pnpm-workspace.yaml`; provisioning required flipping that pin to `true` and
running the postinstall. PocketIC server 14.0.0 + ledger
`ledger-suite-icrc-2026-03-09` (sha256 a273d741019b4324…) are now provisioned and
the harness (`.pocketic/harness.mjs`) installs both canisters. Verify test
provisioning; do not label a dependency present as proof its binary runs. Build
controlled HTTP, randomness and ledger fault seams, with test-only components
outside production WASM. No fake live response claims: fixtures are explicitly
synthetic or captured.

**W0 finding — fresh-install trap (release blocker, reproduced):** a plain
`install_code` of `backend.wasm` onto empty state traps in migration
`20260826_000000.mo` (`field 'adminState' expected but not found in state`).
Under `--enhanced-migration` the first migration runs on fresh install with
empty `{}` input; ours takes the full legacy shape. Fix assigned to W1B: rewrite
the first migration as a `{}`-input `Init` producing default state; W4
rehearses fresh-install in the harness. Details in
`knowledge/vulnerability-audit-v264.md` (2026-09-07 section).

Capture baseline gates and interface/stable signatures. Inventory legacy canonical
claim collisions, pending/abandoned mints, ledger IDs and total accounting through
authorized read-only access. If live inventory is unavailable, record it as a
release blocker rather than infer live state from a draft. Never automatically
subtract existing balances or erase suspicious history.

Deliverables: baseline revision, failing reproductions, exact commands, fixture
provenance, migration inventory and protected existing changes.

## W1 — claims, identity and secure admission

### W1A: canonical identity and atomic claim transitions

Estimate: 2–3 person-days. Follow W0.

Existing files: `src/backend/lib/grit.mo`, `types/grit.mo`,
`mixins/grit-api.mo`, `lib/verification.mo`, migration chain, claim tests.
Proposed new small helper: `src/backend/lib/claim-identity.mo` (not existing yet).

Tests first: alternate hash casing/prefixes resolve to one burn; malformed input
is rejected before outcalls; duplicate creation and timer/manual completions;
stale metadata writes; failed-claim resurrection; different token/chain arguments
on resurrection; forged first claim followed by genuine claimant; interrupted
migration with canonical collisions.

Validate format before normalization. Choose and document whether prefixless
hashes are accepted; if accepted they still resolve to the same key. Prefer a
canonical chain ID and hash bytes internally. Preserve the original submitted
text only for diagnostics. Legacy comparisons must use canonical identity too.
Do not automatically coalesce credited collisions or discard historical evidence.

Retain raw token amounts as Nat, not a Float round-trip. Separate unverified
requests from ownership-proven claims so early reservations cannot lock out the
burner. Preserve binding to chain/token/claimant on every retry. A verified record
cannot be resurrected. One guarded finalizer commits amount, quote reference,
fee reference, GRIT amount, balance, totals and final status together.

Return the authoritative result: a losing concurrent retry reports already
credited/current status, not its locally computed amount as a new credit.

Bound admission and expensive work by size, per-claim single-flight, per-principal
limits and a global budget. Per-principal limits alone are not Sybil resistance.
Keep recovery available without automatically polling invalid/unproven submissions
forever. No deletion of legitimate claim history to save cycles.

### W1B: secure config, fee evidence and admin hardening

Estimate: 1–2 person-days. Serialize after W1A where grit-api.mo overlaps.

Existing files: `lib/allowlist.mo`, `mixins/allowlist-api.mo`, `lib/fee-config.mo`,
`mixins/grit-api.mo`, `lib/verification.mo`, `contracts/FeeCollector.sol` (inspect;
no contract redeployment assumed), `src/frontend/src/pages/AdminPage.tsx`, migrations.

Tests first: anonymous admin argument; unauthorized mutation; secure fresh
installation; existing secure configuration preserved across upgrades; invalid
partial config; direct/relay wrong claimant/payer/collector; multi-event receipts;
zero paid fee; unavailable native price; unknown valuation; stale zero USD snapshot.

Reject anonymous admins even if imported legacy state contains one. Do not replace
valid existing administrators with a new bootstrap owner on upgrade.

Introduce one validated security configuration update and version. A readiness
state blocks settlement until required checks are active. Treat legacy setters
as compatible wrappers only if they cannot temporarily enable weaker settlement;
otherwise retire them with frontend/binding updates. Readiness is checked at
finalization too, not just before an await. Address equality alone does not prove
collector deployment: verify chain deployment separately during release.

Use one matching log for all fee evidence. A required positive fee and paid=0
must fail the amount check. Price unavailable means recoverable pending, not an
accepted fee. Unknown quote is a distinct state, not USD 0. Lock fee and reward
valuation to one documented quote policy; do not let delayed settlement mint at
an arbitrarily higher current value for an old cheap fee. Existing claims require
explicit migration/reconciliation, not retrospective invented quotes.

User experience: same burn and fee wallet transactions. Maintenance/pending states
explain delays and never ask for another burn or fee merely because a service is
slow. No new signing popup required by this plan.

## W2 — trustworthy valuation without per-retry price spam

### W2A: strict chain-aware quote ingestion

Estimate: 2–3 person-days. Oracle module work can run separately from W1A;
consumer wiring is serialized after W1.

Existing files: `src/backend/lib/price-oracle.mo`, `mixins/grit-api.mo`,
`lib/fee-amount.mo`, oracle/fee tests, migration chain if snapshots are persisted.

Tests first: same address on different chains, base/quote inversion, missing
liquidity, malformed JSON/number, non-finite price, stale timestamps, oversized
payload, out-of-order refresh completion and backend/frontend quote divergence.

Parse real pair objects, not document-wide substring fields. Require matching
chain and base token, finite positive price and required market metadata. Inspect
existing dependencies before adding a parser. No hand-edited vendor library.
Quote key includes chain and token. Deduplicate concurrent quote fetches and
store validated timestamp/source/pair references. A cached quote is usable only
within a documented freshness policy; an outage does not justify stale credit.

### W2B: economic policy and bounded quote refresh

Estimate: 2–4 person-days, including policy fixtures; external-source availability
or a new on-chain oracle integration could extend this estimate.

For each currently allowed token, measure eligible markets, liquidity, price
spread, source independence and data availability before proposing thresholds.
No universal arbitrary dollar threshold in this plan. Two websites reading the
same pool are not independent evidence. A local time average of spot observations
is not automatically a manipulation-resistant on-chain TWAP.

Preferred launch policy: vetted chain/pool sources, adequate liquidity and
freshness, an independent price or justified TWAP where available, deviation
circuit breaker, and rolling aggregate issuance/risk budget. A per-claim ceiling
alone is bypassed by splitting claims. Unsupported/risky markets pause new quote
acceptance with clear UI instead of falling back to caller values.

Share accepted snapshots across claims with bounded refresh. Stage the risk policy
through observation fixtures before enforcing it, but do not ship an unprotected
crediting mode under the name of observation. Product approval is required for
markets that must pause and the fee/GRIT quote lifetime; do not silently change
which assets qualify.

## W3 — durable charged rounds and one payout queue

### W3A: charged-round journal and fair randomness lifecycle

Estimate: 3–5 person-days. Depends on W0; integrate after shared schema agreement.

Existing files: `src/backend/lib/mining.mo`, `types/mining.mo`, `main.mo`,
`lib/cycle-guard.mo`, `lib/scoring.mo` (only integration if necessary), migrations.
Proposed helper: `src/backend/lib/mining-round.mo` if it reduces main.mo complexity.

Tests first: freeze participants/spends and debit once before raw_rand; edits while
awaiting randomness affect only future rounds; randomness reject/trap; duplicate
callbacks; prolonged cycle; stale callback after recovery; startup failure; upgrade
in every durable state; no extra catch-up charges; zero/partial payable reward.

Suggested lifecycle (names illustrative):
`idle -> chargedAwaitingRandomness -> drawn -> finalizedWithPayoutPending`.

Before asking for randomness, synchronously reserve the actual payable AKK reward,
freeze participants and weights, persist round identity, and debit GRIT once. A
round with no payable reward or no spend remains a no-op. The persisted state is
the audit trail while drawing is delayed. Failure resumes that same round; no
second charge or opportunistic participant change.

Persist the accepted randomness/winner once. A known result must never be discarded
for a preferred reroll. Every callback checks round/generation and phase. Prove
retry behavior for an interrupted unknown randomness result and state explicitly
that controller upgrades remain a trust boundary; this is not Bitcoin consensus.

Finalize local block history, height, earned totals, scoring and the payout intent
in one synchronous atomic transition. This records a reward obligation, not proof
of ledger delivery. Expose payout status separately. If that transition traps,
resume the durable drawn round rather than request a fresh draw.

Use strict ownership and bounded scheduling, not four-hour lock theft. Investigate
compiler-supported cleanup behavior against the pinned toolchain; do not copy a
newer Motoko finally recipe without tests. Install the recurring scheduler before
a potentially failing startup probe. Local locks alone are not durable recovery.

One unresolved charged round blocks new rounds. Completed rounds can accumulate
bounded unsettled payouts without blocking burns/claims. On payout-backlog or
issuance-budget limits, pause NEW rounds before charging and explain the pause.

### W3B: immutable payout intent, reservation and reconciliation

Estimate: 3–5 person-days. Depends on W3A state/schema; do not concurrently edit
main.mo/mining.mo with W3A.

Existing files: `main.mo`, `lib/ledger-mint.mo`, `lib/mining.mo`,
`mixins/mining-api.mo`, `types/akk-ledger.mo`, `types/mining.mo`,
`src/backend/system-idl/icrc1-ledger.did`, ledger tests and migrations.

Tests first: primary/retry/admin concurrency, exact retry identity at time boundaries,
ambiguous success, Duplicate, TooOld, CreatedInFuture, rejected/not-sent distinction,
insufficient supply, zero/partial payout, backend upgrade, ledger configuration
change, legacy timestamp-less retries and truncated/unavailable history.

One payout service owns every mint. Admin recovery requests queue work; it never
calls ledger transfer directly. Persist the final transfer identity BEFORE send:
ledger canister ID, source/recipient account, exact amount, memo, fee convention,
and timestamp. Reuse it unchanged. Reserve issuance before the round is charged;
unknown outcomes keep the reservation. A transient mutex alone does not solve
ambiguous calls that may still commit externally.

Initial issuance budget must be reconciled against ledger and existing liabilities.
Decide whether 21M means cumulative issuance or circulating supply; conservative
proposal is no automatic recycling of burned-token capacity. Do not re-read supply
and reclamp immutable payouts. Periodic reconciliation checks drift; mismatches
pause new issuance rather than silently delete reward obligations.

Within timestamp validity, retry identical requests where safe. TooOld is not proof
of non-payment. Beyond validity, keep the obligation/reservation and inspect
complete relevant ledger history, including archives, or route to manual review.
Failure to find a result in a partial page is not evidence of absence. Never
refresh a timestamp merely to make a transfer valid. Legacy ambiguous entries lack
an immutable original intent: quarantine for reconciliation, don't guess one.

Settlement status distinguishes success/duplicate-confirmed/pending/unknown/manual
review. Persist ledger transaction index on success and verified Duplicate. User
queries distinguish earned AKK from spendable ledger balance. Compact settled
payloads but retain identity and reconciliation evidence.

Retain stock Rust ledger initially to avoid a new monetary implementation. Document
exclusive mint authority and controller trust. Ledger-enforced 21M is a separate,
optional defense-in-depth project, not a hidden dependency of this plan.

## W4 — independent validation, migration rehearsal and release

Estimate: 3–5 person-days. Tests are developed with each build, not deferred here.

A fresh reviewer independently runs attack and fault scenarios against the exact
candidate and real configured ledger WASM. Provider failure is no sign-off. If
independent tooling is unavailable, record blocked validation and do not merge.

Rehearse migration from the actual old state shapes, not only an empty install:
canonical collisions, stale claim generations, unpaid rewards, ambiguous legacy
mints, current admins and fee config. New schema links are append-only; do not
edit applied migrations. Large conversions must be bounded and resumable. While
indexes/config are incomplete, admission/crediting fails closed. Rollback across a
schema change is not assumed safe: prepare and test compatible forward recovery.

Required gates from repository root, in sequence:
- `mops test`
- `mops check --fix` (report warnings; stable compatibility must pass)
- `mops build`
- `pnpm bindgen`
- from `src/frontend`: `pnpm typecheck`, `pnpm check`, `pnpm build`
- integration/fault suite with exact commands, independent review, `git diff --check`

Preserve only intended source/test/doc changes. Restore generated dist churn only
when verified generated by this run; never discard a user's existing modifications.
Do not publish private audit docs into a public repository by accident.

After explicit approval, one preview push; verify the exact backend identity and
configuration, code/build evidence and state. Backend resets are different from
upgrades: a fresh backend loses claim dedup/history and its ledger mint authority
may no longer match. Do not attach a blank replacement backend to the live ledger
and resume crediting without restored/reconciled state. A successful three-setting
readback does not recover lost state.

No user smoke testing on a known-broken path. Only after adversarial validation
passes: representative burn/fee/GRIT flows, mining/payout states, then a separate
user decision on merge/promotion. Production inventory must establish whether
historical compensation is required; compensation is never automatic.

## Effort, sequencing and handoff

Estimates are human engineering person-days, not autonomous-agent runtime or a
promise. Range covers normal implementation and targeted tests; large legacy
reconciliation or unavailable oracle sources can extend it.

| Slice | Estimate | Dependency / editing constraint |
|---|---:|---|
| W0 baseline/harness | 1–2 | First |
| W1A claims | 2–3 | W0 |
| W1B admission/config | 1–2 | W1A shared grit-api wiring |
| W2A quote ingestion | 2–3 | W0; isolated module work can overlap W1 |
| W2B quote policy | 2–4 | W2A; consumer integration after W1 |
| W3A round journal | 3–5 | W0 + agreed schema |
| W3B payout service | 3–5 | W3A; same-file changes serialized |
| W4 independent release validation | 3–5 | All completed builds |
| Total | 17–29 | Not a calendar-time guarantee |

One owner integrates actor types, migration links, main.mo and public bindings.
A frontend builder works against agreed state/query contracts after backend
interfaces stabilize. An independent validator is not the implementation agent.
The user approves each dispatch; this document creates no tickets.

Each handoff supplies: base/head revision; changed files; before/after failing
regression output; tests actually run; interface and stable-schema delta; migration
policy; measured call/instruction/storage costs; unresolved risks; deploy status
("not pushed" by default). Builders do not self-certify release safety.

## UX and canister-cost tradeoffs

| Change | User experience | Cost direction / caveat |
|---|---|---|
| Canonical keys and guarded claim finalization | Same wallet steps; duplicates return original status | Local indexed work, fewer duplicate verifications; migration adds one-time work |
| Shared validated quotes | Same burn/fee flow; paused market clearly explained | Bounded refresh instead of a new full price workflow per retry; stronger independent sources cost extra |
| Secure config readiness | Maintenance until safe; no fake failed payment | Local check per settlement; infrequent admin/readback operations |
| Charged round journal | GRIT charged once; visible delayed draw if randomness is unavailable | Extra durable writes/snapshot, no new EVM transaction |
| Separate payout worker | Earned reward may show awaiting delivery | Standard ledger calls remain; recovery/history reads are exceptional and bounded |
| Rate limits/backoff | Repeated clicks don't start duplicate jobs | Bounds abuse and retry storms; background recovery may be slower during outages |

No reliable dollar/cycles total is claimed. The installed
`.mops/caffeineai-http-outcalls@0.1.4/src/outcall.mo:45-69` sets a 1,000,000-byte
allowance and `is_replicated = ?false`. Confirm deployed subnet, execution mode,
provider billing and trust semantics before applying any standard fee formula.
Non-replicated mode also needs an explicit authenticity/trust review for financial
verification. Fetching an official standard replicated formula does not establish
this app's actual cost.

Measure HTTP calls, fallbacks, bytes, response allowance, queue work, instructions,
cycle deltas where exposed, and latency for good-path and outage workloads. Baseline
first; include burst claims, shared-token claims and retry backlog. Tighten response
limits only from observed headers+body plus safe margin, not a guessed small cap.

Illustrative storage budgeting only (not measured Motoko heap layouts):
- 100,000 claims at an additional 256–1,024 bytes each: 24.4–97.7 MiB.
- About 3,756.5 rounds per 30 days at uninterrupted 690-second cadence;
  128–384 extra retained bytes per settlement: about 0.46–1.38 MiB/month.
- One 10,000-participant active snapshot at 64–128 bytes/participant:
  about 0.61–1.22 MiB, excluding allocator/index/history duplication overhead.
Share or compact completed state where safe; never prune dedup facts merely
because the ledger's duplicate window expired.

## Product decisions before enabling enforcement

1. Approve per-token market/liquidity/quote-lifetime and rolling issuance limits
   based on measurements. Do not lock in arbitrary defaults here.
2. Approve earned-versus-delivered display and bounded-backlog mining pause.
3. Clarify cumulative versus circulating 21M policy and any genesis allocation.
4. The current schedule totals about 20,699,999.98965 AKK before rounding rewards
   to zero. This does not violate a 21M maximum. Do not change rewards or add the
   gap as a hidden security fix; any tokenomics change is separately authorized.
5. Historical repair/compensation needs a live data audit and explicit approval.

Recommended first approval: W0 plus W1A, the canonical replay regression and fix.
Do not make the small high-priority replay fix wait for the entire mining redesign,
but don't call the overall branch safe until the remaining release gates close.
