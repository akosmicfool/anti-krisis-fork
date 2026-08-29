/**
 * AKK-4 / AKK-8 — fee-tx binding payload builder.
 *
 * The platform-fee transaction doubles as the claim binding: its calldata
 * carries (claimant ICP principal text, burn tx hash). The backend decodes
 * this from eth_getTransactionByHash `input` and enforces:
 *   feeTx.from == burnTx.from          (same wallet)
 *   feeTx.to   == configured fee wallet
 *   feeTx.data == (your principal, this burn's hash)
 *
 * Wire format (mirrors backend VerifyLib.parseFeeBinding):
 *   0x || byte(principalLen) || principalText ASCII bytes || 32-byte burn hash
 */
export function buildFeeBindingData(
  principalText: string,
  burnTxHash: string,
): `0x${string}` {
  const cleanHash = burnTxHash.toLowerCase().replace(/^0x/, "");
  if (cleanHash.length !== 64) {
    throw new Error("Invalid burn tx hash length — expected 32 bytes");
  }
  const principalBytes = new TextEncoder().encode(principalText);
  if (principalBytes.length < 5 || principalBytes.length > 63) {
    throw new Error("Invalid principal length for fee binding payload");
  }
  const payload = new Uint8Array(1 + principalBytes.length + 32);
  payload[0] = principalBytes.length;
  payload.set(principalBytes, 1);
  const hashBytes = (cleanHash.match(/.{2}/g) ?? []).map((byte) =>
    Number.parseInt(byte, 16),
  );
  payload.set(hashBytes, 1 + principalBytes.length);
  let hex = "0x";
  for (const byte of payload) {
    hex += byte.toString(16).padStart(2, "0");
  }
  return hex as `0x${string}`;
}
