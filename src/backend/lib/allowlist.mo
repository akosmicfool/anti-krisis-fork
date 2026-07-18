import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/allowlist";
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

  public func isAdmin(adminState : AdminState, caller : Principal) : Bool {
    adminState.admins.find(func(p : Principal) : Bool { p == caller }) != null
  };

  public func addAdmin(adminState : AdminState, newAdmin : Principal) {
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
