import List "mo:core/List";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Types "../types/grit";
import Text "mo:core/Text";
import TribeTypes "../types/tribe";


module {
  public type State = {
    balances         : Map.Map<Principal, Nat>;
    totalEarned      : Map.Map<Principal, Nat>;  // all-time GRIT credited, never decremented
    claims           : List.List<Types.ClaimRecord>;
  };

  public func newState() : State {
    {
      balances    = Map.empty();
      totalEarned = Map.empty();
      claims      = List.empty();
    };
  };

  /// Calculate GRIT to mint.
  /// rate is the configurable issuance rate: GRIT per $1.00 burned (default 100_000_000_000).
  /// amountBurned is in the token's smallest unit (wei-like).
  /// priceUSD is the effective price (real-time or admin-set fallback).
  /// decimals is the token's decimal places.
  /// Formula: floor(amountBurned / 10^decimals * priceUSD * rate)
  public func calcGrit(rawAmountBurned : Nat, decimals : Nat, priceUSD : Float, rate : Nat) : Nat {
    // Compute 10^decimals as a Nat divisor
    var divisor : Nat = 1;
    var d = decimals;
    while (d > 0) { divisor *= 10; d -= 1 };
    // Scale priceUSD to avoid float arithmetic in the main computation.
    // priceScaled = round(priceUSD * 1_000_000)
    let priceScaled : Nat = floatToNat6(priceUSD);
    // GRIT = floor(humanAmount * priceUSD * rate)
    //      = floor(rawAmountBurned * priceScaled * rate / divisor / 1_000_000)
    // rate is now GRIT per $1.00, so no * 100 multiplier needed.
    // Multiply BEFORE dividing to preserve precision for small fractional amounts.
    // Motoko Nat is arbitrary precision so no overflow risk.
    let numerator = rawAmountBurned * priceScaled * rate;
    numerator / divisor / 1_000_000;
  };

  /// Convert a Float price to a Nat scaled by 1_000_000 (6 decimal places).
  func floatToNat6(f : Float) : Nat {
    let scaled = f * 1_000_000.0;
    if (scaled < 0.0) { 0 } else { Int.abs((scaled + 0.5).toInt()) };
  };

  public func isDuplicateClaim(state : State, txHash : Text) : Bool {
    switch (state.claims.find(func(r : Types.ClaimRecord) : Bool { r.txHash == txHash })) {
      case null { false };
      case _    { true  };
    };
  };

  public func storePendingClaim(state : State, record : Types.ClaimRecord) {
    state.claims.add(record);
  };

  /// Retry semantics (AKK-4 era): a #failed claim is terminal-but-worthless —
  /// it credited nothing (gritMinted is 0 by construction) and blocks the
  /// duplicate guard from ever re-attempting the same burn. Resurrection
  /// mutates that record in place back to #pending with the NEW feeTxHash and
  /// a fresh timestamp (restarting the 35-min age window), letting the same
  /// burn retry fee binding and pricing. Only the ORIGINAL claimant may
  /// resurrect, and only #failed records — #verified keeps its CAS-protected
  /// credit, #pending/#pendingFee have their own retry loops.
  public func resurrectFailedClaim(state : State, txHash : Text, caller : Principal, feeTxHash : Text, now : Int) : Bool {
    var eligible = false;
    switch (state.claims.find(func(r : Types.ClaimRecord) : Bool { r.txHash == txHash })) {
      case null { return false };
      case (?r) {
        if (r.status == #failed and r.claimant == caller) { eligible := true };
      };
    };
    if (not eligible) { return false };
    state.claims.mapInPlace(func(r : Types.ClaimRecord) : Types.ClaimRecord {
      if (r.txHash == txHash) {
        {
          r with
          status = #pending;
          feeTxHash = ?feeTxHash;
          amountBurned = 0.0;
          usdValue = 0.0;
          gritMinted = 0;
          timestamp = now;
        }
      } else { r }
    });
    true;
  };

  /// Update an existing claim's status and (on #verified) credit GRIT to the claimant.
  /// onGritCredited is called with (user, newBalance) if GRIT is credited, to allow tribe stats sync.
  ///
  /// AKK-2 RACE GUARD (compare-and-set): callers typically compute `gritToCredit` across
  /// one or more `await` boundaries (RPC verification, price oracle, fee-tx checks), so two
  /// overlapping invocations for the same txHash can both arrive holding a stale snapshot
  /// in which the claim still looks uncredited — previously BOTH credited the balance.
  /// We treat the *currently stored* record as the single source of truth: only when its
  /// authoritative status, read immediately before mutation (no await in between), is
  /// still an awaiting state (#pending / #pendingFee) does this call take effect. A claim
  /// already in a terminal state (#verified / #failed) is left unchanged and never
  /// receives a second balance credit, making repeated and concurrent-equivalent calls
  /// idempotent. It also prevents stale callers from downgrading a #verified claim to
  /// another status while its balance stays credited.
  public func updateClaimStatus(
    state : State,
    txHash : Text,
    status : Types.ClaimStatus,
    gritToCredit : Nat,
    onGritCredited : ?((Principal, Nat) -> ()),
  ) {
    // CAS step 1: re-read the authoritative record right before mutating. No await may
    // occur between this find and the balance writes below (this function body has none),
    // so find → write → credit is atomic with respect to all other messages.
    switch (state.claims.find(func(r : Types.ClaimRecord) : Bool { r.txHash == txHash })) {
      case null {}; // unknown claim — nothing to update
      case (?authoritative) {
        // CAS step 2: only claims still awaiting resolution may transition.
        let mayTransition = switch (authoritative.status) {
          case (#pending) true;
          case (#pendingFee) true;
          case (#verified) false;
          case (#failed) false;
        };
        if (mayTransition) {
          state.claims.mapInPlace(func(r : Types.ClaimRecord) : Types.ClaimRecord {
            if (r.txHash == txHash) {
              { r with status; gritMinted = gritToCredit }
            } else {
              r
            }
          });
          if (gritToCredit > 0) {
            switch (state.claims.find(func(r : Types.ClaimRecord) : Bool { r.txHash == txHash })) {
              case null {};
              case (?updated) {
                let prev = switch (state.balances.get(updated.claimant)) {
                  case null  { 0 };
                  case (?b)  { b };
                };
                let newBalance = prev + gritToCredit;
                state.balances.add(updated.claimant, newBalance);
                // Also accumulate into the all-time earned tracker (never decremented)
                let prevEarned = switch (state.totalEarned.get(updated.claimant)) {
                  case null  { 0 };
                  case (?e)  { e };
                };
                state.totalEarned.add(updated.claimant, prevEarned + gritToCredit);
                switch (onGritCredited) {
                  case null {};
                  case (?cb) cb(updated.claimant, newBalance);
                };
              };
            };
          };
        };
      };
    };
  };

  /// Transition a claim to #pendingFee, storing the fee tx hash for later retry.
  /// AKK-2 sibling guard: same CAS rule as updateClaimStatus — terminal states
  /// (#verified / #failed) must not be rewritten. Without this, a stale caller that
  /// finished late could flip a verified (already credited) claim back to #pendingFee,
  /// re-opening the double-credit door for a subsequent verify pass.
  public func updateClaimToPendingFee(state : State, txHash : Text, feeTxHash : Text) {
    switch (state.claims.find(func(r : Types.ClaimRecord) : Bool { r.txHash == txHash })) {
      case null {};
      case (?authoritative) {
        let mayTransition = switch (authoritative.status) {
          case (#pending) true;
          case (#pendingFee) true;
          case (#verified) false;
          case (#failed) false;
        };
        if (mayTransition) {
          state.claims.mapInPlace(func(r : Types.ClaimRecord) : Types.ClaimRecord {
            if (r.txHash == txHash) {
              { r with status = #pendingFee; feeTxHash = ?feeTxHash }
            } else {
              r
            }
          });
        };
      };
    };
  };

  public func getBalance(state : State, user : Principal) : Nat {
    switch (state.balances.get(user)) {
      case null  { 0 };
      case (?b)  { b };
    };
  };

  /// All-time cumulative GRIT ever earned by a user from burns.
  /// Never decremented — not affected by GRIT spending on mining.
  public func getTotalEarned(state : State, user : Principal) : Nat {
    switch (state.totalEarned.get(user)) {
      case null  { 0 };
      case (?e)  { e };
    };
  };

  public func getClaimsByUser(state : State, user : Principal) : [Types.ClaimRecord] {
    let filtered = state.claims.filter(func(r : Types.ClaimRecord) : Bool { r.claimant == user });
    // Sort descending by timestamp
    filtered.sort(func(a : Types.ClaimRecord, b : Types.ClaimRecord) : Order.Order {
      Int.compare(b.timestamp, a.timestamp)
    }).toArray();
  };

  public func getAllClaims(state : State) : [Types.ClaimRecord] {
    state.claims.sort(func(a : Types.ClaimRecord, b : Types.ClaimRecord) : Order.Order {
      Int.compare(b.timestamp, a.timestamp)
    }).toArray();
  };

  /// Return (tokenSymbol, totalUsdValue) pairs for all #verified claims by a given principal,
  /// combining same symbols across all chains.
  public func getPlayerBurnSummary(state : State, user : Principal) : [(Text, Float)] {
    let aggregated = Map.empty<Text, Float>();
    for (r in state.claims.values()) {
      if (r.claimant == user and r.status == #verified) {
        let current = switch (aggregated.get(r.tokenSymbol)) {
          case null  0.0;
          case (?v)  v;
        };
        aggregated.add(r.tokenSymbol, current + r.usdValue);
      };
    };
    let results = List.empty<(Text, Float)>();
    for ((sym, total) in aggregated.entries()) {
      results.add((sym, total));
    };
    results.toArray();
  };

  /// Return (tokenSymbol, totalUsdValue) pairs for all #verified claims attributed to a tribe,
  /// scoped to the period each member was in the tribe (using membershipHistory).
  /// Same symbols across chains are combined.
  public func getTribeBurnSummary(
    state       : State,
    tribeId     : TribeTypes.TribeId,
    membership  : List.List<TribeTypes.MembershipEvent>,
  ) : [(Text, Float)] {
    let aggregated = Map.empty<Text, Float>();
    for (r in state.claims.values()) {
      if (r.status == #verified) {
        // Check if this claimant was a member of the tribe at the time of the claim
        let claimDay = timestampToDay(r.timestamp);
        var inTribe = false;
        for (event in membership.values()) {
          if (not inTribe and event.tribeId == tribeId and event.member == r.claimant) {
            let joined = event.joinDay <= claimDay;
            let notYetLeft = switch (event.leaveDay) {
              case null    true;
              case (?ld)   ld > claimDay;
            };
            if (joined and notYetLeft) inTribe := true;
          };
        };
        if (inTribe) {
          let current = switch (aggregated.get(r.tokenSymbol)) {
            case null  0.0;
            case (?v)  v;
          };
          aggregated.add(r.tokenSymbol, current + r.usdValue);
        };
      };
    };
    let results = List.empty<(Text, Float)>();
    for ((sym, total) in aggregated.entries()) {
      results.add((sym, total));
    };
    results.toArray();
  };

  /// Remove #pending burn claims older than 1 hour (3,600,000,000,000 ns).
  /// Calls this at the start of processBlock to prevent unbounded claim accumulation.
  public func cleanupExpiredClaims(state : State, now : Int) {
    // User decision (2026-08-28): NEVER expire or delete claims. Failed and
    // abandoned claims stay in Burn History forever — failed ones are
    // recoverable via Retry Claim (same-burn resurrection), and history is
    // the user's audit trail. This function is kept as a no-op so the
    // call site in main.mo survives; deletion would orphan real burns and
    // make retry paths impossible.
  };

  /// Convert a nanosecond timestamp to "YYYY-MM-DD" UTC dayKey.
  /// Mirrors the algorithm used in scoring.mo and tribe.mo.
  func timestampToDay(ts : Int) : Text {
    let secs = ts / 1_000_000_000;
    let days = secs / 86_400;
    let z = days + 719_468;
    let era = (if (z >= 0) z else z - 146_096) / 146_097;
    let doe = z - era * 146_097;
    let yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = mp + (if (mp < 10) 3 else -9);
    let yr = y + (if (m <= 2) 1 else 0);
    let ys = yr.toText();
    let ms = if (m < 10) "0" # m.toText() else m.toText();
    let ds = if (d < 10) "0" # d.toText() else d.toText();
    ys # "-" # ms # "-" # ds;
  };
};
