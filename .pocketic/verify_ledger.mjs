// W0 verification: ledger provisioning via typed Candid encode + real ICRC-1 calls,
// backend fresh-install trap re-confirmed as deterministic.
import { PocketIc, PocketIcServer, createIdentity } from '@dfinity/pic';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const requireFromPic = createRequire(resolve(ROOT, 'node_modules/.pnpm/@dfinity+pic@0.23.0/node_modules/@dfinity/pic/package.json'));
const { IDL } = requireFromPic('@icp-sdk/core/candid');
const backendDecls = requireFromPic(resolve(ROOT, 'src/frontend/src/declarations/backend.did.js'));

const ledgerIdlFactory = ({ IDL }) => {
  const Account = IDL.Record({ owner: IDL.Principal, subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)) });
  const TransferArg = IDL.Record({ from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)), to: Account, amount: IDL.Nat, fee: IDL.Opt(IDL.Nat), memo: IDL.Opt(IDL.Vec(IDL.Nat8)), created_at_time: IDL.Opt(IDL.Nat64) });
  const TransferError = IDL.Variant({ BadFee: IDL.Record({ expected_fee: IDL.Nat }), BadBurn: IDL.Record({ min_burn_amount: IDL.Nat }), InsufficientFunds: IDL.Record({ balance: IDL.Nat }), TooOld: IDL.Null, CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }), Duplicate: IDL.Record({ duplicate_of: IDL.Nat }), TemporarilyUnavailable: IDL.Null, GenericError: IDL.Record({ error_code: IDL.Nat, message: IDL.Text }) });
  return IDL.Service({
    icrc1_name: IDL.Func([], [IDL.Text], ['query']),
    icrc1_symbol: IDL.Func([], [IDL.Text], ['query']),
    icrc1_total_supply: IDL.Func([], [IDL.Nat], ['query']),
    icrc1_balance_of: IDL.Func([Account], [IDL.Nat], ['query']),
    icrc1_transfer: IDL.Func([TransferArg], [IDL.Variant({ Ok: IDL.Nat, Err: TransferError })], []),
  });
};

// Ledger Init args, typed (mirrors akk-ledger/akk_ledger_init.args with
// principals swapped to harness-controlled ones).
function ledgerInitArgs({ IDL }, mintingOwner, controller) {
  const Account = IDL.Record({ owner: IDL.Principal, subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)) });
  const MetadataValue = IDL.Variant({ Int: IDL.Int, Nat: IDL.Nat, Nat8: IDL.Nat8, Nat16: IDL.Nat16, Nat32: IDL.Nat32, Nat64: IDL.Nat64, Text: IDL.Text, Blob: IDL.Vec(IDL.Nat8), Bool: IDL.Bool });
  const ArchiveOptions = IDL.Record({
    num_blocks_to_archive: IDL.Nat64, trigger_threshold: IDL.Nat64,
    max_transactions_per_response: IDL.Opt(IDL.Nat64), max_message_size_bytes: IDL.Opt(IDL.Nat),
    cycles_for_archive_creation: IDL.Opt(IDL.Nat64), node_max_memory_size_bytes: IDL.Opt(IDL.Nat16),
    controller_id: IDL.Principal, more_controller_ids: IDL.Opt(IDL.Vec(IDL.Principal)),
  });
  const InitArgs = IDL.Record({
    token_symbol: IDL.Text, token_name: IDL.Text, decimals: IDL.Opt(IDL.Nat8),
    transfer_fee: IDL.Nat, minting_account: Account, fee_collector_account: IDL.Opt(Account),
    max_memo_length: IDL.Opt(IDL.Nat16), metadata: IDL.Vec(IDL.Tuple(IDL.Text, MetadataValue)),
    initial_balances: IDL.Vec(IDL.Record({ account: Account, amount: IDL.Nat })),
    feature_flags: IDL.Opt(IDL.Record({ icrc2: IDL.Bool })), archive_options: ArchiveOptions,
    index_principal: IDL.Opt(IDL.Principal),
  });
  const Args = IDL.Variant({ Init: InitArgs, Upgrade: IDL.Opt(IDL.Record({ index_principal: IDL.Opt(IDL.Principal) })) });
  const none = [];
  return IDL.encode([Args], [{ Init: {
    token_symbol: 'AKK', token_name: 'Anti Krisis Koin', decimals: [8],
    transfer_fee: 10_000n, minting_account: { owner: mintingOwner, subaccount: none },
    fee_collector_account: none, max_memo_length: [32], metadata: [],
    initial_balances: [], feature_flags: [{ icrc2: true }],
    archive_options: { num_blocks_to_archive: 1000n, trigger_threshold: 2000n,
      max_transactions_per_response: none, max_message_size_bytes: none,
      cycles_for_archive_creation: [100_000_000_000n], node_max_memory_size_bytes: none,
      controller_id: controller, more_controller_ids: none },
    index_principal: none,
  }}]);
}

const binPath = resolve(ROOT, 'node_modules/@dfinity/pic/pocket-ic');
const picServer = await PocketIcServer.start({ binPath });
const pic = await PocketIc.create(picServer.getUrl());
let ok = true;
try {
  const mintingId = createIdentity('harness-minting-controller');
  const userId = createIdentity('harness-test-user');
  const owner = await pic.createCanister({ controllers: [mintingId.getPrincipal()] });
  const ledgerWasm = readFileSync(resolve(ROOT, '.pocketic/ledger.wasm'));
  const initBytes = ledgerInitArgs({ IDL }, mintingId.getPrincipal(), mintingId.getPrincipal());
  const lf = await pic.setupCanister({ idlFactory: ledgerIdlFactory, wasm: ledgerWasm, arg: initBytes, canisterId: owner, controllers: [mintingId.getPrincipal()], sender: mintingId.getPrincipal() });
  const name = await lf.actor.icrc1_name();
  const sym = await lf.actor.icrc1_symbol();
  const supply0 = await lf.actor.icrc1_total_supply();
  const c1 = name === 'Anti Krisis Koin' && sym === 'AKK' && supply0 === 0n;
  console.log(`CHECK1 ledger install+queries: ${name} (${sym}) supply=${supply0} ${c1 ? 'PASS' : 'FAIL'}`);
  ok = ok && c1;

  lf.actor.setIdentity(mintingId);
  const holder = { owner: userId.getPrincipal(), subaccount: [] };
  const mint = await lf.actor.icrc1_transfer({ from_subaccount: [], to: holder, amount: 1_000_000n, fee: [], memo: [], created_at_time: [] });
  const bal = await lf.actor.icrc1_balance_of(holder);
  const c2 = 'Ok' in mint && bal === 1_000_000n;
  console.log('CHECK2 ledger mint result: ' + (mint.Ok !== undefined ? 'Ok(' + mint.Ok + ')' : 'Err:' + JSON.stringify(mint.Err, (_, v) => typeof v === 'bigint' ? v.toString() : v)) + ' balance=' + bal);
  ok = ok && c2;

  const backendWasm = readFileSync(resolve(ROOT, 'src/backend/dist/backend.wasm'));
  try {
    await pic.setupCanister({ idlFactory: backendDecls.idlFactory, wasm: backendWasm });
    console.log('CHECK3 backend fresh install: PASS (unexpected — expected trap)');
  } catch (e) {
    const trapped = String(e?.message ?? e).includes('adminState');
    console.log(`CHECK3 backend fresh-install trap deterministic: ${trapped ? 'PASS (known blocker, W1B owns fix)' : 'FAIL — different error: ' + String(e?.message ?? e).slice(0, 120)}`);
    ok = ok && trapped;
  }
  console.log(ok ? '== W0 VERIFICATION: ALL CHECKS PASSED ==' : '== W0 VERIFICATION: FAILED ==');
  await pic.tearDown();
} catch (e) {
  console.log('HARNESS ERROR:', String(e?.message ?? e).slice(0, 300));
  process.exitCode = 1;
} finally { await picServer.stop(); }
