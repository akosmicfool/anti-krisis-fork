// AKK-4/8/10 regression tests: wallet-relay compatibility for fee binding.
// Embedded wallets relay fee txs through a forwarder contract: tx.to = the
// FORWARDER (not the collector) and tx.input = forwarder calldata — but the
// collector still receives the payment and emits FeePaid with the binding
// intact (validated against real relayed receipts 2026-09-03, TGN claim:
// to=0xdb9b…47db3, input=forwarder selector, yet FeePaid emitted by the
// collector with payer == tx.from and the 96-byte binding intact).
// When the FeePaid event check is ARMED and a matching event exists
// (emitter = collector, payer = fee-tx sender), the event PROVES the payment
// reached the collector and carries the authoritative binding bytes — so the
// tx-level recipient check is satisfied by the event, and check 4 reads the
// event's binding instead of the relayed input.
// Disarmed (event binding = null): the strict tx-level rules are unchanged —
// defense in depth stays exactly as strict as before.
import Test "mo:test/async";
import Runtime "mo:core/Runtime";
import VerifyLib "../lib/verification";

func requireOk(r : { #ok; #err : Text }) {
  switch (r) {
    case (#ok) {};
    case (#err(e)) { Runtime.trap("expected #ok, got: " # e) };
  };
};

func expectErrContaining(r : { #ok; #err : Text }, needle : Text) {
  switch (r) {
    case (#ok) { Runtime.trap("expected #err containing \"" # needle # "\"") };
    case (#err(e)) {
      if (not e.contains(#text needle)) { Runtime.trap("err \"" # e # "\" lacks \"" # needle # "\"") };
    };
  };
};

let COLLECTOR = "0x6cbb624d23eeefd23c7f02912f7f35129174acd2";
let FORWARDER = "0xdb9b1e94b5b69df7e401ddbede43491141047db3";
let WALLET = "0x2c8467da8b7b3d0a7e3886f6cb6697c49571ff66";
let CLAIMANT = "kxkjo-px2zk-4pytx-ncro7-sqdgd-bhc3t-iw5x6-zavns-vwgrr-x4otp-cqe";
let BURN = "b57198017e796cff6479ae10c26254767c5dc1635a1b6316823257bc6d6bf5d8";

func tx(to_ : Text, from_ : Text, input_ : Text) : VerifyLib.TxByHash {
  { from = from_; to = to_; input = input_ };
};

func hexDigitText(n : Nat) : Text {
  let hi = n / 16;
  let lo = n % 16;
  let hiC = Char.fromNat32(Nat32.fromNat(if (hi < 10) 48 + hi else 87 + hi));
  let loC = Char.fromNat32(Nat32.fromNat(if (lo < 10) 48 + lo else 87 + lo));
  Char.toText(hiC) # Char.toText(loC);
};

func hexOfText(t : Text) : Text {
  var out = "";
  for (c in t.chars()) {
    out #= hexDigitText(Nat32.toNat(Char.toNat32(c)));
  };
  out;
};

// Binding payload: 0x3f (principal len 63) + ASCII principal + 32-byte burn hash.
let PRINCIPAL_HEX = hexOfText(CLAIMANT); // 126 hex chars
let BINDING = "3f" # PRINCIPAL_HEX # BURN; // 192 hex chars

// Same-length variants for mismatch tests (flip last char only):
let ALT_BURN = "b57198017e796cff6479ae10c26254767c5dc1635a1b6316823257bc6d6bf5d9";
let ALT_PRINCIPAL = "kxkjo-px2zk-4pytx-ncro7-sqdgd-bhc3t-iw5x6-zavns-vwgrr-x4otp-cqf"; // 63 chars
let ALT_PRINCIPAL_HEX = hexOfText(ALT_PRINCIPAL);

// ── relayed-fee acceptance (armed path) ─────────────────────────────────────

await Test.test("relayed fee tx (to=forwarder) is rejected when not armed", func() : async () {
  let relayed = tx(FORWARDER, WALLET, "0xcef6d2090000000000000000000000000000000000000000000000000000000000000060");
  expectErrContaining(
    VerifyLib.verifyFeeBinding(relayed, tx(WALLET, WALLET, ""), COLLECTOR, CLAIMANT, BURN, null, null),
    "recipient is not the configured fee wallet",
  );
});

await Test.test("relayed fee tx is accepted with a matching collector event", func() : async () {
  let relayed = tx(FORWARDER, WALLET, "0xcef6d2090000000000000000000000000000000000000000000000000000000000000060");
  requireOk(VerifyLib.verifyFeeBinding(
    relayed,
    tx(WALLET, WALLET, ""),
    COLLECTOR,
    CLAIMANT,
    BURN,
    ?BINDING, null));
});

await Test.test("direct fee tx unchanged: binding still enforced from input (armed or not)", func() : async () {
  let direct = tx(COLLECTOR, WALLET, "0x" # BINDING);
  requireOk(VerifyLib.verifyFeeBinding(direct, tx(WALLET, WALLET, ""), COLLECTOR, CLAIMANT, BURN, null, null));
  requireOk(VerifyLib.verifyFeeBinding(direct, tx(WALLET, WALLET, ""), COLLECTOR, CLAIMANT, BURN, ?BINDING, null));
});

await Test.test("direct fee with a WRONG binding still fails (armed)", func() : async () {
  let direct = tx(COLLECTOR, WALLET, "0x" # BINDING);
  // Same-length different burn hash (last hex char flipped 8→9)
  let altBurn = "b57198017e796cff6479ae10c26254767c5dc1635a1b6316823257bc6d6bf5d9";
  expectErrContaining(
    VerifyLib.verifyFeeBinding(
      direct,
      tx(WALLET, WALLET, ""),
      COLLECTOR,
      CLAIMANT,
      ALT_BURN,
      ?("3f" # PRINCIPAL_HEX # BURN), null),
    "different burn transaction",
  );
});

await Test.test("event binding naming a different burn still fails", func() : async () {
  let relayed = tx(FORWARDER, WALLET, "0xcef6d209");
  expectErrContaining(
    VerifyLib.verifyFeeBinding(
      relayed,
      tx(WALLET, WALLET, ""),
      COLLECTOR,
      CLAIMANT,
      BURN,
      ?("3f" # PRINCIPAL_HEX # ALT_BURN), null),
    "different burn transaction",
  );
});

await Test.test("event binding naming a different claimant still fails", func() : async () {
  let relayed = tx(FORWARDER, WALLET, "0xcef6d209");
  // Same-length different principal: last char e→f ("…-cqf")
  expectErrContaining(
    VerifyLib.verifyFeeBinding(
      relayed,
      tx(WALLET, WALLET, ""),
      COLLECTOR,
      CLAIMANT,
      BURN,
      ?("3f" # ALT_PRINCIPAL_HEX # BURN), null),
    "does not match the claimant",
  );
});

await Test.test("sender check is never relaxed by the event path", func() : async () {
  let relayed = tx(FORWARDER, WALLET, "0xcef6d209");
  // burnTx sent by a DIFFERENT wallet (from = 0x…dead)
  expectErrContaining(
    VerifyLib.verifyFeeBinding(
      relayed,
      tx(WALLET, "0x000000000000000000000000000000000000dead", ""),
      COLLECTOR,
      CLAIMANT,
      BURN,
      ?BINDING, null),
    "sender differs",
  );
});

await Test.test("unparseable event binding on a relayed tx fails structurally", func() : async () {
  // Armed but the event's binding bytes are unusable — cannot verify, fail
  // (NOT pending: for a relayed tx the event is the ONLY evidence source).
  let relayed = tx(FORWARDER, WALLET, "0xcef6d209");
  expectErrContaining(
    VerifyLib.verifyFeeBinding(relayed, tx(WALLET, WALLET, ""), COLLECTOR, CLAIMANT, BURN, ?"zz", null),
    "no binding payload",
  );
});