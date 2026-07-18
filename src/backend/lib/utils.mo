import Principal "mo:core/Principal";
import Blob "mo:core/Blob";
import Array "mo:core/Array";
import Nat8 "mo:core/Nat8";

module {
  /// Convert a Principal to a 32-byte subaccount Blob (length-prefixed, zero-padded).
  /// Byte 0 = number of principal bytes, bytes 1..n = principal bytes, bytes n+1..31 = 0x00.
  /// This is the canonical ICP subaccount encoding used by ICRC-1 ledgers.
  public func principalToSubaccount(p : Principal) : Blob {
    let bytes = p.toBlob().toArray();
    let len = bytes.size();
    Blob.fromArray(
      Array.tabulate<Nat8>(32, func(i) {
        if (i == 0) { Nat8.fromNat(len) }
        else if (i <= len) { bytes[i - 1] }
        else { 0 };
      })
    );
  };
};
