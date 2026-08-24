import Principal "mo:core/Principal";
import Blob "mo:core/Blob";
import Array "mo:core/Array";
import Nat8 "mo:core/Nat8";
import Nat64 "mo:core/Nat64";
import Nat "mo:core/Nat";

module {
  /// Convert a Principal to a 32-byte subaccount Blob (length-prefixed, zero-padded).
  /// Byte 0 = number of principal bytes, bytes 1..n = principal bytes, bytes n+1..31 = 0x00.
  /// This is the canonical ICP subaccount encoding used by ICRC-1 ledgers.
  public func principalToSubaccount(p : Principal) : Blob {
    let bytes = p.toBlob().toArray();
    let len = bytes.size();
    Blob.fromArray(
      Array.tabulate(32, func(i) : Nat8 {
        if (i == 0) { Nat8.fromNat(len) }
        else if (i <= len) { bytes[i - 1] }
        else { 0 };
      })
    );
  };

  /// Encode blockId as an 8-byte big-endian Nat64 memo for ICRC-1 mint idempotency.
  public func blockIdMemo(blockId : Nat) : Blob {
    let max : Nat = 18_446_744_073_709_551_615;
    let n : Nat64 = Nat64.fromNat(if (blockId > max) { 0 } else { blockId });
    Blob.fromArray(
      Array.tabulate(8, func(i) : Nat8 {
        let shift : Nat64 = Nat64.fromNat((7 - i) * 8);
        Nat8.fromNat(Nat64.toNat((n >> shift) & 255));
      })
    );
  };
};
