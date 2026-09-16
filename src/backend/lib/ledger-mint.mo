// AKK-7 + AKK-6: shared helpers for the three ledger-mint call sites
// (mintAkkToWinner primary, tryLedgerMint retry drain, creditAbandonedMints
// admin replay).
//
// AKK-7 (idempotency): the ICRC-1 ledger (icrc1-mo, transaction_window
// default = 24h — verified in .mops/icrc1-mo@0.2.1/src/ICRC1/lib.mo) dedups
// on the hash of the FULL transfer request, including created_at_time, and
// only within that 24h window. Retry paths previously sent created_at_time =
// now, so a retry hashed differently from the original attempt and the
// ledger's dedup never engaged: a lost response after a committed ledger
// transfer minted twice. Fix: derive the timestamp deterministically from
// the blockId (EPOCH + blockId * BLOCK_SECONDS) so every attempt of block N
// hashes identically. Because the dedup window is finite, an old block's
// derived timestamp is CLAMPED FORWARD in whole window-steps — deterministic
// per (blockId, clamp-step), still fresh enough to pass is_too_old, and two
// retries minutes apart compute the same clamped value.
//
// AKK-6 (cap): the primary path clamped against icrc1_total_supply but
// proceeded UNCAPPED when the supply query threw, and the two retry paths
// never checked the cap at all. All paths now share capDecision(); on a
// failed supply query the caller must defer to the retry queue instead of
// minting blind.

import Time "mo:core/Time";
import Int "mo:core/Int";

module {
  /// 21M AKK hard cap in e8s (8 decimals).
  public let AKK_HARD_CAP : Nat = 2_100_000_000_000_000;

  /// Fixed epoch for derived mint timestamps: 2026-01-01T00:00:00Z in ns.
  /// Must be safely in the past and constant forever (changing it changes
  /// every derived timestamp and could re-open dedup holes).
  public let MINT_TS_EPOCH_NS : Int = 1_767_225_600_000_000_000;

  /// Block cadence in ns (690s) — distinct blockIds map to distinct slots.
  public let BLOCK_SECONDS_NS : Int = 690_000_000_000;

  /// The ledger's dedup/validity window (icrc1-mo default transaction_window
  /// = 24h). A created_at_time older than now − window is rejected #TooOld,
  /// and duplicates outside the window are pruned (no dedup). Kept in sync
  /// with the ledger package; the init args do not override it.
  public let TX_WINDOW_NS : Int = 86_400_000_000_000;

  /// Safety margin subtracted from the window so clock drift between this
  /// canister and the ledger can't push a freshly derived ts across the
  /// boundary in either direction.
  public let WINDOW_MARGIN_NS : Int = 3_600_000_000_000; // 1h

  /// F2 staleness net: how close to the window's old edge a FROZEN timestamp
  /// may get before a retry must re-freeze it.
  ///
  /// Freezing (MintRetryEntry.createdAtTime) buys dedup identity across
  /// retries, but it also means the timestamp no longer refreshes itself. The
  /// clamp below lands the value at age 1h..23h; the normal retry horizon is
  /// MAX_MINT_ATTEMPTS drain cycles (~57.5 min), so the oldest possible frozen
  /// value reaches ~23.96h at the LAST attempt — only ~2.5 min inside the
  /// ledger's 24h window. Any extra delay (a skipped cycle, a ledger outage, an
  /// upgrade) crosses the edge, and because the value is frozen EVERY later
  /// attempt — and the admin replay — would then fail #TooOld forever: the
  /// block reward becomes permanently unpayable. That failure mode did not
  /// exist before freezing (each attempt re-derived a fresh value).
  ///
  /// Rule: keep the frozen value while it is usable; re-freeze only once it is
  /// within `FREEZE_SAFETY_NS` of the edge. Identity is preserved for the whole
  /// normal horizon (a ≤1h retry burst vs a ≥23h threshold), so the margin only
  /// ever matters on the stall path.
  ///
  /// MARGIN (W4 adjudication, 5 min): re-freezing DELIBERATELY surrenders the
  /// remaining ≤ FREEZE_SAFETY_NS of the ledger's dedup record — the value is
  /// still live at that point — in exchange for keeping the reward payable. That
  /// trade only pays off if the margin is as tight as clock/latency tolerance
  /// allows: IC clocks are subnet-synchronised to well under a second and an
  /// outcall is seconds, so 5 min is ~2 orders of magnitude of slack while
  /// shrinking the surrender band from ~31 min to ~6 min. A too-tight margin
  /// fails safe: an attempt that ages out is rejected `#TooOld` (the transfer
  /// did NOT happen), and the next drain sees a larger age, re-freezes, and
  /// mints — or the entry reaches abandonedMints, whose replay path re-freezes
  /// stale values too. A re-hash double-mint, by contrast, is permanent loss.
  ///
  /// Re-freezing an abandoned entry is additionally safe when the retry history
  /// actually PROBED the ledger: a committed transfer returns #Duplicate on the
  /// next identical attempt. That induction does not hold for attempts that died
  /// at the transport layer (they probe nothing) — a known, documented residual,
  /// kept narrow by the tight margin above.
  public let FREEZE_SAFETY_NS : Int = 300_000_000_000; // 5 min (W4 adjudication)

  /// Would the ledger reject this frozen timestamp as #TooOld (or be about to)?
  /// `frozen` is the value stored on the queue entry; `nowNs` is Time.now().
  public func isFrozenStale(frozen : Nat64, nowNs : Int) : Bool {
    let age = nowNs - frozen.toNat().toInt();
    age >= TX_WINDOW_NS - FREEZE_SAFETY_NS;
  };

  /// Deterministic mint timestamp for a blockId (AKK-7).
  /// Base = EPOCH + blockId * BLOCK_SECONDS_NS. Two symmetric clamps keep the
  /// value inside the ledger's validity window at derivation time:
  ///   - older than now − (window − margin) → clamped to the window-aligned
  ///     grid (stale old blocks);
  ///   - newer than now − margin (blockIds can outrun wall-clock time) → the
  ///     SAME window-aligned grid.
  /// DETERMINISM ACROSS RETRIES is the load-bearing property: every retry of
  /// block N must produce the SAME ts, or the ledger's dedup never engages.
  /// Clamping to the 690s grid alone is NOT sufficient — consecutive drain
  /// cycles can straddle a grid boundary and compute different values for the
  /// same block (double-mint reopened). The stable anchor is therefore the
  /// DRAIN CYCLE's block-scoped identity: retries that matter all happen
  /// while the entry is still queued, i.e. within MAX_MINT_ATTEMPTS drain
  /// cycles (~1h) — far inside the 24h window. So the grid clamp uses a
  /// window-sized step (24h − 2×margin), NOT the 690s block cadence: two
  /// retries within the same window compute the identical clamped value, and
  /// the entry is long gone (drained or abandoned) before the next window.
  /// Cross-block collision of the CLAMPED value is harmless: the ledger's
  /// dedup hash covers the full request including the memo, which already
  /// encodes the blockId (Utils.blockIdMemo) — different blocks never share
  /// a dedup hash even with identical timestamps.
  public func mintCreatedAtTime(blockId : Nat, nowNs : Int) : Nat64 {
    let derived = MINT_TS_EPOCH_NS + blockId * BLOCK_SECONDS_NS;
    let floor = nowNs - (TX_WINDOW_NS - WINDOW_MARGIN_NS);
    if (derived >= floor and derived <= nowNs - WINDOW_MARGIN_NS) {
      return fromIntClamped(derived);
    };
    // Clamp onto the WINDOW grid: largest multiple of (TX_WINDOW − 2×margin)
    // that is ≤ now − margin. Step = 22h → a clamp value computed at any
    // point inside one window equals the value computed inside the SAME
    // window, and the 2h total margin keeps the result ≥1h from both
    // rejection edges (TooOld / CreatedInFuture).
    let step = TX_WINDOW_NS - 2 * WINDOW_MARGIN_NS;
    let anchor = nowNs - WINDOW_MARGIN_NS;
    let k = anchor / step; // floor for positive anchor
    fromIntClamped(k * step);
  };

  func fromIntClamped(v : Int) : Nat64 {
    if (v <= 0) { return 0 };
    let n = Int.abs(v);
    if (n > 9_223_372_036_854_775_807) { return 9_223_372_036_854_775_807 };
    Nat64.fromNat(n);
  };

  /// Cap decision (AKK-6): given the current total supply and a requested
  /// mint amount, return the amount that may actually be minted (0 when the
  /// cap is reached, clamped to remaining near the cap). Callers treat 0 as
  /// "block recordable, nothing mintable" — the block still closes.
  public func capDecision(currentSupply : Nat, _hardCap : Nat, amount : Nat) : Nat {
    if (currentSupply >= AKK_HARD_CAP) { return 0 };
    let remaining = AKK_HARD_CAP - currentSupply;
    if (amount > remaining) { remaining } else { amount };
  };

  /// Convenience for callers that already have a remaining figure.
  public func clampToCap(amount : Nat, remaining : Nat) : Nat {
    if (amount > remaining) { remaining } else { amount };
  };
};
