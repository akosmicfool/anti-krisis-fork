import OQL "mo:caffeineai-oql";
import GritTypes "grit";

module {
  public func _toRow(self : GritTypes.ClaimStatus) : OQL.Value =
    #text (switch self {
      case (#pending) "pending";
      case (#verified) "verified";
      case (#failed) "failed";
      case (#pendingFee) "pendingFee";
    });
};
