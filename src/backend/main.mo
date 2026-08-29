import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Nat64 "mo:core/Nat64";
import Text "mo:core/Text";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Utils "lib/utils";
import Time "mo:core/Time";
import AllowlistLib "lib/allowlist";
import GritLib "lib/grit";
import FeeConfig "lib/fee-config";
import AllowlistMixin "mixins/allowlist-api";
import GritMixin "mixins/grit-api";
import MiningLib "lib/mining";
import MiningMixin "mixins/mining-api";
import Timer "mo:core/Timer";
import ProfileLib "lib/profile";
import ProfileMixin "mixins/profile-api";
import TribeLib "lib/tribe";
import TribeMixin "mixins/tribe-api";
import ScoringLib "lib/scoring";
import ScoringMixin "mixins/scoring-api";
import TestingTypes "types/testing";
import TestingMixin "mixins/testing-api";
import AkkLedgerTypes "types/akk-ledger";

import OQL "mo:caffeineai-oql";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import ListEntity "mo:caffeineai-oql/ListEntity";
import NatValue "mo:caffeineai-oql/NatValue";
import IntValue "mo:caffeineai-oql/IntValue";
import TextValue "mo:caffeineai-oql/TextValue";
import PrincipalValue "mo:caffeineai-oql/PrincipalValue";
import BoolValue "mo:caffeineai-oql/BoolValue";
import Nat64Value "mo:caffeineai-oql/Nat64Value";
import FloatValue "mo:caffeineai-oql/FloatValue";
import RecordValue "mo:caffeineai-oql/RecordValue";
import MiningTypes "types/mining";
import TribeTypes "types/tribe";
import GritTypes "types/grit";
import AllowlistTypes "types/allowlist";
import ScoringTypes "types/scoring";
import ProfileTypes "types/profile";
import AuditActionValue "types/AuditActionValue";
import MinerStatusValue "types/MinerStatusValue";
import ClaimStatusValue "types/ClaimStatusValue";

















 actor self {
  // Stable canister self-principal for subaccount-based AKK custody.
  // Set once on first actor init; survives upgrades via orthogonal persistence.
  var selfPrincipal : ?Principal;

  // Cached ledger actor -- non-stable (actors cannot be stable), re-derived on each actor
  // start and invalidated when setAkkLedgerCanisterId() changes the stored ID.
  var cachedLedgerActor : ?AkkLedgerTypes.IcrcLedger;
  // The Principal that cachedLedgerActor was built from. When it does not match
  // miningState.akkLedgerId, getLedgerActor() invalidates the cache and rebuilds
  // against the new ID. This catches ledger swaps where the ID changes from one
  // non-null value to another (setAkkLedgerCanisterId lives in the mining mixin
  // and has no reference to cachedLedgerActor, so it cannot clear the cache directly).
  var cachedLedgerActorId : ?Principal;

  // Wrapper kept for call-site compatibility; delegates to Utils.
  func principalToSubaccount(p : Principal) : Blob {
    Utils.principalToSubaccount(p);
  };


  // Seed version — increment to re-run seedDefaultTokens() on reset the fee recipient on next deploy.
  // Bump this to 3 so the old IMPT address (0xbafeb8...b4b0) is permanently removed from any
  // canister that previously ran seed version 1 or 2.
  var seedVersion : Nat;

  // Multi-admin state: admins list + fee config
  // feeRecipient is set to null — admin must configure the platform fee recipient wallet address via the admin panel.
  // Once set through the admin panel it is persisted in actor state and survives upgrades automatically.
  let adminState : AllowlistLib.AdminState;

  // Bootstrap admin — the `akk-deployer` CLI identity (origin-independent: its principal is
  // fixed forever, unlike II principals which are derived from the site domain, so it survives
  // any future domain move). Kept as a flexible stable (never assigned) purely for
  // upgrade compatibility with v249, which declared it.
  let bootstrapAdminPrincipal : ?Principal;
  ignore bootstrapAdminPrincipal;

  // Seed the `akk-deployer` identity as sole admin on any fresh start with an empty
  // admin list, and mark bootstrapPrincipalSet so the open bootstrapAdmin()/
  // resetAndClaimAdmin() endpoints stay permanently disabled.
  // SECURITY: never remove this seeding — doing so re-opens anonymous admin takeover
  // on the next fresh deploy. Plain statements (no actor-scope bindings) because
  // --enhanced-migration treats every initialized actor-scope declaration as stable (M0250).
  if (adminState.admins.size() == 0) {
    AllowlistLib.addAdmin(
      adminState,
      Principal.fromText("wtghr-y4d6x-mncok-76fms-habs7-tmk5s-cn2xl-vfd26-hcz4q-tv7p3-hae"),
    );
  };
  adminState.bootstrapPrincipalSet := true;

  // Gate state is separate so its fields do not affect stable-variable compatibility
  // of adminState when added after initial deployment.
  let gateState : AllowlistLib.GateState;

  // Allowlist state: tokens + audit log
  let allowlistState : AllowlistLib.State;

  // Seed helper — seeded once (seedVersion < 1) to populate the token allowlist on first deploy.
  // Increment seedVersion in stable vars above to re-run (e.g. to add new tokens on a redeployment).
  func seedDefaultTokens() {
    AllowlistLib.addToken(
      allowlistState,
      {
        tokenAddress = "0x00fbac94fec8d4089d3fe979f39454f48c71a65d";
        chain        = "base";
        name         = "Klima Protocol";
        symbol       = "kVCM";
        decimals     = 18;
        priceUSD     = 0.0;
      },
      Principal.anonymous(),
    );
    AllowlistLib.addToken(
      allowlistState,
      {
        tokenAddress = "0x2e6c05f1f7d1f4eb9a088bf12257f1647682b754";
        chain        = "base";
        name         = "Regen Network";
        symbol       = "axlREGEN";
        decimals     = 6;
        priceUSD     = 0.0;
      },
      Principal.anonymous(),
    );
    AllowlistLib.addToken(
      allowlistState,
      {
        tokenAddress = "0xd75dfa972c6136f1c594fec1945302f885e1ab29";
        chain        = "base";
        name         = "Treegens";
        symbol       = "TGN";
        decimals     = 18;
        priceUSD     = 0.0;
      },
      Principal.anonymous(),
    );
    // axlREGEN on Celo Mainnet
    AllowlistLib.addToken(
      allowlistState,
      {
        tokenAddress = "0x2e6c05f1f7d1f4eb9a088bf12257f1647682b754";
        chain        = "celo";
        name         = "Regen Network";
        symbol       = "axlREGEN";
        decimals     = 6;
        priceUSD     = 0.0;
      },
      Principal.anonymous(),
    );
    // GIV on Optimism Mainnet
    AllowlistLib.addToken(
      allowlistState,
      {
        tokenAddress = "0x528cdc92eab044e1e39fe43b9514bfdab4412b98";
        chain        = "optimism";
        name         = "Giveth";
        symbol       = "GIV";
        decimals     = 18;
        priceUSD     = 0.0;
      },
      Principal.anonymous(),
    );
    // IMPT on Ethereum Mainnet
    AllowlistLib.addToken(
      allowlistState,
      {
        tokenAddress = "0x04C17b9D3b29A78F7Bd062a57CF44FC633e71f85";
        chain        = "ethereum";
        name         = "Impact";
        symbol       = "IMPT";
        decimals     = 18;
        priceUSD     = 0.0;
      },
      Principal.anonymous(),
    );
    seedVersion := 3;
  };

  // Seed default tokens. Gated by seedVersion.
  // Version 1: initial seed.
  // Version 2: re-seed IMPT with corrected address and ensure fee recipient is correct.
  //            addToken() is an upsert so re-running is safe — it updates the existing entry.
  // Version 3: permanently delete the old IMPT address (0xbafeb8...b4b0) from the allowlist.
  //            The old address differs from the correct one so the v2 upsert left it in state.
  if (seedVersion < 3) {
    seedDefaultTokens();
    // Always ensure the fee recipient is set to the canonical value.
    // This handles upgrades where a prior deploy persisted a wrong or null value.
    adminState.feeRecipient := ?"0x66Cc129C0f758B52d561F0bD2AC8ECf37f19C052";
    // Remove the old IMPT address (0xbafeb8c8a4fbd37...b4b0) if it was seeded by a prior version.
    // AllowlistLib.removeToken normalises the address to lowercase before comparison.
    AllowlistLib.removeToken(
      allowlistState,
      "0xbafeb8c8a4fbd37a4ec73c73f4ccf66afedbe1b1",
      "ethereum",
      Principal.anonymous(),
    );
    seedVersion := 3;
  };

  // GRIT state: balances map + all-time earned tracker + claim records
  let gritState : GritLib.State;

  // Price cache: token address (lowercase) → last known USD price
  let priceCache : Map.Map<Text, Float>;

  // HTTP outcall transform for burn verification (required by the IC for deterministic responses)
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Mining state
  let miningState : MiningLib.State;

  // Mutable timer ID for the block timer — allows it to be cancelled and restarted
  // when mining resumes after a pause (so the 690s window starts from the first active spend).
  let blockTimerState : { var timerId : ?Timer.TimerId };

  // Profile state: principal → profile record
  let profileState : ProfileLib.State;

  // Tribe state: all tribe data, membership, and contribution snapshots
  let tribeState : TribeLib.State;

  // Scoring state: daily player/network snapshots for AK69 leaderboard
  let scoringState : ScoringLib.State;
  // Testing state: admin test score overrides (keyed by Principal)
  let testingState : TestingTypes.State;

  // Fee-verification config (AKK-4 Option B): FeeCollector contract address +
  // FeePaid-event check toggle. Declared AFTER testingState so it sits at the
  // END of the stable layout — appended stable fields preserve the byte layout
  // of every earlier field, which is what the enhanced-migration chain relies on.
  let feeState : FeeConfig.FeeState;

  include AllowlistMixin(allowlistState, adminState, gateState, feeState);
  include GritMixin(gritState, allowlistState, adminState, gateState, priceCache, tribeState, feeState);
  include MiningMixin(miningState, gritState, adminState, allowlistState, gateState, func() : ?Principal { selfPrincipal });
  include ProfileMixin(profileState, scoringState, gritState, miningState, tribeState);
  include TribeMixin(tribeState, profileState, gritState, miningState);

  include ScoringMixin(scoringState, profileState, tribeState, testingState);
  include TestingMixin(testingState, adminState, profileState);

  // Rebuild AK69 daily raws from mining block history whenever snapshots are
  // empty (fresh deploy or first start after the scoring overhaul). Synchronous:
  // block records are local state, no awaits required.
  if (scoringState.networkSnapshots.size() == 0) {
    ScoringLib.rebuildAllFromBlockHistory(scoringState, tribeState, miningState);
  };

  // UTC-midnight-aligned daily rollover: refreshes mining streaks for the day
  // that just ended. Self-rescheduling one-shot timer stays aligned to true UTC
  // midnight across upgrades and drift.
  func scheduleUtcRollover<system>() {
    ignore Timer.setTimer<system>(
      #seconds (ScoringLib.secondsUntilNextUtcMidnight()),
      func() : async () {
        ScoringLib.onUtcRollover(scoringState, profileState);
        scheduleUtcRollover();
      },
    );
  };
  scheduleUtcRollover();


  /// Get or create the cached ledger actor from the stored canister ID.
  func getLedgerActor() : ?AkkLedgerTypes.IcrcLedger {
    // If the ledger ID was cleared (e.g. via resetAkkLedgerCanisterId), invalidate the cache.
    switch (miningState.akkLedgerId) {
      case null {
        cachedLedgerActor := null;
        cachedLedgerActorId := null;
        return null;
      };
      case (?id) {
        // Invalidate the cache if the stored ID changed since the actor was cached.
        // This is the fix for the stale-cache bug: setAkkLedgerCanisterId (in the
        // mining mixin) updates miningState.akkLedgerId but cannot clear
        // cachedLedgerActor directly. By comparing cachedLedgerActorId to the
        // current akkLedgerId here, we detect the swap on the next call and
        // rebuild a fresh actor against the NEW ledger.
        let stale = switch (cachedLedgerActorId) {
          case null true;
          case (?cachedId) { not Principal.equal(cachedId, id) };
        };
        if (stale) {
          cachedLedgerActor := null;
          cachedLedgerActorId := ?id;
        };
        switch (cachedLedgerActor) {
          case (?a) ?a;
          case null {
            let a : AkkLedgerTypes.IcrcLedger = actor (id.toText());
            cachedLedgerActor := ?a;
            ?a;
          };
        };
      };
    };
  };
  /// Mint AKK to a winner: when the ledger is configured, call icrc1_transfer to mint;
  /// otherwise fall back to updating the internal akkBalances map.
  /// blockId is passed explicitly (captured before any await in processBlock) to ensure
  /// the dedup key is stable even if state.blockNumber advances concurrently.
  /// Mint AKK to a winner by calling icrc1_transfer from the minting account.
  /// When the external ledger is configured, mints directly to the winner's
  /// principal account on the ICRC-1 ledger; falls back to the internal balance
  /// map only when no ledger is set (draft / test mode).
  /// Before minting, enforces the 21M AKK hard cap via icrc1_total_supply.
  func mintAkkToWinner(owner : Principal, amount : Nat, blockId : Nat) : async () {
    // Deduplication: skip if this block was already minted
    if (miningState.mintedBlockIds.contains(blockId)) { return };
    // Also skip if already in retry queue
    let alreadyQueued = miningState.pendingMints.find(
      func(e : MiningLib.MintRetryEntry) : Bool { e.blockId == blockId }
    );
    switch (alreadyQueued) { case (?_) { return }; case null {} };

    switch (miningState.akkLedgerId) {
      case null {
        // Draft mode: update internal map
        let prev = switch (miningState.akkBalances.get(owner)) {
          case null 0;
          case (?b) b;
        };
        let newBal = prev + amount;
        miningState.akkBalances.add(owner, newBal);
        let grit = GritLib.getBalance(gritState, owner);
        TribeLib.updateTribeStats(tribeState, owner, grit, newBal);
      };
      case (?_ledgerId) {
        let ledger : AkkLedgerTypes.IcrcLedger = switch (getLedgerActor()) {
          case (?a) a;
          case null {
            let entry : MiningLib.MintRetryEntry = {
              blockId; minerId = blockId.toText(); owner; amount;
              var attempts = 1;
              var lastAttemptTime = Time.now();
              var error = "Ledger actor unavailable";
            };
            MiningLib.enqueueMint(miningState, entry);
            return;
          };
        };
        // Enforce 21M AKK hard cap before minting
        let AKK_HARD_CAP : Nat = 2_100_000_000_000_000; // 21M * 1e8
        var mintAmount = amount;
        try {
          let currentSupply = await ledger.icrc1_total_supply();
          if (currentSupply >= AKK_HARD_CAP) {
            // Cap reached — record block but mint 0
            miningState.mintedBlockIds.add(blockId);
            return;
          };
          let remaining = AKK_HARD_CAP - currentSupply;
          if (mintAmount > remaining) { mintAmount := remaining };
        } catch (_) {}; // if supply query fails, proceed with original amount

        try {
          // Mint: call icrc1_transfer from the minting account (from_subaccount = null)
          // directly to the winner's principal account on the ledger.
          let result = await ledger.icrc1_transfer({
            from_subaccount = null;
            to = { owner; subaccount = null };
            amount = mintAmount;
            fee = null;
            memo = ?Utils.blockIdMemo(blockId);
            created_at_time = ?Nat64.fromNat(Int.abs(Time.now()));
          });
          switch (result) {
            case (#Ok _) {
              miningState.mintedBlockIds.add(blockId);
            };
            case (#Err(#Duplicate _)) {
              miningState.mintedBlockIds.add(blockId);
            };
            case (#Err e) {
              let entry : MiningLib.MintRetryEntry = {
                blockId; minerId = blockId.toText(); owner; amount = mintAmount;
                var attempts = 1;
                var lastAttemptTime = Time.now();
                var error = "Ledger Err: " # debug_show(e);
              };
              MiningLib.enqueueMint(miningState, entry);
            };
          };
        } catch (e) {
          let entry : MiningLib.MintRetryEntry = {
            blockId; minerId = blockId.toText(); owner; amount = mintAmount;
            var attempts = 1;
            var lastAttemptTime = Time.now();
            var error = "System error: " # e.message();
          };
          MiningLib.enqueueMint(miningState, entry);
        };
        // Update tribe stats with all-time accumulated value
        let allTimeAkk = switch (miningState.totalAkkWonByUser.get(owner)) {
          case null 0; case (?n) n; };
        let grit = GritLib.getBalance(gritState, owner);
        TribeLib.updateTribeStats(tribeState, owner, grit, allTimeAkk);
      };
    };
  };

  /// Captures the canister's own principal into selfPrincipal using the low-level prim.
  func doCaptureSelf() {
    if (selfPrincipal == null) {
      selfPrincipal := ?Principal.fromActor(self);
    };
    // Re-derive cached ledger actor on every startup (actors cannot be stable)
    cachedLedgerActor := null; // lazily re-created on first getLedgerActor() call
    cachedLedgerActorId := null;
  };

  // Capture on first actor init.
  doCaptureSelf();



  /// Helper: attempt a single ledger mint and return true on success.
  /// Used by drainPendingMints to retry queued entries.
  func tryLedgerMint(owner : Principal, amount : Nat, blockId : Nat) : async Bool {
    switch (getLedgerActor()) {
      case null false;
      case (?ledger) {
        try {
          // Mint directly to winner's principal account (same pattern as mintAkkToWinner)
          let result = await ledger.icrc1_transfer({
            from_subaccount = null;
            to = { owner; subaccount = null };
            amount;
            fee = null;
            memo = ?Utils.blockIdMemo(blockId);
            created_at_time = ?Nat64.fromNat(Int.abs(Time.now()));
          });
          switch (result) {
            case (#Ok _) true;
            case (#Err(#Duplicate _)) true;
            case (#Err _) false;
          };
        } catch (_e) { false };
      };
    };
  };

  // Block processing callback — shared between the startup probe and the recurring timer.
  // processBlock returns Bool: true means mining just resumed after a pause (timer reset).
  // In that case we cancel the old recurring timer and start a fresh 690s one from now
  // so the block window is properly aligned to when mining actually resumed.
  func runBlockCycle() : async () {
    // Attempt to drain any pending retry-mint queue before the new block processes
    ignore await MiningLib.drainPendingMints(miningState, tryLedgerMint);
    // Clean up expired pending burn claims before processing the new block
    GritLib.cleanupExpiredClaims(gritState, Time.now());
    let timerReset = await MiningLib.processBlock(
      miningState,
      ?mintAkkToWinner,
      null, // onAkkCredited is handled inside mintAkkToWinner
      ?(func(block : MiningTypes.BlockRecord) {
        // Attribute this block's raws to the AK69 scoring engine immediately
        ScoringLib.applyBlock(scoringState, tribeState, block);
      }),
    );
    if (timerReset) {
      // Mining just resumed after a pause — cancel the old recurring timer (if any)
      // and start a fresh one aligned to this moment so the 690s window starts from now.
      switch (blockTimerState.timerId) {
        case null {};
        case (?tid) { Timer.cancelTimer(tid) };
      };
      blockTimerState.timerId := ?Timer.recurringTimer<system>(
        #seconds 690,
        func() : async () { await runBlockCycle() },
      );
    };
  };

  // Install or reinstall the 690s recurring block timer, cancelling any existing one first.
  // Called from the startup probe to ensure the timer is always running after a deploy/upgrade.
  func installRecurringBlockTimer<system>() {
    switch (blockTimerState.timerId) {
      case null {};
      case (?tid) { Timer.cancelTimer(tid) };
    };
    blockTimerState.timerId := ?Timer.recurringTimer<system>(
      #seconds 690,
      func() : async () { await runBlockCycle() },
    );
  };

  // Block timer — on every startup/upgrade:
  //   1. Cancel the previously stored recurring timer (if any) to prevent ghost timer
  //      accumulation across upgrades.
  //   2. Fire a one-shot probe immediately that:
  //      a. Runs runBlockCycle() to process any pending block (mines if miners are active,
  //         resets the timer alignment if mining just resumed from a pause).
  //      b. UNCONDITIONALLY installs a fresh 690s recurring timer.
  //         This is the critical fix: previously the recurring timer was only installed
  //         when runBlockCycle() did NOT install one (i.e. when timerReset=false).
  //         But if a miner was created while the canister was idle, or if the canister
  //         was upgraded and the timer ID was stale, the timer would never restart.
  //         Installing unconditionally costs nothing when no miners are active
  //         (processBlock() returns immediately for empty blocks) and guarantees
  //         the timer is always running regardless of mining state at startup.
  switch (blockTimerState.timerId) {
    case null {};
    case (?tid) {
      Timer.cancelTimer(tid);
      blockTimerState.timerId := null;
    };
  };
  ignore Timer.setTimer<system>(
    #seconds 0,
    func() : async () {
      await runBlockCycle();
      // UNCONDITIONALLY install the recurring 690s block timer.
      // runBlockCycle() may have already installed one (timerReset path), but we
      // cancel and reinstall here to guarantee a clean, correctly-aligned timer
      // regardless of what state the canister was in before this startup probe.
      installRecurringBlockTimer();
    },
  );

  // Pending-claim re-check timer — fires every 15 seconds
  // Re-checks all #pending burn claims until confirmed or timed out (30 min)
  ignore Timer.recurringTimer<system>(
    #seconds 15,
    func() : async () { await recheckPendingClaims() },
  );

  // ─── OQL (Data Intelligence) ────────────────────────────────────────────────
  // Exposes the canister's persisted collections as queryable entities so the
  // Caffeine Data Intelligence agent can answer natural-language questions over
  // them. Each entity declares its own authorization level; per-user data uses
  // `.controllerOrScoped()` with an owner column so the agent (controller) sees
  // aggregates while each signed-in user only reads their own rows.
  include Expose({
    entities = [
      // miners — owner-keyed via the `owner` field; manual mode because
      // MinerRecord has `var` fields and a MinerStatus variant. The entity
      // iterates the immutable MinerView mirror (var-free) so the OQL builder's
      // `.payload` resolves against a shared row type.
      OQL.Entity.manual<MiningTypes.MinerView>(
        "miner",
        func() = miningState.miners.values().map(func(m : MiningTypes.MinerRecord) : MiningTypes.MinerView {
          {
            id = m.id;
            owner = m.owner;
            name = m.name;
            gritBalance = m.gritBalance;
            miningRate = m.miningRate;
            status = m.status;
            createdAt = m.createdAt;
            lastProcessedBlock = m.lastProcessedBlock;
            blocksMined = m.blocksMined;
            gritSpent = m.gritSpent;
          };
        }),
        "MinerView",
        "id",
      )
        .payload("id", func(m) = m.id)
        .payload("owner", func(m) = m.owner)
        .payload("name", func(m) = m.name)
        .payload("gritBalance", func(m) = m.gritBalance)
        .payload("miningRate", func(m) = m.miningRate)
        .payload("status", func(m) = m.status, )
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),

      // blocks — admin/aggregate analytics; manual mode because BlockRecord
      // has tuple-array fields and optional fields.
      OQL.Entity.manual<MiningTypes.BlockRecord>(
        "block",
        func() = miningState.blockHistory.values(),
        "BlockRecord",
        "blockNumber",
      )
        .payload("blockNumber", func(b) = b.blockNumber)
        .payload("timestamp", func(b) = b.timestamp)
        .payload("akkReward", func(b) = b.akkReward)
        .payload("totalGritSpent", func(b) = b.totalGritSpent)
        .payload("vrfValue", func(b) = b.vrfValue)
        .payload("winnerMinerId", func(b) = switch (b.winnerMinerId) { case null 0; case (?n) n })
        .payload("winnerOwner", func(b) = switch (b.winnerOwner) { case null ""; case (?p) p.toText() })
        .controllerOnly()
        .build(),

      // gritBalance — owner-keyed Map<Principal, Nat>; manual mode iterates
      // all entries, .ownedBy("owner") + .controllerOrScoped() enforce
      // per-user scoping.
      OQL.Entity.manual<(Principal, Nat)>(
        "gritBalance",
        func() = gritState.balances.entries(),
        "GritBalance",
        "owner",
      )
        .payload("owner", func((p, _)) = p)
        .payload("balance", func((_, n)) = n)
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),

      // gritTotalEarned — all-time GRIT credited per user (never decremented).
      OQL.Entity.manual<(Principal, Nat)>(
        "gritTotalEarned",
        func() = gritState.totalEarned.entries(),
        "GritTotalEarned",
        "owner",
      )
        .payload("owner", func((p, _)) = p)
        .payload("totalEarned", func((_, n)) = n)
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),

      // akkBalance — internal draft-mode AKK balance per user.
      OQL.Entity.manual<(Principal, Nat)>(
        "akkBalance",
        func() = miningState.akkBalances.entries(),
        "AkkBalance",
        "owner",
      )
        .payload("owner", func((p, _)) = p)
        .payload("balance", func((_, n)) = n)
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),

      // akkWon — cumulative all-time AKK earned per user from block rewards.
      OQL.Entity.manual<(Principal, Nat)>(
        "akkWon",
        func() = miningState.totalAkkWonByUser.entries(),
        "AkkWon",
        "owner",
      )
        .payload("owner", func((p, _)) = p)
        .payload("totalWon", func((_, n)) = n)
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),

      // gritSpentByUser — cumulative GRIT spent per user on mining.
      OQL.Entity.manual<(Principal, Nat)>(
        "gritSpent",
        func() = miningState.gritSpentByUser.entries(),
        "GritSpent",
        "owner",
      )
        .payload("owner", func((p, _)) = p)
        .payload("spent", func((_, n)) = n)
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),

      // profile — owner-keyed Map<Principal, Profile>; manual mode because
      // Profile has a `socials : [SocialLink]` array field and `evmAddress : ?Text`.
      OQL.Entity.manual<(Principal, ProfileTypes.Profile)>(
        "profile",
        func() = profileState.profiles.entries(),
        "Profile",
        "owner",
      )
        .payload("owner", func((p, _)) = p)
        .payload("username", func((_, pr)) = pr.username)
        .payload("displayName", func((_, pr)) = pr.displayName)
        .payload("bio", func((_, pr)) = pr.bio)
        .payload("location", func((_, pr)) = pr.location)
        .payload("born", func((_, pr)) = pr.born)
        .payload("superpowers", func((_, pr)) = pr.superpowers)
        .payload("profilePicture", func((_, pr)) = pr.profilePicture)
        .payload("coverImage", func((_, pr)) = pr.coverImage)
        .payload("evmAddress", func((_, pr)) = switch (pr.evmAddress) { case null ""; case (?t) t })
        .payload("hasOgBadge", func((_, pr)) = pr.hasOgBadge)
        .payload("playerBadgeLevel", func((_, pr)) = pr.playerBadgeLevel)
        .payload("miningStreak", func((_, pr)) = pr.miningStreak)
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),

      // tribe — public catalogue of tribes; manual mode because TribeRecord
      // has `var` fields and `?Text` fields.
      OQL.Entity.manual<TribeTypes.TribeRecord>(
        "tribe",
        func() = tribeState.tribes.values(),
        "TribeRecord",
        "id",
      )
        .payload("id", func(t) = t.id)
        .payload("name", func(t) = t.name)
        .payload("description", func(t) = t.description)
        .payload("photoUrl", func(t) = switch (t.photoUrl) { case null ""; case (?u) u })
        .payload("coverImageUrl", func(t) = switch (t.coverImageUrl) { case null ""; case (?u) u })
        .payload("ownerId", func(t) = t.ownerId)
        .payload("createdAt", func(t) = t.createdAt)
        .payload("memberCount", func(t) = t.memberCount)
        .payload("cumulativeGrit", func(t) = t.cumulativeGrit)
        .payload("cumulativeAkk", func(t) = t.cumulativeAkk)
        .public_()
        .build(),

      // allowlistedToken — public catalogue; auto-derive (all-primitive record).
      allowlistState.tokens.toEntity(
        "allowlistedToken",
        "AllowlistedToken",
        "tokenAddress",
      )
        .sample({
          tokenAddress = "";
          chain = "";
          name = "";
          symbol = "";
          decimals = 0;
          priceUSD = 0.0;
        })
        .public_()
        .build(),

      // auditLog — admin-only; auto-derive with AuditActionValue helper.
      allowlistState.auditLog.toEntity(
        "auditLog",
        "AuditLogEntry",
        "timestamp",
      )
        .sample({
          action = #add;
          tokenAddress = "";
          chain = "";
          adminPrincipal = Principal.fromText("aaaaa-aa");
          timestamp = 0;
        })
        .controllerOnly()
        .build(),

      // networkSnapshot — per-day network raws (GRIT spent / AKK won) attributed
      // from block history; admin/aggregate analytics; auto-derive (all-primitive).
      scoringState.networkSnapshots.toEntity(
        "networkSnapshot",
        "DailyNetworkSnapshot",
        "dayKey",
      )
        .sample({
          dayKey = "";
          totalGritSpent = 0;
          totalAkkWon = 0;
        })
        .controllerOnly()
        .build(),

      // playerSnapshot — per-user daily raw contributions; auto-derive with
      // `principal` as the owner column. `.controllerOrScoped()` lets the
      // agent answer aggregate questions while each user reads only their own.
      scoringState.playerSnapshots.toEntity(
        "playerSnapshot",
        "DailyPlayerSnapshot",
        "dayKey",
      )
        .sample({
          dayKey = "";
          principal = Principal.fromText("aaaaa-aa");
          gritSpent = 0;
          akkWon = 0;
        })
        .ownedBy("principal")
        .controllerOrScoped()
        .build(),

      // tribeSnapshot — per-tribe daily raw contributions (timestamp-prorated
      // membership at block time); admin/aggregate analytics.
      scoringState.tribeSnapshots.toEntity(
        "tribeSnapshot",
        "DailyTribeSnapshot",
        "dayKey",
      )
        .sample({
          dayKey = "";
          tribeId = "";
          gritSpent = 0;
          akkWon = 0;
        })
        .controllerOnly()
        .build(),

      // claim — burn/claim records; manual mode because ClaimRecord has a
      // ClaimStatus variant and `?Text` fields. Owner-keyed by `claimant`.
      OQL.Entity.manual<GritTypes.ClaimRecord>(
        "claim",
        func() = gritState.claims.values(),
        "ClaimRecord",
        "txHash",
      )
        .payload("txHash", func(c) = c.txHash)
        .payload("feeTxHash", func(c) = switch (c.feeTxHash) { case null ""; case (?t) t })
        .payload("tokenAddress", func(c) = c.tokenAddress)
        .payload("chain", func(c) = c.chain)
        .payload("tokenSymbol", func(c) = c.tokenSymbol)
        .payload("tokenDecimals", func(c) = c.tokenDecimals)
        .payload("amountBurned", func(c) = c.amountBurned)
        .payload("usdValue", func(c) = c.usdValue)
        .payload("gritMinted", func(c) = c.gritMinted)
        .payload("status", func(c) = c.status, )
        .payload("timestamp", func(c) = c.timestamp)
        .payload("claimant", func(c) = c.claimant)
        .ownedBy("claimant")
        .controllerOrScoped()
        .build(),
    ];
  });
};
