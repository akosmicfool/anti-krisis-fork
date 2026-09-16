import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Text "mo:core/Text";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Debug "mo:core/Debug";
import Error "mo:core/Error";
import Utils "lib/utils";
import Time "mo:core/Time";
import AllowlistLib "lib/allowlist";
import GritLib "lib/grit";
import FeeConfig "lib/fee-config";
import CycleGuard "lib/cycle-guard";
import LedgerMint "lib/ledger-mint";
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
    // W1B review fix (2026-09-09): this used to seed the pre-Option-B owner
    // EOA (0x66Cc…), which is NOT a contract — a fresh install then armed
    // fee verification against an address that cannot receive calldata, and
    // every fee tx failed with "External transactions to internal accounts
    // cannot include data" (reproduced on draft v324, Base + all chains).
    // The fee must go to the FeeCollector CONTRACT (deployed via CREATE2 at
    // the same address on all four chains — see contracts/DEPLOYMENT.md);
    // the owner EOA is what the collector's owner() returns, not where fees
    // are paid. seeding recipient = collector keeps the atomic-config
    // invariant (recipient == collector) true from the very first start.
    adminState.feeRecipient := ?"0x6cBB624D23eeeFd23c7F02912F7F35129174aCD2";
    // NOTE: collectorAddress + FeePaid arm are seeded in the feeState block
    // below (feeState is declared later in the stable layout — definedness
    // rules forbid touching it here). See the `feeState` seed block.
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

  // 2026-09-11 owner config seeds (run on every boot, idempotent — plain
  // assignments over the live values, NOT seedVersion-gated, so a draft
  // reset OR an upgrade lands on these defaults; the admin panel can still
  // override at runtime afterwards):
  //   - GRIT issuance: 1,000,000,000,000 (1T) GRIT per $1.00 burned
  //   - Miner-creation fees: ETH/Base/OP = 0.0000069 native (6.9e12 wei),
  //     Celo = 0.069 CELO (6.9e16 wei). Per-chain by owner decision (fees
  //     differ per chain token/rate); setting a fee ARMS the miner-creation
  //     gate on that chain (fee 0/unset = free). Seeded directly into
  //     miningState (same path the admin entrypoint uses).
  adminState.gritIssuanceRate := 1_000_000_000_000;
  // Miner-creation fee seeds live BELOW (after miningState's declaration —
  // definedness rules forbid touching a stable field before it exists).

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

  // Miner-creation fee seeds (2026-09-11 owner config, idempotent on every
  // boot — see the comment block above near the gritIssuanceRate seed):
  // ETH/Base/OP = 0.0000069 native (6.9e12 wei), Celo = 0.069 CELO
  // (6.9e16 wei). Setting a fee ARMS the per-chain creation gate.
  MiningLib.setMinerCreationFee(miningState, "ethereum", 6_900_000_000_000);
  MiningLib.setMinerCreationFee(miningState, "base", 6_900_000_000_000);
  MiningLib.setMinerCreationFee(miningState, "optimism", 6_900_000_000_000);
  MiningLib.setMinerCreationFee(miningState, "celo", 69_000_000_000_000_000);

  // Mutable timer ID for the block timer — allows it to be cancelled and restarted
  // when mining resumes after a pause (so the 690s window starts from the first active spend).
  let blockTimerState : { var timerId : ?Timer.TimerId };

  // AKK-5: reentrancy guard for the block cycle (see lib/cycle-guard.mo).
  // `transient` = excluded from the stable layout: never persisted, resets to
  // "no cycle in flight" on every upgrade, so an upgrade landing mid-cycle can
  // never latch mining off.
  transient var blockCycleGuard = CycleGuard.newGuard();

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

  // W1B review fix (2026-09-09): seed the collector + arm here (feeState is
  // only reachable after its declaration). The FeeCollector contract is a
  // deployment FACT — CREATE2-deployed at 0x6cBB…aCD2 on all four chains
  // (verified live; see contracts/DEPLOYMENT.md) — so a fresh install starts
  // in the fully-armed secure configuration instead of relying on an admin
  // ritual after every reset. recipient was seeded to the same address in
  // the seedVersion block above; seeding both keeps the atomic-config
  // invariant (recipient == collector) true from the very first start.
  // (Under --enhanced-migration these assignments run on every boot; the
  // values are constants, so this is idempotent and safe on upgrades.)
  feeState.collectorAddress := "0x6cbb624d23eeefd23c7f02912f7f35129174acd2";
  feeState.requireFeePaidEvent := true;

  include AllowlistMixin(allowlistState, adminState, gateState, feeState);
  include GritMixin(gritState, allowlistState, adminState, gateState, priceCache, tribeState, feeState);
  include MiningMixin(miningState, gritState, adminState, allowlistState, gateState, feeState, func() : ?Principal { selfPrincipal }, verifyFeeTxWithReceipt, transformResponse);
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
        // F2 review fix: freeze the mint timestamp HERE — this value is what
        // the first attempt sends, and every later retry of this block reuses
        // it verbatim (stored on the queue entry). Deriving per attempt let
        // the clamp grid hand a retry a different hash than the original
        // (measured 4.36% of blocks), which is exactly the case the ledger's
        // dedup exists to catch — a committed-but-unreported transfer would
        // otherwise be re-minted on retry.
        let mintTs : Nat64 = LedgerMint.mintCreatedAtTime(blockId, Time.now());
        let ledger : AkkLedgerTypes.IcrcLedger = switch (getLedgerActor()) {
          case (?a) a;
          case null {
            let entry : MiningLib.MintRetryEntry = {
              blockId; minerId = blockId.toText(); owner; amount;
              var createdAtTime = mintTs;
              var attempts = 1;
              var lastAttemptTime = Time.now();
              var error = "Ledger actor unavailable";
            };
            MiningLib.enqueueMint(miningState, entry);
            return;
          };
        };
        // Enforce 21M AKK hard cap before minting (AKK-6: shared cap helper).
        // Supply-query failure now DEFERS to the retry queue instead of
        // minting blind (the old `catch (_) {}` proceeded uncapped).
        var mintAmount = amount;
        var supplyUnknown = false;
        try {
          let currentSupply = await ledger.icrc1_total_supply();
          mintAmount := LedgerMint.capDecision(currentSupply, LedgerMint.AKK_HARD_CAP, amount);
        } catch (_) {
          supplyUnknown := true;
        };
        if (supplyUnknown) {
          let entry : MiningLib.MintRetryEntry = {
            blockId; minerId = blockId.toText(); owner; amount;
            var createdAtTime = mintTs;
            var attempts = 0;
            var lastAttemptTime = Time.now();
            var error = "Supply query failed — deferred to retry queue (AKK-6)";
          };
          MiningLib.enqueueMint(miningState, entry);
          return;
        };
        if (mintAmount == 0) {
          // Cap reached — record block but mint 0
          miningState.mintedBlockIds.add(blockId);
          return;
        };

        try {
          // Mint: call icrc1_transfer from the minting account (from_subaccount = null)
          // directly to the winner's principal account on the ledger.
          // AKK-7 + F2: created_at_time is the value frozen at the top of this
          // branch — every retry reuses the same stored value, so all attempts
          // of this block hash identically and the ledger's dedup engages.
          let result = await ledger.icrc1_transfer({
            from_subaccount = null;
            to = { owner; subaccount = null };
            amount = mintAmount;
            fee = null;
            memo = ?Utils.blockIdMemo(blockId);
            created_at_time = ?mintTs;
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
                var createdAtTime = mintTs;
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
            var createdAtTime = mintTs;
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
  /// F2: createdAtTime is the FROZEN value from the queue entry — never
  /// recomputed here, and the amount is sent verbatim too, so the retry's
  /// timestamp and amount are identical to the original attempt. (The request as
  /// a whole is timestamp+amount identical; the staleness net can still re-freeze
  /// a timestamp that has aged out — see lib/ledger-mint.mo.)
  func tryLedgerMint(owner : Principal, amount : Nat, blockId : Nat, createdAtTime : Nat64) : async Bool {
    switch (getLedgerActor()) {
      case null false;
      case (?ledger) {
        // AKK-6: retry path respects the same cap as the primary path.
        // Supply-query failure → false (entry stays queued for the next
        // drain) instead of minting blind.
        // W4/A-F1: a retry sends the entry's FROZEN amount VERBATIM — never a
        // re-clamped one. The amount is part of the ICRC-1 request hash, so a
        // re-clamped retry of a transfer that actually committed but was never
        // reported would hash differently, miss the ledger's dedup, and mint a
        // second time (permanent loss); two clamped sends could also pass the
        // 21M cap. Cap handling instead:
        //   remaining == 0        -> settle (nothing will ever be mintable)
        //   0 < remaining < frozen-> stay queued; never send a divergent request
        let remaining = try {
          let currentSupply = await ledger.icrc1_total_supply();
          LedgerMint.capDecision(currentSupply, LedgerMint.AKK_HARD_CAP, amount);
        } catch (_) { return false };
        if (remaining == 0) {
          // Cap reached — nothing mintable; report success so the entry
          // leaves the queue (its blockId joins mintedBlockIds upstream).
          return true;
        };
        if (remaining != amount) {
          // Frozen amount no longer fits: keep the entry queued rather than send
          // a different (hash-divergent) request. It will age into abandonedMints
          // where an admin can see it — the safe failure mode near the cap.
          return false;
        };
        let mintAmount = amount;
        try {
          // Mint directly to winner's principal account (same pattern as mintAkkToWinner).
          // AKK-7 + F2: created_at_time is the entry's FROZEN value — the same
          // one the original attempt sent, so the ledger's dedup rejects a
          // genuine double mint instead of treating the retry as a new transfer.
          let result = await ledger.icrc1_transfer({
            from_subaccount = null;
            to = { owner; subaccount = null };
            amount = mintAmount;
            fee = null;
            memo = ?Utils.blockIdMemo(blockId);
            created_at_time = ?createdAtTime;
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
  //
  // AKK-5: recurring timers do NOT serialize async callbacks. With a pendingMints
  // backlog a cycle can outlast the 690s interval and overlap the next fire,
  // double-draining GRIT and voiding the second winner's reward. The guard makes
  // overlapping fires no-ops: the skipped fire does nothing and the next aligned
  // one picks up the work. The guard is released even when a child await rejects
  // (try/catch), so one bad outcall can never latch mining off.
  func runBlockCycle() : async () {
    // Overlapping fire while a cycle is still running — skip entirely.
    // STRICT (F3 review): there is deliberately no staleness bypass. An
    // aborted/trapping cycle rolls back its own guard write, so a "wedged"
    // busy flag cannot persist; the only thing a time-based bypass could do
    // is admit an overlapping cycle — the exact hazard this guard prevents.
    if (not CycleGuard.tryEnter(blockCycleGuard)) { return };
    try {
      // Attempt to drain any pending retry-mint queue before the new block processes
      ignore await MiningLib.drainPendingMints(miningState, tryLedgerMint);
      // Clean up expired pending burn claims before processing the new block
      GritLib.cleanupExpiredClaims(gritState, Time.now());
      // Capture the block id BEFORE any await so the record carries this cycle's
      // own block number even if another mutation advances the counter (AKK-5).
      let thisBlockId = miningState.blockNumber;
      let timerReset = await MiningLib.processBlock(
        miningState,
        thisBlockId,
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
    } catch (e) {
      // Guard stays correct even when a child await rejected mid-cycle.
      // Re-raise so the timer framework still observes the failure.
      CycleGuard.release(blockCycleGuard);
      throw e;
    };
    CycleGuard.release(blockCycleGuard);
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

  // Pending-claim re-check timer — SELF-HEALING re-schedule loop (2026-09-12).
  //
  // The old form used Timer.recurringTimer, whose fire DIES PERMANENTLY if
  // the async body traps (a single malformed RPC response or an unexpected
  // trap anywhere in recheckClaim/recheckFeeClaim permanently stopped all
  // background claim verification — observed live 2026-09-11: the timer
  // died between 19:01 and 19:10, and stuck claims stopped self-healing
  // until recheckPendingClaims was fired manually).
  //
  // New design: fire-once timer + re-schedule at the START of each fire.
  // The re-arm executes BEFORE the recheck body, so a body failure after
  // the first await (call rejections are caught below; traps after an
  // intervening await roll back state but not the already-made timer
  // registration) defers to the NEXT fire instead of killing the chain.
  // Honest limits (review 2026-09-12): (a) a trap in the synchronous
  // prefix of the fire — before recheckPendingClaims' first outcall —
  // WOULD discard the re-arm; no such trap exists today (no
  // Runtime.trap/assert in that prefix). (b) Fires are NOT serialized:
  // a body longer than 15s lets the next fire start early — duplicate
  // outcalls only; GritLib.updateClaimStatus's CAS guard (lib/grit.mo)
  // makes double-credit impossible. A naive `var processing` latch was
  // rejected: a trap mid-fire would latch it true (the blockCycleGuard
  // latch class) and stop verification until restart — worse than the
  // waste it prevents.
  func scheduleRecheck<system>() : () {
    ignore Timer.setTimer<system>(
      #seconds 15,
      func() : async () {
        scheduleRecheck(); // re-arm FIRST — a trap below can't kill the chain
        try {
          await recheckPendingClaims();
        } catch (e) {
          Debug.print("[grit-api] recheckPendingClaims fire rejected: " # Error.message(e));
        };
      },
    );
  };
  scheduleRecheck();

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
