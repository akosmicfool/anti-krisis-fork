// AKK-9 regression tests: processBlock must compute the block reward BEFORE
// draining any miner's GRIT. When the reward is zero — 21M supply cap reached,
// or the halving schedule has exhausted the reward — the block must be a
// no-op: no fuel billed, no winnerless block in history, counter untouched.
// (Bug: the spend loop ran first, so post-cap miners kept paying fuel every
// block for a guaranteed-zero prize.)
import Test "mo:test/async";
import MiningLib "../lib/mining";
import MiningTypes "../types/mining";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";

func freshState() : MiningTypes.State {
  {
    var akkLedgerId = null;
    var nextMinerId = 0;
    miners = Map.empty();
    akkBalances = Map.empty();
    gritSpentByUser = Map.empty();
    totalAkkWonByUser = Map.empty();
    var blockNumber = 0;
    var totalAkkMined = 0;
    minerCreationFees = Map.empty();
    blockHistory = List.empty();
    var lastBlockWasEmpty = true;
    pendingMints = List.empty();
    mintedBlockIds = List.empty();
    abandonedMints = List.empty();
    var totalMintRetried = 0;
    var totalMintSucceeded = 0;
    var totalMintAbandoned = 0;
    var akkTransferFee = 10_000;
    minerFeeTxs = Map.empty();
  }
};

func addActiveMiner(state : MiningTypes.State, balance : Nat) : MiningTypes.MinerRecord {
  let miner : MiningTypes.MinerRecord = {
    id = 1;
    owner = Principal.fromText("w7x7r-cok77-xa");
    var name = "postcap miner";
    var gritBalance = balance;
    var miningRate = 1_000_000_000; // 1 GRIT/day → ~7.99M per 690s block
    var status = #active;
    createdAt = 0;
    var lastProcessedBlock = 0;
    var blocksMined = 0;
    var gritSpent = 0;
  };
  state.miners.add(1, miner);
  miner;
};

// ── zero-reward early return ────────────────────────────────────────────────

await Test.test("post-cap: no GRIT drained, no winnerless block, counter untouched", func() : async () {
  let state = freshState();
  state.blockNumber := 100;
  state.totalAkkMined := 2_100_000_000_000_000; // 21M cap reached
  let miner = addActiveMiner(state, 1_000_000_000);
  let result = await MiningLib.processBlock(state, 100, null, null, null);
  Test.expect.bool(result).isFalse();
  Test.expect.nat(miner.gritBalance).equal(1_000_000_000); // fuel NOT billed
  Test.expect.nat(state.blockHistory.size()).equal(0); // no winnerless block
  Test.expect.nat(state.blockNumber).equal(100); // counter NOT advanced
});

await Test.test("halving-exhausted reward: same early return", func() : async () {
  // Block 2_400_000 → 34 halvings → 15e9 / 2^34 = 0 (cap NOT reached yet,
  // but the schedule itself has exhausted the reward).
  let state = freshState();
  state.blockNumber := 2_400_000;
  state.totalAkkMined := 0;
  let miner = addActiveMiner(state, 1_000_000_000);
  let result = await MiningLib.processBlock(state, 2_400_000, null, null, null);
  Test.expect.bool(result).isFalse();
  Test.expect.nat(miner.gritBalance).equal(1_000_000_000);
  Test.expect.nat(state.blockHistory.size()).equal(0);
  Test.expect.nat(state.blockNumber).equal(2_400_000);
});

// ── sanity: the early return must not over-trigger pre-cap ──────────────────

await Test.test("blockReward still positive pre-cap and post-first-halving", func() : async () {
  Test.expect.nat(MiningLib.blockReward(100, 0)).equal(15_000_000_000);
  Test.expect.nat(MiningLib.blockReward(69_000, 0)).equal(7_500_000_000);
  // Near-cap clamping still yields a positive reward while supply remains:
  Test.expect.nat(MiningLib.blockReward(100, 2_099_999_999_999_999)).equal(1);
});
