// AKK-5 regression tests: BlockRecord must be built from the block id captured
// BEFORE any await — never from the live state.blockNumber counter, which a
// concurrent cycle can advance mid-flight (duplicate/out-of-order history).
// The record step also performs a compare-and-set against the live counter
// (Option B hardening): a record whose captured id no longer matches the
// current height is REJECTED (returns null), never appended — the direct
// analog of Bitcoin's parent-linkage rule. Rejection is a skip, not a trap:
// a trap here would roll back the fire's local state and leave the guard
// latched for its staleness window.
import Test "mo:test/async";
import Runtime "mo:core/Runtime";
import MiningLib "../lib/mining";
import MiningTypes "../types/mining";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

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

func requireRecord(r : ?MiningTypes.BlockRecord) : MiningTypes.BlockRecord {
  switch (r) {
    case (?rec) rec;
    case null { Runtime.trap("expected a record, got null") };
  };
};

func recordFor(state : MiningTypes.State, thisBlockId : Nat) : ?MiningTypes.BlockRecord {
  MiningLib.buildBlockRecord(
    state,
    thisBlockId,
    Time.now(),
    15_000_000_000,
    100,
    [],
    null,
    null,
    0,
  );
};

await Test.test("block record pins the captured block id, not the live counter", func() : async () {
  let state = freshState();
  // Captured id 42 matches the live counter (normal path: captured at entry,
  // counter unchanged since — NOT pre-advanced).
  state.blockNumber := 42;
  let record = requireRecord(recordFor(state, 42));
  Test.expect.nat(record.blockNumber).equal(42);
});

await Test.test("block record uses captured id even when equal counter would differ later", func() : async () {
  let state = freshState();
  let record = requireRecord(recordFor(state, state.blockNumber)); // normal capture path
  Test.expect.nat(record.blockNumber).equal(0);
  state.blockNumber += 1; // history must not retroactively track the counter
  Test.expect.nat(record.blockNumber).equal(0);
});

await Test.test("CAS rejects a record whose captured id no longer matches the height", func() : async () {
  let state = freshState();
  // Simulate a concurrent cycle that already consumed height 42: the live
  // counter has moved on, so a record stamped 42 must NOT be appended.
  state.blockNumber := 43;
  Test.expect.option(
    recordFor(state, 42),
    func(n : MiningTypes.BlockRecord) : Text { "BlockRecord(" # n.blockNumber.toText() # ")" },
    func(a : MiningTypes.BlockRecord, b : MiningTypes.BlockRecord) : Bool { a.blockNumber == b.blockNumber },
  ).isNull();
});

await Test.test("CAS rejection appends nothing and leaves the counter untouched", func() : async () {
  let state = freshState();
  state.blockNumber := 7;
  ignore recordFor(state, 6); // stale capture
  Test.expect.nat(state.blockHistory.size()).equal(0);
  Test.expect.nat(state.blockNumber).equal(7);
});

await Test.test("block record resolves participants and rewards", func() : async () {
  let state = freshState();
  let owner = Principal.fromText("w7x7r-cok77-xa");
  let miner : MiningTypes.MinerRecord = {
    id = 1;
    owner = owner;
    var name = "test miner";
    var gritBalance = 100;
    var miningRate = 1_000_000_000;
    var status = #active;
    createdAt = 0;
    var lastProcessedBlock = 0;
    var blocksMined = 0;
    var gritSpent = 0;
  };
  state.miners.add(1, miner);
  state.blockNumber := 5; // captured id must match the live height (CAS)
  let record = requireRecord(MiningLib.buildBlockRecord(
    state,
    5,
    Time.now(),
    15_000_000_000,
    100,
    [(1, 100)],
    ?1,
    ?owner,
    7,
  ));
  Test.expect.nat(record.blockNumber).equal(5);
  Test.expect.nat(record.akkReward).equal(15_000_000_000);
  Test.expect.nat(record.totalGritSpent).equal(100);
  Test.expect.nat(record.minerParticipants.size()).equal(1);
  Test.expect.bool(Principal.equal(record.minerParticipants[0].1, owner)).isTrue();
  Test.expect.option(record.winnerOwner, Principal.toText, Principal.equal).equal(?owner);
  Test.expect.nat64(record.vrfValue).equal(7);
});
