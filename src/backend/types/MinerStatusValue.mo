import OQL "mo:caffeineai-oql";
import MiningTypes "mining";

module {
  public func _toRow(self : MiningTypes.MinerStatus) : OQL.Value =
    #text (switch self {
      case (#active) "active";
      case (#paused) "paused";
      case (#exhausted) "exhausted";
    });
};
