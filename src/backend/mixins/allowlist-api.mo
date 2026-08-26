import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AllowlistLib "../lib/allowlist";
import AllowlistTypes "../types/allowlist";
import Time "mo:core/Time";

mixin (
  allowlistState : AllowlistLib.State,
  admin : AllowlistLib.AdminState,
  gate : AllowlistLib.GateState
) {
  /// Admin: add a token to the allowlist.
  public shared ({ caller }) func addToken(token : AllowlistTypes.AllowlistedToken) : async () {
    if (not AllowlistLib.isAdmin(admin, caller)) {
      Runtime.trap("Unauthorized: caller is not admin");
    };
    AllowlistLib.addToken(allowlistState, token, caller);
  };

  /// Admin: remove a token from the allowlist by address + chain.
  public shared ({ caller }) func removeToken(tokenAddress : Text, chain : Text) : async () {
    if (not AllowlistLib.isAdmin(admin, caller)) {
      Runtime.trap("Unauthorized: caller is not admin");
    };
    AllowlistLib.removeToken(allowlistState, tokenAddress, chain, caller);
  };

  /// Anyone: list all tokens on the allowlist.
  public query func getTokens() : async [AllowlistTypes.AllowlistedToken] {
    AllowlistLib.getTokens(allowlistState);
  };

  /// Admin: get the full audit log of allowlist changes.
  public shared ({ caller }) func getAllowlistAuditLog() : async [AllowlistTypes.AuditLogEntry] {
    if (not AllowlistLib.isAdmin(admin, caller)) {
      Runtime.trap("Unauthorized: caller is not admin");
    };
    AllowlistLib.getAuditLog(allowlistState);
  };

  /// Anyone: get all current admin principals.
  public query func getAdmins() : async [Principal] {
    AllowlistLib.getAdmins(admin);
  };

  /// Admin: add a new admin principal (callable only by existing admin).
  public shared ({ caller }) func addAdmin(newAdmin : Principal) : async () {
    if (not AllowlistLib.isAdmin(admin, caller)) {
      Runtime.trap("Unauthorized: caller is not admin");
    };
    AllowlistLib.addAdmin(admin, newAdmin);
  };

  /// Admin: remove an admin principal (callable only by existing admin; cannot remove yourself if last admin).
  public shared ({ caller }) func removeAdmin(toRemove : Principal) : async () {
    if (not AllowlistLib.isAdmin(admin, caller)) {
      Runtime.trap("Unauthorized: caller is not admin");
    };
    if (admin.admins.size() <= 1) {
      Runtime.trap("Cannot remove the last admin");
    };
    AllowlistLib.removeAdmin(admin, toRemove);
  };

  /// Admin: set the EVM wallet address that receives the platform fee.
  public shared ({ caller }) func setFeeRecipient(address : Text) : async () {
    if (not AllowlistLib.isAdmin(admin, caller)) {
      Runtime.trap("Unauthorized: caller is not admin");
    };
    admin.feeRecipient := ?address;
  };

  /// Anyone: get the current fee recipient wallet address.
  public query func getFeeRecipient() : async ?Text {
    admin.feeRecipient;
  };

  /// Admin: set the platform fee percentage (e.g. 0.69 means 0.69%).
  public shared ({ caller }) func setFeePercent(percent : Float) : async () {
    if (not AllowlistLib.isAdmin(admin, caller)) {
      Runtime.trap("Unauthorized: caller is not admin");
    };
    if (percent < 0.0 or percent > 100.0) {
      Runtime.trap("Fee percent must be between 0 and 100");
    };
    admin.feePercent := percent;
  };

  /// Anyone: get the current platform fee percentage.
  public query func getFeePercent() : async Float {
    admin.feePercent;
  };

  /// Anyone: return the caller's own principal (used for display / copy in the UI).
  public shared query ({ caller }) func whoami() : async Principal {
    caller;
  };

  // NOTE: The legacy open admin-claim endpoints `bootstrapAdmin()` and
  // `resetAndClaimAdmin()` were REMOVED deliberately. They were only reachable
  // while bootstrapPrincipalSet was false, and their entire purpose is now
  // covered by the bootstrap-admin seeding in main.mo (real principal set at
  // build time). Removing them closes the anonymous-takeover class permanently;
  // do not reintroduce them.



  /// Admin: set the GRIT issuance rate (GRIT minted per $1.00 of token burned).
  /// Default is 1_000_000_000_000 (1 trillion GRIT per $1.00).
  /// Once setLaunched() has been called, this rate is permanently locked and cannot be changed.
  public shared ({ caller }) func setGritIssuanceRate(rate : Nat) : async () {
    if (not AllowlistLib.isAdmin(admin, caller)) {
      Runtime.trap("Unauthorized: caller is not admin");
    };
    if (admin.isLaunched) {
      Runtime.trap("GRIT Issuance Rate is locked at launch");
    };
    if (rate == 0) {
      Runtime.trap("Rate must be greater than 0");
    };
    admin.gritIssuanceRate := rate;
  };

  /// Admin: permanently lock protocol parameters by marking the canister as launched.
  /// This is a one-way operation — once called, isLaunched cannot be set back to false.
  /// Currently locks: GRIT Issuance Rate.
  public shared ({ caller }) func setLaunched() : async { #ok; #err : Text } {
    if (not AllowlistLib.isAdmin(admin, caller)) {
      return #err("Unauthorized: admins only");
    };
    if (admin.isLaunched) {
      return #err("Already launched");
    };
    admin.isLaunched := true;
    #ok;
  };

  /// Anyone: query whether the canister has been launched (i.e. protocol parameters are locked).
  public query func getIsLaunched() : async Bool {
    admin.isLaunched;
  };

  /// Anyone: get the current GRIT issuance rate.
  public query func getGritIssuanceRate() : async Nat {
    admin.gritIssuanceRate;
  };

  /// Admin: configure the time-window gate — enable/disable and set the burn-access window.
  /// startTime and endTime are Unix epoch milliseconds (as sent by the frontend).
  public shared ({ caller }) func setLaunchGate(enabled : Bool, startTime : Int, endTime : Int) : async () {
    if (not AllowlistLib.isAdmin(admin, caller)) {
      Runtime.trap("Unauthorized: caller is not admin");
    };
    if (enabled and startTime >= endTime) {
      Runtime.trap("startTime must be before endTime");
    };
    gate.gateEnabled   := enabled;
    gate.gateStartTime := startTime;
    gate.gateEndTime   := endTime;
  };

  /// Admin: configure the launch-time gate (independent of the time-window gate).
  /// When enabled, burns are blocked until Time.now() >= launchTime * 1_000_000 (ns).
  /// launchTime is Unix epoch milliseconds.
  public shared ({ caller }) func setLaunchTimeGate(enabled : Bool, launchTime : Int) : async () {
    if (not AllowlistLib.isAdmin(admin, caller)) {
      Runtime.trap("Unauthorized: caller is not admin");
    };
    gate.launchTimeEnabled := enabled;
    gate.launchTime        := launchTime;
  };

  /// Admin: enable or disable the NFT ownership gate.
  public shared ({ caller }) func setNftGate(enabled : Bool) : async () {
    if (not AllowlistLib.isAdmin(admin, caller)) {
      Runtime.trap("Unauthorized: caller is not admin");
    };
    gate.nftGateEnabled := enabled;
  };

  /// Anyone: get the current launch gate configuration (all fields).
  public query func getLaunchGate() : async { enabled : Bool; startTime : Int; endTime : Int } {
    {
      enabled   = gate.gateEnabled;
      startTime = gate.gateStartTime;
      endTime   = gate.gateEndTime;
    };
  };

  /// Anyone: get the full launch gate config including launchTime and NFT gate toggles.
  public query func getLaunchGateConfig() : async {
    timeWindowEnabled : Bool;
    startTime         : Int;
    endTime           : Int;
    launchTimeEnabled : Bool;
    launchTime        : Int;
    nftGateEnabled    : Bool;
  } {
    {
      timeWindowEnabled = gate.gateEnabled;
      startTime         = gate.gateStartTime;
      endTime           = gate.gateEndTime;
      launchTimeEnabled = gate.launchTimeEnabled;
      launchTime        = gate.launchTime;
      nftGateEnabled    = gate.nftGateEnabled;
    };
  };
};
