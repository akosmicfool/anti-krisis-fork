// AKK-FIX-15 regression tests: a kVCM retirement is only proven by an
// AggregatorRetired log emitted BY the KlimaDAO Retirement Aggregator diamond.
// Any contract can emit an event with the same topic0 (and anyone can move
// kVCM to the AAM), so a topic-only match proves nothing — the emitter check
// is what makes the retirement log evidence.
//
// Fixture bytes are the REAL log data of Base mainnet tx
// 0x6b0b6b1fb40b42dccb3b78d338452fc4713d18b97fef29ea850a842dcad8559e
// (block 51445387, 2026-09-17): the AggregatorRetired log was emitted by the
// aggregator diamond 0xda0a…64f4 (verified via eth_getLogs: it is the only
// emitter of topic0 0x6fc64dac… on Base) and a real kVCM Transfer into the
// AAM 0x1c24…bde1 carries 20568650856161316558 wei.
import Test "mo:test/async";
import Runtime "mo:core/Runtime";
import VerifyLib "../lib/verification";

func requireOk(r : VerifyLib.VerificationResult) {
  switch (r) {
    case (#ok(_)) {};
    case (#err(e)) { Runtime.trap("expected #ok, got: " # e) };
  };
};

func expectErrContaining(r : VerifyLib.VerificationResult, needle : Text) {
  switch (r) {
    case (#ok(_)) { Runtime.trap("expected #err containing \"" # needle # "\"") };
    case (#err(e)) {
      if (not e.contains(#text needle)) { Runtime.trap("err \"" # e # "\" lacks \"" # needle # "\"") };
    };
  };
};

let KVCM = "0x00fbac94fec8d4089d3fe979f39454f48c71a65d";
let AGGREGATOR = "0xda0a793d7c32ab80bcdab7f8c725c96db22464f4";
let AGGREGATOR_MIXED_CASE = "0xdA0A793D7C32AB80bcdab7F8c725c96DB22464f4";
let ATTACKER = "0x000000000000000000000000000000000000d34d";
let TX = "0x6b0b6b1fb40b42dccb3b78d338452fc4713d18b97fef29ea850a842dcad8559e";
let RETIRE_TOPIC0 = "0x6fc64daccb3e984a15ddc33e89be48bb68d451d2b125e3c84fe8aa218018ab9c";
let TRANSFER_TOPIC0 = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

// Real AggregatorRetired data (1024 hex chars): head word 8 is retiredAmount
// (4.483501e18); the trailing words are the retirementMessage string tail.
let RETIRE_DATA = "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000009623e6c969dc54f1972eb8b311eb9ed4cebc5e3e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000003e389867a71bd0000000000000000000000000000000000000000000000000000000000000000020436172626f6e6d61726b205265746972656d656e742041676772656761746f72000000000000000000000000000000000000000000000000000000000000001f4175746f6d6174656420436172626f6e205265746972656d656e7420426f740000000000000000000000000000000000000000000000000000000000000000374175746f6d61746564207265746972656d656e7420766961204b6c696d6144414f20783430322070726f746f636f6c206f6e2042617365000000000000000000";

/// One AggregatorRetired log object as an RPC receipt renders it.
func retireLog(emitter : Text) : Text {
  "{\"address\":\"" # emitter # "\",\"topics\":[\"" # RETIRE_TOPIC0 # "\"],\"data\":\"" # RETIRE_DATA #
  "\",\"blockNumber\":\"0x30a5e83\",\"transactionHash\":\"" # TX #
  "\",\"logIndex\":\"0x1c0\",\"removed\":false}";
};

/// A log object with no `address` field at all (fail-closed probe).
func retireLogNoAddress() : Text {
  "{\"topics\":[\"" # RETIRE_TOPIC0 # "\"],\"data\":\"" # RETIRE_DATA #
  "\",\"transactionHash\":\"" # TX # "\",\"logIndex\":\"0x1c0\",\"removed\":false}";
};

/// The real kVCM Transfer into the AAM (0x290e… → 0x1c24…, 20568650856161316558 wei).
func kvcmToAamLog() : Text {
  "{\"address\":\"" # KVCM # "\",\"topics\":[\"" # TRANSFER_TOPIC0 #
  "\",\"0x000000000000000000000000290e98e95dace244c73376c0c39a4d53b22e34b6\"" #
  ",\"0x0000000000000000000000001c24239309398220883207681602bff4d10fbde1\"]" #
  ",\"data\":\"0x0000000000000000000000000000000000000000000000011d7286f9ee878ece\"" #
  ",\"transactionHash\":\"" # TX # "\",\"logIndex\":\"0x1bb\",\"removed\":false}";
};

func receipt(logs : [Text]) : Text {
  var body = "";
  var i = 0;
  while (i < logs.size()) {
    if (i > 0) { body #= "," };
    body #= logs[i];
    i += 1;
  };
  "{\"jsonrpc\":\"2.0\",\"id\":1,\"result\":{\"status\":\"0x1\",\"logs\":[" # body # "]}}";
};

// ── emitter must be the KlimaDAO aggregator ─────────────────────────────────

await Test.test("aggregator-emitted retirement log is accepted", func() : async () {
  requireOk(VerifyLib.parseRetirementResponse(
    receipt([retireLog(AGGREGATOR), kvcmToAamLog()]), KVCM, "base"));
});

await Test.test("mixed-case aggregator address is accepted (normalised)", func() : async () {
  requireOk(VerifyLib.parseRetirementResponse(
    receipt([retireLog(AGGREGATOR_MIXED_CASE), kvcmToAamLog()]), KVCM, "base"));
});

await Test.test("retirement log emitted by a non-aggregator contract is rejected", func() : async () {
  // The attacker's contract emits a matching topic0 AND real kVCM sits in the
  // AAM — only the emitter proves a Klima retirement happened.
  expectErrContaining(
    VerifyLib.parseRetirementResponse(receipt([retireLog(ATTACKER), kvcmToAamLog()]), KVCM, "base"),
    "No AggregatorRetired retirement log found");
});

await Test.test("a look-alike log before a genuine aggregator log is skipped, not fatal", func() : async () {
  requireOk(VerifyLib.parseRetirementResponse(
    receipt([retireLog(ATTACKER), retireLog(AGGREGATOR), kvcmToAamLog()]), KVCM, "base"));
});

await Test.test("retirement log without an address field is not accepted (fail closed)", func() : async () {
  expectErrContaining(
    VerifyLib.parseRetirementResponse(receipt([retireLogNoAddress(), kvcmToAamLog()]), KVCM, "base"),
    "No AggregatorRetired retirement log found");
});

// ── the kVCM→AAM transfer gate is unchanged ─────────────────────────────────

await Test.test("aggregator log with no kVCM transfer to the AAM is still rejected", func() : async () {
  expectErrContaining(
    VerifyLib.parseRetirementResponse(receipt([retireLog(AGGREGATOR)]), KVCM, "base"),
    "transfer to AAM");
});