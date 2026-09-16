module {
  /// Fee-verification configuration (AKK-4 Option B: FeeCollector contract).
  /// Kept as a SEPARATE stable record from AdminState so adding these fields
  /// does not break stable-variable compatibility of already-deployed
  /// canisters (same pattern as GateState).
  public type FeeState = {
    /// EVM address of the FeeCollector contract. Empty text = not configured.
    /// Once the collector is deployed on every chain, admin sets both this
    /// AND `feeRecipient` to the same (collector) address — atomically via
    /// `AllowlistLib.applySecureFeeConfig` (W1B), which validates both
    /// addresses and commits recipient + collector + arm together.
    var collectorAddress : Text;
    /// When true, fee-binding verification additionally requires a `FeePaid`
    /// event emitted BY the collector contract inside the fee-tx receipt —
    /// defeats address-squatting on chains where the collector is not yet
    /// deployed. Arm ONLY via `applySecureFeeConfig` (which enforces
    /// recipient == collector); a lone setter that arms with no cross-check
    /// is deliberately not provided. Disarming stays available for
    /// emergencies via `disarm` — recipient/collector survive a disarm
    /// (they are deployment facts, not part of the armed flag).
    var requireFeePaidEvent : Bool;
  };

  /// W1B: emergency-only un-arming. The armed flag alone flips; the
  /// deployment facts (recipient, collector) are left untouched so a
  /// re-arm via `applySecureFeeConfig` is a single validated call.
  public func disarm(feeState : FeeState) {
    feeState.requireFeePaidEvent := false;
  };
};
