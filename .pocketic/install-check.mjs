/**
 * Fresh-install check: does a given backend wasm install cleanly onto EMPTY
 * state via a plain `install_code` (no Caffeine pipeline)?
 *
 * This is the W0 trap made regression-testable. The first migration in the
 * chain takes `{}` (the Motoko enhanced-migration contract for chain head), so
 * a build that instead expects the legacy OldActor shape traps during init with
 * "field 'adminState' expected but not found in state" — that would make a
 * disaster-recovery reinstall impossible, and it is exactly what the final prod
 * deployment (a fresh reinstall of ledger + backend) depends on.
 *
 * Also reports whether a wasm can be UPGRADED onto the state another build
 * created — used to rehearse migration-chain steps before pushing them.
 *
 * Run: node .pocketic/install-check.mjs [wasmPath ...]
 *   default: the local build (src/backend/dist/backend.wasm)
 */
import { PocketIc, PocketIcServer } from '@dfinity/pic';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const requireFromPic = createRequire(resolve(ROOT, 'node_modules/.pnpm/@dfinity+pic@0.23.0/node_modules/@dfinity/pic/package.json'));
const backendDecls = requireFromPic(resolve(ROOT, 'src/frontend/src/declarations/backend.did.js'));

const paths = process.argv.slice(2);
const wasmPaths = paths.length > 0 ? paths : [resolve(ROOT, 'src/backend/dist/backend.wasm')];
for (const p of wasmPaths) {
  if (!existsSync(p)) {
    console.error(`missing wasm: ${p}`);
    process.exit(2);
  }
}

const server = await PocketIcServer.start({ binPath: resolve(ROOT, 'node_modules/@dfinity/pic/pocket-ic') });
const pic = await PocketIc.create(server.getUrl());

let failed = 0;
try {
  let previous = null; // { label, canisterId } of a successfully installed build
  for (const p of wasmPaths) {
    const label = p.split('/').pop();
    const wasm = readFileSync(p);
    try {
      const fixture = await pic.setupCanister({ idlFactory: backendDecls.idlFactory, wasm });
      const tokens = await fixture.actor.getTokens();
      console.log(`FRESH INSTALL OK    ${label} — canister ${fixture.canisterId.toText()}, seeded tokens ${tokens.length}`);
      previous = { label, canisterId: fixture.canisterId };
    } catch (e) {
      const msg = String(e?.message ?? e).split('\n').find((l) => l.includes('field') || l.includes('trap')) ?? String(e?.message ?? e);
      console.log(`FRESH INSTALL TRAPS ${label} — ${msg.trim()}`);
      failed += 1;
      continue;
    }
  }

  // Upgrade rehearsal: install the FIRST build fresh, then upgrade in place
  // with the LAST one — exercising every migration-chain step between them.
  // Skipped (with a note) when the first build cannot install fresh: an old
  // artifact that traps on empty state cannot host the rehearsal.
  if (wasmPaths.length >= 2 && previous) {
    const first = wasmPaths[0];
    const last = wasmPaths[wasmPaths.length - 1];
    let fixture = null;
    try {
      fixture = await pic.setupCanister({ idlFactory: backendDecls.idlFactory, wasm: readFileSync(first) });
    } catch (e) {
      console.log(`UPGRADE SKIPPED     ${first.split('/').pop()} cannot install fresh — ${String(e?.message ?? e).split('\n')[0]}`);
      fixture = null;
    }
    if (fixture) {
      const before = await fixture.actor.getTokens();
      try {
        await pic.upgradeCanister({ canisterId: fixture.canisterId, wasm: readFileSync(last) });
        const after = await fixture.actor.getTokens();
        const info = await fixture.actor.getCurrentBlockInfo();
        const sameTokens = JSON.stringify(before) === JSON.stringify(after);
        console.log(`UPGRADE OK          ${first.split('/').pop()} -> ${last.split('/').pop()} — tokens ${before.length} -> ${after.length} (identical: ${sameTokens}), blockNumber=${info.blockNumber}`);
        if (!sameTokens) failed += 1;
      } catch (e) {
        console.log(`UPGRADE FAILS       ${first.split('/').pop()} -> ${last.split('/').pop()} — ${String(e?.message ?? e).split('\n')[0]}`);
        failed += 1;
      }
    }
  }

  console.log(failed === 0 ? '\nINSTALL CHECK PASSED' : `\nINSTALL CHECK: ${failed} FAILURE(S)`);
} finally {
  await pic.tearDown();
  await server.stop();
}
process.exit(failed === 0 ? 0 : 1);
