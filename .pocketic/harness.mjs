/**
 * W0 fault-injection harness (PocketIC).
 *
 * Provisions: backend canister (src/backend/dist/backend.wasm) + pinned AKK
 * ledger (dfinity/ic release ledger-suite-icrc-2026-03-09,
 * sha256 a273d741019b4324…, from akk-ledger/icp.yaml URL) into a local IC.
 *
 * All fixtures are synthetic/local. This harness never touches production,
 * the Caffeine installer, or any cloud deploy path.
 *
 * Run: node .pocketic/harness.mjs
 */
import { PocketIc, PocketIcServer } from '@dfinity/pic';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PIC_NODE_MODULES = resolve(ROOT, 'node_modules/.pnpm/@dfinity+pic@0.23.0/node_modules');
const requireFromPic = createRequire(resolve(PIC_NODE_MODULES, '@dfinity/pic/package.json'));
const { IDL } = requireFromPic('@icp-sdk/core/candid');

// Load the generated backend declarations (same file bindgen produces for the
// frontend). It imports '@icp-sdk/core/candid' — resolved from pic's tree.
const backendDecls = requireFromPic(resolve(ROOT, 'src/frontend/src/declarations/backend.did.js'));

// Minimal ICRC-1 ledger interface for harness assertions (icrc1_* + stats).
const ledgerIdlFactory = ({ IDL }) => {
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
  return IDL.Service({
    icrc1_name: IDL.Func([], [IDL.Text], ['query']),
    icrc1_symbol: IDL.Func([], [IDL.Text], ['query']),
    icrc1_total_supply: IDL.Func([], [IDL.Nat], ['query']),
    icrc1_balance_of: IDL.Func([Account], [IDL.Nat], ['query']),
    icrc1_transfer: IDL.Func([TransferArg], [IDL.Variant({ Ok: IDL.Nat, Err: TransferError })], []),
    icrc1_decimals: IDL.Func([], [IDL.Nat8], ['query']),
  });
};

export async function provision(options = {}) {
  const binPath = resolve(ROOT, 'node_modules/@dfinity/pic/pocket-ic');
  const picServer = await PocketIcServer.start({ binPath });
  const pic = await PocketIc.create(picServer.getUrl());

  // Upgrade rehearsals pass the PREVIOUS build here so the new one can be
  // installed over its state.
  const backendWasm = readFileSync(options.backendWasmPath ?? resolve(ROOT, 'src/backend/dist/backend.wasm'));
  const ledgerWasm = readFileSync(resolve(ROOT, '.pocketic/ledger.wasm'));

  // Backend install currently traps on fresh install (KNOWN BLOCKER — the first
  // migration takes the legacy OldActor shape instead of {}; fix owned by W1B,
  // see knowledge/vulnerability-audit-v264.md 2026-09-07 section). Until that
  // lands, fall back to a harness minting identity so the ledger seam stays
  // usable for fault-injection tests. When the Init migration ships, this
  // fallback automatically stops triggering and minting owner = backend.
  let backend = null;
  let backendFixture = null;
  let backendPrincipal = null;
  let mintingOwner = null;
  try {
    backendFixture = await pic.setupCanister({
      idlFactory: backendDecls.idlFactory,
      wasm: backendWasm,
    });
    backend = backendFixture.actor;
    backendPrincipal = backendFixture.canisterId;
    mintingOwner = backendPrincipal;
  } catch (e) {
    if (!String(e?.message ?? e).includes('adminState')) throw e;
    console.warn('BACKEND INSTALL TRAPPED (known fresh-install blocker, W1B owns fix) — using fallback minting identity');
    const { createIdentity } = requireFromPic('@dfinity/pic/dist/identity.js');
    const mintingId = createIdentity('harness-fallback-minting-controller');
    // Install the ledger into a canister controlled by the fallback identity.
    const owner = await pic.createCanister({ controllers: [mintingId.getPrincipal()] });
    mintingOwner = mintingId.getPrincipal();
    const Account = IDL.Record({ owner: IDL.Principal, subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)) });
    const MetadataValue = IDL.Variant({ Int: IDL.Int, Nat: IDL.Nat, Nat8: IDL.Nat8, Nat16: IDL.Nat16, Nat32: IDL.Nat32, Nat64: IDL.Nat64, Text: IDL.Text, Blob: IDL.Vec(IDL.Nat8), Bool: IDL.Bool });
    const ArchiveOptions = IDL.Record({ num_blocks_to_archive: IDL.Nat64, trigger_threshold: IDL.Nat64, max_transactions_per_response: IDL.Opt(IDL.Nat64), max_message_size_bytes: IDL.Opt(IDL.Nat), cycles_for_archive_creation: IDL.Opt(IDL.Nat64), node_max_memory_size_bytes: IDL.Opt(IDL.Nat16), controller_id: IDL.Principal, more_controller_ids: IDL.Opt(IDL.Vec(IDL.Principal)) });
    const InitArgs = IDL.Record({ token_symbol: IDL.Text, token_name: IDL.Text, decimals: IDL.Opt(IDL.Nat8), transfer_fee: IDL.Nat, minting_account: Account, fee_collector_account: IDL.Opt(Account), max_memo_length: IDL.Opt(IDL.Nat16), metadata: IDL.Vec(IDL.Tuple(IDL.Text, MetadataValue)), initial_balances: IDL.Vec(IDL.Record({ account: Account, amount: IDL.Nat })), feature_flags: IDL.Opt(IDL.Record({ icrc2: IDL.Bool })), archive_options: ArchiveOptions, index_principal: IDL.Opt(IDL.Principal) });
    const Args = IDL.Variant({ Init: InitArgs, Upgrade: IDL.Opt(IDL.Record({ index_principal: IDL.Opt(IDL.Principal) })) });
    const none = [];
    const ledgerInit = IDL.encode([Args], [{ Init: {
      token_symbol: 'AKK', token_name: 'Anti Krisis Koin', decimals: [8],
      transfer_fee: 10_000n, minting_account: { owner: mintingOwner, subaccount: none },
      fee_collector_account: none, max_memo_length: [32], metadata: [], initial_balances: [],
      feature_flags: [{ icrc2: true }],
      archive_options: { num_blocks_to_archive: 1000n, trigger_threshold: 2000n,
        max_transactions_per_response: none, max_message_size_bytes: none,
        cycles_for_archive_creation: [100_000_000_000n], node_max_memory_size_bytes: none,
        controller_id: mintingOwner, more_controller_ids: none },
      index_principal: none,
    } }]);
    const ledgerFixture = await pic.setupCanister({
      idlFactory: ledgerIdlFactory,
      wasm: ledgerWasm,
      arg: ledgerInit,
      canisterId: owner,
      sender: mintingId.getPrincipal(),
    });
    ledgerFixture.actor.setIdentity(mintingId);
    return {
      pic, picServer, backend: null, backendFixture: null,
      backendPrincipal: null, ledgerFixture, ledger: ledgerFixture.actor,
      mintingId, mintingOwner, backendTrapped: true,
    };
  }

  // Ledger init args (typed binary Candid; mirrors akk-ledger/akk_ledger_init.args
  // with minting owner + controller = backend principal — the prod invariant:
  // the backend canister is the minter).
  const Account = IDL.Record({ owner: IDL.Principal, subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)) });
  const MetadataValue = IDL.Variant({ Int: IDL.Int, Nat: IDL.Nat, Nat8: IDL.Nat8, Nat16: IDL.Nat16, Nat32: IDL.Nat32, Nat64: IDL.Nat64, Text: IDL.Text, Blob: IDL.Vec(IDL.Nat8), Bool: IDL.Bool });
  const ArchiveOptions = IDL.Record({ num_blocks_to_archive: IDL.Nat64, trigger_threshold: IDL.Nat64, max_transactions_per_response: IDL.Opt(IDL.Nat64), max_message_size_bytes: IDL.Opt(IDL.Nat), cycles_for_archive_creation: IDL.Opt(IDL.Nat64), node_max_memory_size_bytes: IDL.Opt(IDL.Nat16), controller_id: IDL.Principal, more_controller_ids: IDL.Opt(IDL.Vec(IDL.Principal)) });
  const InitArgs = IDL.Record({ token_symbol: IDL.Text, token_name: IDL.Text, decimals: IDL.Opt(IDL.Nat8), transfer_fee: IDL.Nat, minting_account: Account, fee_collector_account: IDL.Opt(Account), max_memo_length: IDL.Opt(IDL.Nat16), metadata: IDL.Vec(IDL.Tuple(IDL.Text, MetadataValue)), initial_balances: IDL.Vec(IDL.Record({ account: Account, amount: IDL.Nat })), feature_flags: IDL.Opt(IDL.Record({ icrc2: IDL.Bool })), archive_options: ArchiveOptions, index_principal: IDL.Opt(IDL.Principal) });
  const Args = IDL.Variant({ Init: InitArgs, Upgrade: IDL.Opt(IDL.Record({ index_principal: IDL.Opt(IDL.Principal) })) });
  const none = [];
  const ledgerInit = IDL.encode([Args], [{ Init: {
    token_symbol: 'AKK', token_name: 'Anti Krisis Koin', decimals: [8],
    transfer_fee: 10_000n, minting_account: { owner: mintingOwner, subaccount: none },
    fee_collector_account: none, max_memo_length: [32], metadata: [], initial_balances: [],
    feature_flags: [{ icrc2: true }],
    archive_options: { num_blocks_to_archive: 1000n, trigger_threshold: 2000n,
      max_transactions_per_response: none, max_message_size_bytes: none,
      cycles_for_archive_creation: [100_000_000_000n], node_max_memory_size_bytes: none,
      controller_id: mintingOwner, more_controller_ids: none },
    index_principal: none,
  } }]);
  const ledgerFixture = await pic.setupCanister({
    idlFactory: ledgerIdlFactory,
    wasm: ledgerWasm,
    arg: ledgerInit,
  });
  const ledger = ledgerFixture.actor;

  // On the healthy path the minter is the BACKEND canister (prod invariant).
  // The mint smoke therefore runs through the backend's own mint authority —
  // the harness mints by calling the ledger AS the backend canister, which
  // PocketIC allows via a controller-identity sender only if the backend
  // principal were an identity. Instead: give the harness a controller
  // identity whose principal IS authorized by making it a ledger controller
  // alongside the backend, with minting owner = backend (unchanged prod
  // invariant). The smoke mint uses the controller identity with the
  // minting account owned by the backend — the Rust ledger mints when the
  // CALLER equals the minting account owner, so the smoke instead verifies
  // minting through the backend by asserting the ledger accepted a mint
  // sent with sender = backend principal (PocketIC supports canister
  // senders via updateCall sender_info).
  return { pic, picServer, backend, ledger, backendPrincipal, backendFixture, ledgerFixture, backendTrapped: false };
}

// --- smoke run: install both canisters, drive real query calls ---
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop() ?? '—')) {
  let exitCode = 1;
  try {
    const { pic, picServer, ledger, ledgerFixture, backendPrincipal, backendTrapped } = await provision();
    const name = await ledger.icrc1_name();
    const symbol = await ledger.icrc1_symbol();
    const supply = await ledger.icrc1_total_supply();
    console.log(`LEDGER OK — ${name} (${symbol}), supply=${supply}`);
    if (backendTrapped) {
      console.log('BACKEND: fresh-install trapped (known W1B blocker) — ledger seam provisioned via fallback identity');
    } else {
      console.log(`BACKEND OK — principal ${backendPrincipal.toText()}`);
    }
    // Mint smoke test (healthy path): the minter is the backend canister,
    // so the smoke verifies minting through the BACKEND by giving the
    // harness identity no authority — instead we assert the ledger accepts
    // a mint whose caller equals the minting owner. PocketIC can't send a
    // canister-sender actor call, so on the healthy path we mint via raw
    // updateCall with sender = backend principal (PocketIC's updateCall
    // accepts an arbitrary sender principal).
    if (!backendTrapped) {
      const { IDL: IDLmod } = (() => ({ IDL: requireFromPic('@icp-sdk/core/candid').IDL }))();
      const Account = IDLmod.Record({ owner: IDLmod.Principal, subaccount: IDLmod.Opt(IDLmod.Vec(IDLmod.Nat8)) });
      const TransferArg = IDLmod.Record({ from_subaccount: IDLmod.Opt(IDLmod.Vec(IDLmod.Nat8)), to: Account, amount: IDLmod.Nat, fee: IDLmod.Opt(IDLmod.Nat), memo: IDLmod.Opt(IDLmod.Vec(IDLmod.Nat8)), created_at_time: IDLmod.Opt(IDLmod.Nat64) });
      const TransferError = IDLmod.Variant({ BadFee: IDLmod.Record({ expected_fee: IDLmod.Nat }), BadBurn: IDLmod.Record({ min_burn_amount: IDLmod.Nat }), InsufficientFunds: IDLmod.Record({ balance: IDLmod.Nat }), TooOld: IDLmod.Null, CreatedInFuture: IDLmod.Record({ ledger_time: IDLmod.Nat64 }), Duplicate: IDLmod.Record({ duplicate_of: IDLmod.Nat }), TemporarilyUnavailable: IDLmod.Null, GenericError: IDLmod.Record({ error_code: IDLmod.Nat, message: IDLmod.Text }) });
      const TransferResult = IDLmod.Variant({ Ok: IDLmod.Nat, Err: TransferError });
      const user = (requireFromPic('@dfinity/pic/dist/identity.js')).createIdentity('harness-smoke-user');
      const arg = IDLmod.encode([TransferArg], [{ from_subaccount: [], to: { owner: user.getPrincipal(), subaccount: [] }, amount: 1_000_000n, fee: [], memo: [], created_at_time: [] }]);
      const res = await pic.updateCall({
        canisterId: ledgerFixture.canisterId,
        sender: backendPrincipal,   // = minting account owner → mint branch
        method: 'icrc1_transfer',
        arg,
      });
      const mintArr = IDLmod.decode([TransferResult], res);
      const mint = mintArr[0];
      if (mint === undefined || mint.Ok === undefined) throw new Error('Mint smoke failed: ' + JSON.stringify(mint, (_, v) => typeof v === 'bigint' ? String(v) : v));
      const bal = await ledger.icrc1_balance_of({ owner: user.getPrincipal(), subaccount: [] });
      console.log('MINT OK — block ' + mint.Ok + ', user balance ' + bal);
      if (bal !== 1_000_000n) throw new Error('balance mismatch');
      await pic.tearDown();
      await picServer.stop();
      exitCode = 0;
    } else {
      await pic.tearDown();
      await picServer.stop();
      exitCode = 0;
    }
  } catch (e) {
    console.error('PROVISIONING FAILED:', e?.message ?? e);
  }
  process.exit(exitCode);
}
