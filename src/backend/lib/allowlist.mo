import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/allowlist";
import FeeConfig "fee-config";
import EvmAddress "evm-address";
import Principal "mo:core/Principal";

module {
  public type AdminState = {
    admins                 : List.List<Principal>;
    var feeRecipient       : ?Text;
    var feePercent         : Float;  // basis of 100, e.g. 0.69 means 0.69%
    var gritIssuanceRate   : Nat;    // GRIT per $1.00 burned, default 100_000_000_000
    // True once a bootstrapAdminPrincipal was provided at canister init.
    // When true, the open bootstrapAdmin() call is disabled — admin was set securely at init.
    var bootstrapPrincipalSet : Bool;
    // One-way launch flag — once set to true, certain protocol parameters (e.g. GRIT Issuance Rate)
    // become read-only and can no longer be changed via admin functions.
    var isLaunched : Bool;
  };

  // Separate state record for launch gate fields.
  // Kept separate from AdminState so adding these fields does not break
  // stable-variable compatibility with already-deployed canisters.
  public type GateState = {
    // --- Time-window gate (existing) ---
    var gateEnabled   : Bool;  // true = a burn-access time window is active
    var gateStartTime : Int;   // gate window start (ms epoch, as passed from frontend)
    var gateEndTime   : Int;   // gate window end   (ms epoch, as passed from frontend)
    // --- Launch-time gate (new) ---
    // When launchTimeEnabled == true, burns are blocked until Time.now() >= launchTime * 1_000_000
    var launchTimeEnabled : Bool;
    var launchTime        : Int;  // epoch milliseconds (frontend convention)
    // --- NFT gate (new explicit toggle) ---
    // When nftGateEnabled == true, callers must hold the required NFTs to burn
    var nftGateEnabled : Bool;
  };

  public type State = {
    tokens   : List.List<Types.AllowlistedToken>;
    auditLog : List.List<Types.AuditLogEntry>;
  };

  /// W1B: fresh empty admin list (test helper — an AdminState value cannot be
  /// constructed outside the module because List identity matters).
  public func emptyAdmins() : List.List<Principal> {
    List.empty<Principal>();
  };

  public func isAdmin(adminState : AdminState, caller : Principal) : Bool {
    adminState.admins.find(func(p : Principal) : Bool { p == caller }) != null
  };

  // W1B: the anonymous principal must NEVER hold admin rights. Every
  // unauthenticated caller shares the same principal; if it ever landed in
  // this list, `isAdmin` would return true for every anonymous call.
  // (Very-low likelihood — requires an existing admin to pass it — but the
  // rejection is permanent and costs one comparison.)
  //
  // NOTE: `Principal.isAnonymous()` compares against core's single-byte
  // sentinel, but the well-known anonymous TEXT 'aaaaa-aa' decodes to a
  // DIFFERENT blob in this toolchain — empirically verified:
  // fromText("aaaaa-aa").isAnonymous() == false under moc 1.11.2/core 2.6.1.
  // Both shapes are rejected here so the guard holds regardless.
  public func addAdmin(adminState : AdminState, newAdmin : Principal) {
    if (newAdmin.isAnonymous() or newAdmin == Principal.fromText("aaaaa-aa")) {
      return; // silently ignore — anonymous can never be an admin
    };
    if (adminState.admins.find(func(p : Principal) : Bool { p == newAdmin }) == null) {
      adminState.admins.add(newAdmin);
    };
  };

  public func removeAdmin(adminState : AdminState, toRemove : Principal) {
    let filtered = adminState.admins.filter(func(p : Principal) : Bool { p != toRemove });
    adminState.admins.clear();
    for (p in filtered.values()) {
      adminState.admins.add(p);
    };
  };

  public func getAdmins(adminState : AdminState) : [Principal] {
    adminState.admins.toArray();
  };

  // ── W1B: atomic secure fee configuration ──────────────────────────────────
  //
  // Today the three fee settings (feeRecipient, collectorAddress, FeePaid
  // arm) are three separate admin setters with no cross-validation. The
  // FeeState comment itself warns that arming while feeRecipient points at
  // an EOA "would fail every claim", and each backend reset has required the
  // manual 3-call ritual with zero validation: a mistyped collector address
  // silently routes fee-verification against garbage.
  //
  // `applySecureFeeConfig` validates everything FIRST and commits all three
  // values TOGETHER: a rejected call leaves state completely untouched.

  public type SecureConfigResult = { #ok; #err : Text };

  public func applySecureFeeConfig(
    adminState : AdminState,
    feeState : FeeConfig.FeeState,
    feeRecipient : Text,
    collectorAddress : Text,
  ) : SecureConfigResult {
    // Validate recipient
    let canRecipient = switch (EvmAddress.validate(feeRecipient)) {
      case (#ok(r)) { r };
      case (#err(e)) { return #err("feeRecipient invalid: " # e) };
    };
    // Validate collector
    let canCollector = switch (EvmAddress.validate(collectorAddress)) {
      case (#ok(c)) { c };
      case (#err(e)) { return #err("collectorAddress invalid: " # e) };
    };
    // Security invariant: recipient must equal collector, otherwise the
    // armed FeePaid check (which only fires for payments that reached the
    // collector) and the recipient the frontend pays would diverge —
    // either failing every claim or paying an address that never proves
    // receipt.
    if (canRecipient != canCollector) {
      return #err("feeRecipient must equal collectorAddress (recipient " # canRecipient # " != collector " # canCollector # ")");
    };
    // All validation passed — commit atomically (no awaits anywhere).
    adminState.feeRecipient := ?canRecipient;
    feeState.collectorAddress := canCollector;
    feeState.requireFeePaidEvent := true;
    #ok;
  };

  public func newState() : State {
    {
      tokens   = List.empty();
      auditLog = List.empty();
    };
  };

  public func addToken(state : State, token : Types.AllowlistedToken, admin : Principal) {
    // Normalize address to lowercase before storing
    let normalizedToken = { token with tokenAddress = token.tokenAddress.toLower() };
    // Upsert: replace existing entry for the same address+chain, or add new
    switch (state.tokens.findIndex(func(t : Types.AllowlistedToken) : Bool {
      t.tokenAddress == normalizedToken.tokenAddress and t.chain == normalizedToken.chain
    })) {
      case (?idx) {
        state.tokens.put(idx, normalizedToken);
      };
      case null {
        state.tokens.add(normalizedToken);
      };
    };
    if (not admin.isAnonymous()) {
      state.auditLog.add({
        action        = #add;
        tokenAddress  = normalizedToken.tokenAddress;
        chain         = normalizedToken.chain;
        adminPrincipal = admin;
        timestamp     = Time.now();
      });
    };
  };

  public func removeToken(state : State, tokenAddress : Text, chain : Text, admin : Principal) {
    // Normalize address to lowercase for comparison
    let normalizedAddress = tokenAddress.toLower();
    let removed = state.tokens.find(func(t : Types.AllowlistedToken) : Bool {
      t.tokenAddress == normalizedAddress and t.chain == chain
    });
    switch (removed) {
      case null { /* nothing to remove */ };
      case _ {
        // Build a new list without the matched entry
        let keep = state.tokens.filter(func(t : Types.AllowlistedToken) : Bool {
          not (t.tokenAddress == normalizedAddress and t.chain == chain)
        });
        state.tokens.clear();
        for (t in keep.values()) {
          state.tokens.add(t);
        };
        if (not admin.isAnonymous()) {
          state.auditLog.add({
            action        = #remove;
            tokenAddress  = normalizedAddress;
            chain;
            adminPrincipal = admin;
            timestamp     = Time.now();
          });
        };
      };
    };
  };

  public func getTokens(state : State) : [Types.AllowlistedToken] {
    state.tokens.toArray();
  };

  public func findToken(state : State, tokenAddress : Text, chain : Text) : ?Types.AllowlistedToken {
    state.tokens.find(func(t : Types.AllowlistedToken) : Bool {
      t.tokenAddress.toLower() == tokenAddress.toLower() and t.chain == chain
    });
  };

  public func getAuditLog(state : State) : [Types.AuditLogEntry] {
    state.auditLog.toArray();
  };
};
