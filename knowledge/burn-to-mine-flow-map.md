# Burn → Mine Flow — Deep Audit Ground Truth (v341)

**Scope:** full burn-to-mine pipeline — Phase A (burn tx), Phase B (fee → GRIT credit), Phase C (miner creation) — every dependency failure path, 4 chains × 5 token entries.
**Base:** `origin/main @ 1216c76` (= shipped v341), read-only.
**Method:** orchestrator ground-truth trace + 5 independent model-pinned subagent audits (deepseek/deepseek-v4.1-flash, max effort) on board anti-krisis (t_94eef1e6 / t_8dc6c7ed / t_c8997636 / t_27d2a39a / t_e5cb12b6), deduped and spot-verified by the orchestrator before reporting.
**Visual:** `knowledge/burn-to-mine-flow-map.html` (lanes per phase, failure tables with exact messages + recovery actions, matrices, ranked findings).

## Merged ranked findings (21)

| # | Sev | Finding | Evidence |
|---|-----|---------|----------|
| 1 | CRIT | Adoption race steals an in-flight credit (credit pays `updated.claimant` at CAS-write time; adoption rebinds claimant synchronously during the victim's verification awaits) | grit.mo:226-243, :175-196; grit-api.mo:439-453 |
| 2 | CRIT | AKK-10 floor skipped when burn verifies via timer on the combined claim path (stale `record.usdValue=0` → `usd>0.0` gate skips) | grit-api.mo:472-488, :853, :344-346; fee-amount.mo:149-161; :881-884 |
| 3 | CRIT | Recovery-path fees sized from token count not USD (~1/token-price error; verified at all 3 call sites) | BurnHistoryPage.tsx:331,412; BurnPage.tsx:1907; use-wallet.ts:365-371 |
| 4 | CRIT | Miner-fee replay key fails open + raw hash into JSON-RPC body (no canonicalization in mining path; injection precondition UNVERIFIED) | mining-api.mo (no ClaimIdentity import); verification.mo:39-61; mining.mo:606-618 |
| 5 | HIGH | Disarmed FeePaid silently disables the fee-amount floor (claim path; miner path refuses) | grit-api.mo:245-260, :344; mining-api.mo:127-129 |
| 6 | HIGH | Free unauthenticated claim spam + public unbounded sweep, no expiry → permanent cycle drain | grit-api.mo:472-488, :1049, :1074-1082; grit.mo:365-372 |
| 7 | HIGH | Fee-stage failure dead end — no way to pay a NEW fee (Retry Claim re-sends the same doomed hash) | claim-recovery.ts:42-60; BurnHistoryPage.tsx:376-380; grit-api.mo:1128-1143 |
| 8 | HIGH | Frontend price picker lacks backend's dust-pair/base-token filter (11× mispricing class, unfixed on frontend) | utils/dexscreener.ts:21-49 vs price-oracle.mo:70-82,139 |
| 9 | HIGH | Adoption wipes paid-fee evidence → repeatable fee griefing | grit.mo:235-239; grit-api.mo:1119-1121 |
| 10 | HIGH | Timer credits at current price while floor used claim-time price (comparator asymmetry) | grit-api.mo:807,853,883,978,1186 |
| 11 | HIGH | No durable record of burn before claim exists (tab close in the 15s+90s window orphans the burn; no manual-hash recovery) | BurnPage.tsx:756,787-837 |
| 12 | HIGH | Smart-contract wallets can never create a miner (payer=Safe ≠ tx.from=EOA → PENDING forever) | mining-api.mo:175-178 |
| 13 | MED | Deterministic createMiner errors unclassified → infinite silent 30s retry | mining.mo:63-67; use-miner-creation.ts:184-210 |
| 14 | MED | Boot re-seeding reverts admin config every upgrade; seeds bypass the F1 allowlist guard | main.mo:245-280; mining-api.mo:662-682 |
| 15 | MED | kVCM retirement proof fabricable (emitting contract never checked) | verification.mo:1236-1470 |
| 16 | MED | Time-window burn gate never enforced backend-side (inert config) | allowlist-api.mo:208-218 (written, never read) |
| 17 | MED | Block-cycle timer can die permanently on one trap (recurringTimer + re-throw; claim timer got the fix, block timer didn't) | main.mo:341-349, :644-663, :699-706 |
| 18 | MED | Unknown chain silently becomes Ethereum; receipt wait fails open | types.ts:112; BurnHistoryPage.tsx:323-330,404-411; kvcm-retirement.ts:867-868 |
| 19 | MED | CoinGecko (frontend) vs DexScreener (backend floor) divergence can fail honest fees; fee sunk | use-wallet.ts:36-47; grit-api.mo:154-177; fee-amount.mo:28 |
| 20 | LOW | Drift/dead code: stale age-out docs, stale celo-skip comment, write-only priceCache, two explorer maps, 5 RPC lists (3 stale), unreachable branches | see HTML map §7 |
| 21 | INFO | Accepted risks: DexScreener oracle manipulability (W2A/W2B descoped), caller-elected 6.9% cross-check, no dust floor, no second-fee guard | grit-api.mo:618; owner decisions on record |

## Verified sound (do not re-litigate)

CAS double-credit guard (grit.mo:113-201) · W4/F2 zero-credit refusal (grit.mo:157-160) · claim-first ordering (BurnPage.tsx:821-837) · canonical tx identity (claim-identity.mo) · MINE↔claim payload separation (verification.mo:291-318 vs :930-972) · D1 armed-anywhere (mining-api.mo:95-131) · miner-fee single-use await-free tail (mining-api.mo:212-233) · self-healing claim timer (main.mo:723-736) · FeePaid head-word decode (fee-amount.mo:74-124) · transient-vs-structural discipline · non-JSON RPC guards · no-expiry recovery model.

## Fix order

1. **Before more main/live traffic:** #1, #2, #4 (canister-side money doors) + #3 (one-line frontend fix ×3).
2. **Next wave:** #5, #6, #7, #8, #11, #12.
3. **Hygiene pass:** #13–#20.
