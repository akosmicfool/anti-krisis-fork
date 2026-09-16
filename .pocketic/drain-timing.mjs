/**
 * F8 review validation: how long does a BOUNDED mint-retry drain take?
 *
 * The review flagged an unvalidated assumption: DRAIN_BATCH_MAX (25 entries,
 * ~2 ledger calls each) was sized from arithmetic, not measurement. This
 * script measures the real cost of the drain's exact call sequence against the
 * pinned ICRC-1 ledger in a local replica:
 *
 *   for each queued entry:  icrc1_total_supply (cap check)  →  icrc1_transfer
 *
 * Both calls are sent with sender = the BACKEND principal, i.e. the same
 * authority the drain runs under (the backend is the ledger's minting account).
 * Payload shape mirrors main.mo exactly: fee = null, memo = 8-byte blockId,
 * created_at_time = the F2 frozen derivation.
 *
 * Result is a LOWER BOUND: a local PocketIC replica has no consensus round
 * trips, so a deployed subnet is slower. The mainnet figure is measured
 * separately (an update-call round trip on a real subnet) and combined in the
 * report; this script prints the local baseline and the break-even maths.
 *
 * Run: node .pocketic/drain-timing.mjs
 */
import { provision } from './harness.mjs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PIC_NODE_MODULES = resolve(ROOT, 'node_modules/.pnpm/@dfinity+pic@0.23.0/node_modules');
const requireFromPic = createRequire(resolve(PIC_NODE_MODULES, '@dfinity/pic/package.json'));
const { IDL } = requireFromPic('@icp-sdk/core/candid');

// DRAIN_BATCH_MAX from src/backend/lib/mining.mo — assert it matches below.
const DRAIN_BATCH_MAX = 25;
// A block cycle is 690s; the drain must finish well inside that window.
const CYCLE_SECONDS = 690;

// ── F2 derivation (mirror of lib/ledger-mint.mo) ────────────────────────────
const MINT_TS_EPOCH_NS = 1_767_225_600_000_000_000n;
const BLOCK_SECONDS_NS = 690_000_000_000n;
const TX_WINDOW_NS = 86_400_000_000_000n;
const WINDOW_MARGIN_NS = 3_600_000_000_000n;

function mintCreatedAtTime(blockId, nowNs) {
  const id = BigInt(blockId);
  const derived = MINT_TS_EPOCH_NS + id * BLOCK_SECONDS_NS;
  const floor = nowNs - (TX_WINDOW_NS - WINDOW_MARGIN_NS);
  if (derived >= floor && derived <= nowNs - WINDOW_MARGIN_NS) return derived;
  const step = TX_WINDOW_NS - 2n * WINDOW_MARGIN_NS;
  const anchor = nowNs - WINDOW_MARGIN_NS;
  const k = anchor / step; // BigInt division truncates toward zero, as Motoko Int does
  return k * step;
}

const Account = IDL.Record({ owner: IDL.Principal, subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)) });
const TransferArg = IDL.Record({
  from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
  to: Account,
  amount: IDL.Nat,
  fee: IDL.Opt(IDL.Nat),
  memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
  created_at_time: IDL.Opt(IDL.Nat64),
});
const TransferError = IDL.Variant({
  BadFee: IDL.Record({ expected_fee: IDL.Nat }),
  BadBurn: IDL.Record({ min_burn_amount: IDL.Nat }),
  InsufficientFunds: IDL.Record({ balance: IDL.Nat }),
  TooOld: IDL.Null,
  CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
  Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
  TemporarilyUnavailable: IDL.Null,
  GenericError: IDL.Record({ error_code: IDL.Nat, message: IDL.Text }),
});
const TransferResult = IDL.Variant({ Ok: IDL.Nat, Err: TransferError });

// 8-byte big-endian blockId memo, as Utils.blockIdMemo produces.
function blockIdMemo(blockId) {
  const out = new Uint8Array(8);
  let v = BigInt(blockId);
  for (let i = 7; i >= 0; i--) {
    out[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  return Array.from(out);
}

const stats = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const sum = s.reduce((a, b) => a + b, 0);
  return {
    n: s.length,
    avg: sum / s.length,
    p50: s[Math.floor(s.length * 0.5)],
    p95: s[Math.floor(s.length * 0.95)],
    max: s[s.length - 1],
    sum,
  };
};

let pic, picServer, backendTrappedOut;
try {
  const env = await provision();
  pic = env.pic;
  picServer = env.picServer;
  backendTrappedOut = env.backendTrapped;
  const { ledger, ledgerFixture, backendPrincipal } = env;
  const { createIdentity } = requireFromPic('@dfinity/pic/dist/identity.js');
  // Distinct winners, one per retried block (mirrors drainPendingMints).
  const winnerPrincipals = Array.from({ length: DRAIN_BATCH_MAX }, (_, i) =>
    createIdentity(`f8-winner-${i}`).getPrincipal());

  if (backendTrappedOut) {
    throw new Error('backend install trapped — cannot measure a faithful drain (backend authority missing)');
  }

  const name = await ledger.icrc1_name();
  const supply = await ledger.icrc1_total_supply();
  console.log(`ledger OK — ${name}, supply=${supply}`);
  console.log(`backend principal (drain sender) — ${backendPrincipal.toText()}`);
  console.log(`measuring a full drain of ${DRAIN_BATCH_MAX} entries…\n`);

  // ── warm-up (JIT + canister start-up must not skew the sample) ────────────
  const supplyArg = IDL.encode([], []);
  for (let i = 0; i < 3; i++) {
    await pic.queryCall({ canisterId: ledgerFixture.canisterId, sender: backendPrincipal, method: 'icrc1_total_supply', arg: supplyArg });
    await pic.updateCall({
      canisterId: ledgerFixture.canisterId,
      sender: backendPrincipal,
      method: 'icrc1_transfer',
      arg: IDL.encode([TransferArg], [{
        from_subaccount: [], to: { owner: winnerPrincipals[i], subaccount: [] },
        amount: 1_000n, fee: [], memo: [blockIdMemo(900_000 + i)], created_at_time: [mintCreatedAtTime(900_000 + i, BigInt(await pic.getTime()) * 1_000_000n)],
      }]),
    });
  }

  const supplyTimes = [];
  const transferTimes = [];
  const entryTimes = [];

  const baseBlockId = 1_000_000;
  const drainStart = process.hrtime.bigint();
  for (let i = 0; i < DRAIN_BATCH_MAX; i++) {
    const blockId = baseBlockId + i;
    const nowNs = BigInt(await pic.getTime()) * 1_000_000n; // replica clock: a host clock far ahead is CreatedInFuture
    const start = process.hrtime.bigint();

    // 1) cap check — exactly as tryLedgerMint does before every retry
    const t0 = process.hrtime.bigint();
    await pic.queryCall({ canisterId: ledgerFixture.canisterId, sender: backendPrincipal, method: 'icrc1_total_supply', arg: supplyArg });
    const t1 = process.hrtime.bigint();
    supplyTimes.push(Number(t1 - t0) / 1e6);

    // 2) the mint itself — fee null, memo = blockId, frozen created_at_time
    const arg = IDL.encode([TransferArg], [{
      from_subaccount: [],
      to: { owner: winnerPrincipals[i], subaccount: [] },
      amount: 15_000_000_000n,
      fee: [],
      memo: [blockIdMemo(blockId)],
      created_at_time: [mintCreatedAtTime(blockId, nowNs)],
    }]);
    const t2 = process.hrtime.bigint();
    const res = await pic.updateCall({ canisterId: ledgerFixture.canisterId, sender: backendPrincipal, method: 'icrc1_transfer', arg });
    const t3 = process.hrtime.bigint();
    transferTimes.push(Number(t3 - t2) / 1e6);

    const decoded = IDL.decode([TransferResult], res)[0];
    if (decoded?.Ok === undefined) {
      throw new Error(`entry ${i} mint failed: ${JSON.stringify(decoded, (_, v) => (typeof v === 'bigint' ? String(v) : v))}`);
    }
    entryTimes.push(Number(process.hrtime.bigint() - start) / 1e6);
  }
  const drainMs = Number(process.hrtime.bigint() - drainStart) / 1e6;

  const sup = stats(supplyTimes);
  const tra = stats(transferTimes);
  const ent = stats(entryTimes);

  const secs = (ms) => (ms / 1000).toFixed(2);
  console.log('per-call cost against the pinned ledger (local replica, lower bound)');
  console.log(`  icrc1_total_supply (query): avg ${sup.avg.toFixed(1)} ms, p95 ${sup.p95.toFixed(1)} ms, max ${sup.max.toFixed(1)} ms`);
  console.log(`  icrc1_transfer     (update): avg ${tra.avg.toFixed(1)} ms, p95 ${tra.p95.toFixed(1)} ms, max ${tra.max.toFixed(1)} ms`);
  console.log(`  per entry (supply+transfer): avg ${ent.avg.toFixed(1)} ms, max ${ent.max.toFixed(1)} ms`);
  console.log();
  console.log(`FULL DRAIN of ${DRAIN_BATCH_MAX} entries: ${secs(drainMs)} s   (sum of per-call times: ${secs(sup.sum + tra.sum)} s)`);
  console.log();

  // ── how much headroom is left inside one 690s cycle window? ───────────────
  const localDrainS = drainMs / 1000;
  const budget = CYCLE_SECONDS;
  const ratio = localDrainS / budget;
  console.log(`cycle window: ${budget}s — local drain consumes ${(ratio * 100).toFixed(2)}% of it`);
  // Break-even: the per-call cost would have to grow this many times before a
  // full drain fills the whole window.
  const breakEven = budget / localDrainS;
  console.log(`break-even: per-call latency would need to be ~${breakEven.toFixed(1)}x higher for a full 25-entry drain to consume the entire 690s window`);
  console.log();

  // Sanity: the transfer count proves the batch really executed.
  const post = await ledger.icrc1_total_supply();
  // The 3 warm-up mints (3 x 1_000) are part of the supply too.
  const warmUp = 3_000n;
  const expected = supply + 15_000_000_000n * BigInt(DRAIN_BATCH_MAX) + warmUp;
  console.log(`supply after: ${post} — expected ${expected} (25 x 15e9 + ${warmUp} warm-up)`);
  const mintedAsExpected = post === expected;
  console.log(`mint accounting: ${mintedAsExpected ? 'OK' : 'MISMATCH'}`);

  // Assert the batch really is 25 (guards against DRAIN_BATCH_MAX drifting).
  const { execSync } = await import('node:child_process');
  const src = (await import('node:fs')).readFileSync(resolve(ROOT, 'src/backend/lib/mining.mo'), 'utf8');
  const m = src.match(/DRAIN_BATCH_MAX\s*:\s*Nat\s*=\s*([0-9_]+)/);
  const declared = m ? Number(m[1].replace(/_/g, '')) : null;
  console.log(`DRAIN_BATCH_MAX declared in source: ${declared} (script measured ${DRAIN_BATCH_MAX})`);
  if (declared !== DRAIN_BATCH_MAX) throw new Error('DRAIN_BATCH_MAX in source differs from this script');

  await pic.tearDown();
  await picServer.stop();
  console.log('\nF8 TIMING COMPLETE');
  process.exit(0);
} catch (e) {
  console.error('F8 TIMING FAILED:', e?.message ?? e);
  try { await pic?.tearDown(); await picServer?.stop(); } catch {}
  process.exit(1);
}
