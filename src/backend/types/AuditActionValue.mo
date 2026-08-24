import OQL "mo:caffeineai-oql";
import AllowlistTypes "allowlist";

module {
  public func _toRow(self : AllowlistTypes.AuditAction) : OQL.Value =
    #text (switch self {
      case (#add) "add";
      case (#remove) "remove";
    });
};
