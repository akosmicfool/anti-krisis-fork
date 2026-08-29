/**
 * Backend-verification replica test (ops tool): runs the Motoko verification
 * pipeline's exact logic (Python mirror) against the REAL Ethereum RPC
 * responses for the failed IMPT claim. Usage: npx tsx verify-replica.ts
 */
import { readFileSync } from "node:fs";

const FEEPAID_TOPIC0 = "0x6306705606f6bb80eb21422af69622d33b086a84411f822776f54f64b5daa027";
const COLLECTOR = "0x6cbb624d23eeefd23c7f02912f7f35129174acd2";
const PRINCIPAL = "kxkjo-px2zk-4pytx-ncro7-sqdgd-bhc3t-iw5x6-zavns-vwgrr-x4otp-cqe";
const BURN_HASH = "0x328495c689871cbde20e168d5a20ff84c60bb2f70f7a7bc6e168baa3b1587b9f";

// ── mirror of Motoko helpers ──
function indexOfText(hay: string, start: number, needle: string): number {
  return hay.indexOf(needle, start);
}
function extractStringField(arr: string, from: number, key: string): string | null {
  const needle = `"${key}"`;
  const k = indexOfText(arr, from, needle);
  if (k < 0) return null;
  let i = k + needle.length;
  while (i < arr.length && (arr[i] === " " || arr[i] === "\t")) i++;
  if (i >= arr.length || arr[i] !== ":") return null;
  i++;
  while (i < arr.length && (arr[i] === " " || arr[i] === "\t")) i++;
  if (i >= arr.length || arr[i] !== '"') return null;
  const vs = i + 1;
  let j = vs;
  while (j < arr.length && arr[j] !== '"') j++;
  if (j >= arr.length) return null;
  return arr.slice(vs, j);
}
function fieldIsNull(arr: string, key: string): boolean {
  return arr.includes(`"${key}":null`) || arr.includes(`"${key}": null`);
}
function normAddr(a: string): string {
  return a.toLowerCase();
}
function topicToAddress(t: string): string {
  const h = t.slice(0, 2) === "0x" ? t.slice(2) : t;
  return h.length >= 40 ? "0x" + h.slice(-40) : "0x" + h;
}
function nextQuoted(arr: string, from: number): [string, number] | null {
  let i = from;
  while (i < arr.length && arr[i] !== '"') i++;
  if (i >= arr.length) return null;
  const vs = i + 1;
  let j = vs;
  while (j < arr.length && arr[j] !== '"') j++;
  if (j >= arr.length) return null;
  return [arr.slice(vs, j), j + 1];
}
function hexToNat(hex: string): bigint {
  return BigInt("0x" + hex.replace(/^0x/, ""));
}

// ── parseFeeBinding mirror ──
function parseFeeBinding(inputHex: string): { principalText: string; burnHash: string } | null {
  const lower = inputHex.toLowerCase();
  const hex = lower.startsWith("0x") ? lower.slice(2) : lower;
  if (hex.length < 2) return null;
  const bytes = hex.match(/.{2}/g)?.map((b) => parseInt(b, 16)) ?? [];
  if (bytes.length < 1 + 5 + 32) return null;
  const len = bytes[0];
  if (len < 5 || len > 63) return null;
  if (bytes.length !== 1 + len + 32) return null;
  const principalText = String.fromCharCode(...bytes.slice(1, 1 + len));
  const burnHash = bytes
    .slice(1 + len)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return { principalText, burnHash };
}

// ── feePaidLogPresent mirror (exact walkback algorithm) ──
function feePaidLogPresent(j: string, collector: string, expectedPayer: string): boolean {
  const arr = j;
  const normCollector = normAddr(collector);
  const normPayer = normAddr(expectedPayer);
  let pos = indexOfText(arr, 0, '"logs":[');
  let spaced = false;
  if (pos < 0) {
    pos = indexOfText(arr, 0, '"logs": [');
    spaced = true;
  }
  const needleLen = spaced ? '"logs": ['.length : '"logs": ['.length - 1;
  let searchFrom = pos >= 0 ? pos + needleLen : 0;
  while (true) {
    const tp = indexOfText(arr, searchFrom, FEEPAID_TOPIC0);
    if (tp < 0) return false;
    let depth = 0;
    let i = tp - 1;
    let found = false;
    let logStart = 0;
    while (i >= 0) {
      const c = arr[i];
      if (c === "}") depth++;
      else if (c === "{") {
        if (depth === 0) {
          found = true;
          logStart = i;
          break;
        }
        depth--;
      }
      i--;
    }
    if (!found) {
      searchFrom = tp + FEEPAID_TOPIC0.length;
      continue;
    }
    let depth2 = 1;
    let jj = logStart + 1;
    let logEnd = arr.length;
    while (jj < arr.length) {
      if (arr[jj] === "{") depth2++;
      else if (arr[jj] === "}") {
        if (depth2 === 1) {
          logEnd = jj + 1;
          break;
        }
        depth2--;
      }
      jj++;
    }
    const log = arr.slice(logStart, logEnd);
    const emitter = extractStringField(log, 0, "address");
    if (!emitter || normAddr(emitter) !== normCollector) {
      searchFrom = tp + FEEPAID_TOPIC0.length;
      continue;
    }
    let tpos = indexOfText(log, 0, '"topics":[');
    if (tpos < 0) tpos = indexOfText(log, 0, '"topics": [');
    if (tpos < 0) {
      searchFrom = tp + FEEPAID_TOPIC0.length;
      continue;
    }
    const body = log.slice(tpos);
    const open = body.indexOf("[");
    let k = open;
    const quotes: string[] = [];
    while (quotes.length < 2) {
      const s = body.indexOf('"', k + 1);
      if (s < 0) break;
      const e = body.indexOf('"', s + 1);
      if (e < 0) break;
      quotes.push(body.slice(s + 1, e));
      k = e;
    }
    if (quotes.length < 2) {
      searchFrom = tp + FEEPAID_TOPIC0.length;
      continue;
    }
    const [t0, t1] = quotes;
    if (normAddr(t0) !== normAddr(FEEPAID_TOPIC0)) {
      searchFrom = tp + FEEPAID_TOPIC0.length;
      continue;
    }
    if (topicToAddress(t1) === normPayer) return true;
    searchFrom = tp + FEEPAID_TOPIC0.length;
  }
}

// ── run against REAL data ──
const feeTxRaw = JSON.parse(readFileSync("/tmp/eth_fee_t.json", "utf8")).result;
const feeReceiptRaw = readFileSync("/tmp/eth_fee_r.json", "utf8");
const burnReceiptRaw = readFileSync("/tmp/eth_burn_r.json", "utf8");

console.log("=== step 1: verifyFeeTxWithReceipt on fee receipt ===");
const feeReceiptStr = JSON.stringify(feeReceiptRaw); // full response text as IC sees it
const feeReceiptJson = JSON.parse(feeReceiptRaw).result;
if (feeReceiptJson === null) {
  console.log("FAIL: fee receipt null");
} else {
  const err = feeReceiptJson.status !== "0x1";
  console.log("fee status 0x1:", !err);
}

console.log("=== step 2: fetchTxByHash field extraction (mirror) ===");
const feeTxStr = JSON.stringify(JSON.parse(readFileSync("/tmp/eth_fee_t.json", "utf8")));
const from = extractStringField(feeTxStr, 0, "from");
const to = extractStringField(feeTxStr, 0, "to");
const input = extractStringField(feeTxStr, 0, "input") ?? extractStringField(feeTxStr, 0, "data") ?? "";
console.log("extracted from:", from, "| to:", to, "| inputLen:", (input.length - 2) / 2);

console.log("=== step 3: parseFeeBinding on real calldata ===");
const binding = parseFeeBinding(input);
console.log("binding:", binding);
console.log("principal match:", binding?.principalText === PRINCIPAL);
console.log(
  "burnHash match:",
  binding?.burnHash === BURN_HASH.slice(2).toLowerCase(),
);

console.log("=== step 4: feePaidLogPresent on real receipt text ===");
const payer = from ?? "";
const present = feePaidLogPresent(feeReceiptRaw, COLLECTOR, payer);
console.log("FeePaid present:", present);
console.log("=== step 5: burn receipt sanity ===");
const burnJson = JSON.parse(burnReceiptRaw).result;
console.log("burn status:", burnJson.status, "| logs:", burnJson.logs.length);
console.log(
  "\nVERDICT: full pipeline should credit unless one of the steps above prints false/null",
);
