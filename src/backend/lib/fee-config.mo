module {
  /// Fee-verification configuration (AKK-4 Option B: FeeCollector contract).
  /// Kept as a SEPARATE stable record from AdminState so adding these fields
  /// does not break stable-variable compatibility of already-deployed
  /// canisters (same pattern as GateState).
  public type FeeState = {
    /// EVM address of the FeeCollector contract. Empty text = not configured.
    /// Once the collector is deployed on every chain, admin sets both this
    /// AND `feeRecipient` to the same (collector) address.
    var collectorAddress : Text;
    /// When true, fee-binding verification additionally requires a `FeePaid`
    /// event emitted BY the collector contract inside the fee-tx receipt —
    /// defeats address-squatting on chains where the collector is not yet
    /// deployed. Arm ONLY after the collector is deployed and `feeRecipient`
    /// equals `collectorAddress`; enabling it while feeRecipient still points
    /// at an EOA would fail every claim.
    var requireFeePaidEvent : Bool;
  };
};
