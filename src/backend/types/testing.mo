import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  /// State for admin test score overrides.
  /// Each admin can set an override for their own principal only.
  public type State = {
    /// principal → overridden Float score (set by admin for badge testing)
    overrides : Map.Map<Principal, Float>;
  };

  public func newState() : State {
    { overrides = Map.empty() };
  };
};
