// AKK-5: reentrancy guard for the block cycle.
//
// Motoko recurring timers do NOT serialize async callbacks: if a cycle's
// awaits (mint-retry drain, VRF randomness, ledger mint) stretch past the
// 690s interval — e.g. with a pendingMints backlog — the next timer fire
// overlaps the still-running one. That double-drains every active miner's
// GRIT, voids the second winner's reward via the blockId dedup, and corrupts
// block history. See knowledge/vulnerability-audit-v264.md (AKK-5).
//
// The guard state is bound in main.mo as an actor-level `transient var`, so
// it is excluded from the stable layout (no migration churn) and re-initializes
// to "no cycle in flight" on every upgrade/process start — an upgrade that
// lands mid-cycle can never latch the guard shut.
//
// NO STALENESS BYPASS (W3A review, F3): an earlier revision admitted a new
// cycle when the active one looked older than a 4h bound ("self-heal"). That
// bypass was removed. It guarded a state that cannot occur — an IC message is
// aborted long before 4h, and a trap rolls back the flag write itself, so a
// wedged guard cannot persist across fires — while being the ONLY code path
// able to admit an overlapping cycle, i.e. it could only ever open the wrong
// way. With the retry drain now bounded (DRAIN_BATCH_MAX per cycle, ~3 min
// worst case) honest cycles are far shorter than the 690s interval, so the
// strict guard never costs a legitimately-scheduled fire.
//
// Invariant: at most ONE block cycle is executing at any instant. A fire that
// cannot enter is a no-op; the next aligned fire picks up the work.

module {
  /// Mutable guard cell. Kept as a plain record so the actor can hold it in a
  /// `transient var` (excluded from the stable layout by construction).
  public type GuardState = { var busy : Bool };

  /// A fresh, inactive guard.
  public func newGuard() : GuardState {
    { var busy = false };
  };

  /// Enter the cycle. Returns false (without entering) when a cycle is
  /// already running — the caller must treat that as a skip, not an error;
  /// the next aligned timer fire picks up the work.
  public func tryEnter(g : GuardState) : Bool {
    if (g.busy) { return false };
    g.busy := true;
    true;
  };

  /// Mark the cycle as finished so the next timer fire can proceed.
  /// Idempotent: releasing an inactive guard is harmless.
  public func release(g : GuardState) {
    g.busy := false;
  };

  /// Is a cycle currently in flight? (observability / tests)
  public func isActive(g : GuardState) : Bool {
    g.busy;
  };
};
