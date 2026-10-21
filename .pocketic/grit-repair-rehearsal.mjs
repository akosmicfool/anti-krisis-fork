/**
 * Upgrade rehearsal for the 2026-10-20 GRIT issuance-rate incident.
 *
 * Sequence (mirrors production exactly):
 *   1. install the PRE-FIX wasm (v379, unconditional 1T boot seed)
 *   2. owner sets 100B, then locks with setLaunched()
 *   3. upgrade the canister with the SAME pre-fix wasm — this is what every
 *      Caffeine push/promotion did; the boot seed stomps 100B -> 1T
 *   4. assert the bug reproduces (1T, still launched)
 *   5. upgrade with the FIXED wasm
 *   6. assert the one-time repair lands 100B and the launch flag survives
 *
 * Run: node .pocketic/grit-repair-rehearsal.mjs <old.wasm> <new.wasm>
 */
import { PocketIc, PocketIcServer } from "@dfinity/pic";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requireFromPic = createRequire(
  resolve(
    ROOT,
    "node_modules/.pnpm/@dfinity+pic@0.23.0/node_modules/@dfinity/pic/package.json",
  ),
);
const backendDecls = requireFromPic(
  resolve(ROOT, "src/frontend/src/declarations/backend.did.js"),
);
const { Principal } = requireFromPic("@dfinity/principal");

const [oldWasmPath, newWasmPath] = process.argv.slice(2);
const oldWasm = readFileSync(oldWasmPath);
const newWasm = readFileSync(newWasmPath);

const LAUNCH = 100_000_000_000n;
const LEGACY = 1_000_000_000_000n;

const server = await PocketIcServer.start({
  binPath: resolve(ROOT, "node_modules/@dfinity/pic/pocket-ic"),
});
const pic = await PocketIc.create(server.getUrl());

let failures = 0;
const assert = (cond, msg, detail = "") => {
  if (cond) {
    console.log(`  PASS ${msg}`);
  } else {
    failures += 1;
    console.log(`  FAIL ${msg}${detail ? ` — ${detail}` : ""}`);
  }
};

try {
  const fixture = await pic.setupCanister({
    idlFactory: backendDecls.idlFactory,
    wasm: oldWasm,
  });
  const actor = fixture.actor;
  // main.mo seeds this principal as the sole admin on a fresh canister.
  actor.setPrincipal(
    Principal.fromText(
      "wtghr-y4d6x-mncok-76fms-habs7-tmk5s-cn2xl-vfd26-hcz4q-tv7p3-hae",
    ),
  );
  // Enhanced orthogonal persistence requires the explicit keep option.
  const upgrade = (wasm) =>
    pic.upgradeCanister({
      canisterId: fixture.canisterId,
      wasm,
      upgradeModeOptions: {
        skip_pre_upgrade: [],
        wasm_memory_persistence: [{ keep: null }],
      },
    });
  const rate = async () => (await actor.getGritIssuanceRate()).toString();
  const launched = async () => actor.getIsLaunched();

  console.log("1) fresh install of the pre-fix wasm");
  assert((await rate()) === LEGACY.toString(), "pre-fix boot seeds 1T", await rate());
  assert((await launched()) === false, "not launched");

  console.log("2) admin sets 100B and locks");
  await actor.setGritIssuanceRate(LAUNCH);
  assert((await rate()) === LAUNCH.toString(), "setter stores 100B", await rate());
  await actor.setLaunched();
  assert((await launched()) === true, "isLaunched = true");

  console.log("3) a push/promotion upgrades with the SAME pre-fix wasm");
  await upgrade(oldWasm);
  const stomped = await rate();
  assert(
    stomped === LEGACY.toString(),
    "BUG REPRODUCED: locked 100B was rewritten to 1T",
    `got ${stomped}`,
  );
  assert((await launched()) === true, "launch lock survived the stomp");

  console.log("4) admin tries to set it back — must be refused");
  let refused = false;
  try {
    await actor.setGritIssuanceRate(LAUNCH);
  } catch (e) {
    refused = /locked at launch/i.test(String(e?.message ?? e));
  }
  assert(refused, "setGritIssuanceRate still traps once launched");
  assert((await rate()) === LEGACY.toString(), "rate unchanged after refusal");

  console.log("5) upgrade with the FIXED wasm");
  await upgrade(newWasm);
  const repaired = await rate();
  assert(
    repaired === LAUNCH.toString(),
    "REPAIRED: one-time boot repair restored 100B",
    `got ${repaired}`,
  );
  assert((await launched()) === true, "launch lock still true");

  // A separate canister: PocketIC rate-limits a 3rd install_code on the same
  // one. Proves the guarded seed and repair are idempotent across upgrades.
  console.log("6) fixed code on a fresh canister: seeds 100B, no drift on upgrade");
  const fresh = await pic.setupCanister({
    idlFactory: backendDecls.idlFactory,
    wasm: newWasm,
  });
  fresh.actor.setPrincipal(
    Principal.fromText(
      "wtghr-y4d6x-mncok-76fms-habs7-tmk5s-cn2xl-vfd26-hcz4q-tv7p3-hae",
    ),
  );
  const freshRate = async () =>
    (await fresh.actor.getGritIssuanceRate()).toString();
  assert((await freshRate()) === LAUNCH.toString(), "fresh install seeds 100B", await freshRate());
  await pic.upgradeCanister({
    canisterId: fresh.canisterId,
    wasm: newWasm,
    upgradeModeOptions: {
      skip_pre_upgrade: [],
      wasm_memory_persistence: [{ keep: null }],
    },
  });
  assert((await freshRate()) === LAUNCH.toString(), "still 100B after upgrade", await freshRate());

  console.log(failures === 0 ? "\nREHEARSAL PASSED" : `\nREHEARSAL: ${failures} FAILURE(S)`);
} finally {
  await pic.tearDown();
  await server.stop();
}
process.exit(failures === 0 ? 0 : 1);
