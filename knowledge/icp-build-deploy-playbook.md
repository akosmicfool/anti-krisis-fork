# ICP / Caffeine Build & Deploy Learnings — Anti Krisis

Verified 2026-08-27 against app version v264 (draft 264 deployed). Every entry below was
hit and resolved during real work sessions — not theory.

## Verified build/deploy chain (in order)

From repo root `~/Documents/Anti Krisis/AKOC/anti-krisis-fork`:

```bash
cd src/backend   && mops check --fix && mops build   # backend typecheck + wasm/.did
cd .. && pnpm bindgen                                # root script: regenerates frontend bindings from backend .did
cd src/frontend && pnpm typecheck                    # tsc over project
pnpm build                                           # production frontend bundle
caffeine preview --build --project .                 # cloud build + draft upload
```

- **Never** pipe `caffeine …` through `tail`/`head` — masks the real exit code (pipe returns
  last command's status). The repo once showed exit 0 while the upload had failed.
- Run bare commands in background shells for long builds (`preview --build` ≈ minutes).

## caffeine CLI (0.1.0-dev.x)

- **Upload cap: 20 MB compressed package.** Oversize fails SILENTLY on some versions
  (exit 1, no message) — always retry failures with `--json`:
  `caffeine preview --project . --json` surfaces structured errors like
  `"Packaged project is 30.8 MB compressed; the upload limit is 20.0 MB"`.
- Package includes everything not gitignored — audit for stray dirs before pushing
  (a stale root-level `frontend/` dir once added ~16 MB of orphaned media).
- Auth: device code flow works headlessly — `caffeine auth device start --json`, then
  approve via Caffeine MCP tool `caffeine_local_setup({userCode})`, then
  `caffeine auth device complete`.
- State/introspection: MCP `caffeine_show_project(projectId)` gives liveUrl/draftUrl,
  liveDraftId == lastDeployedDraftId when a push landed, plus last action summary
  ("Export to GitHub completed" = source of truth moved to GitHub main).
- **Verify pushes by artifact hash**, not exit codes: compare local
  `dist/index.html` asset filename (e.g. `index-BN7MaEY6.js`) vs
  `curl https://<draft-domain>` output. Also ~3s total runtime for a 20MB push =
  client-side rejection, real uploads take longer.
- Debugging flag: telemetry always logs success regardless; config at `~/.caffeine/`.

## Caffeine ↔ GitHub relationship

- Cloud "Export to GitHub" pushes to `akosmicfool/anti-krisis-fork` main — after an
  export, **GitHub main is the source of truth** and local clones should
  `git fetch && git reset --hard origin/main` to re-sync.
- Local edits go up only via `caffeine preview`; pulling from GitHub does not deploy.

## Motoko / icp-cli specifics

- `icp identity principal` (NOT `whoami` — that's dfx syntax) shows a keypair principal;
  CLI identities are **origin-independent** (survive domain moves), II principals are
  (anchor × origin)-bound — same anchor on a different site = different principal.
- ICRC-1 mint idempotency keys off `(caller, memo, created_at_time)` — sending
  `created_at_time = Time.now()` per attempt defeats dedup. Use deterministic values
  derived from business IDs if you want ledger-side duplicate protection.
- Motoko recurring timer callbacks do NOT serialize across runs: an async cycle that can
  exceed its interval overlaps itself. Long-await loops need an explicit
  `var processing : Bool` guard.
- Stable-compat matters: `mops check` runs a stable compatibility pass against the
  previous deployment shape — adding fields requires migration care
  (see `migration.mo`, enhanced-migration mode commits).

## Ops / process lessons

- **Kanban auto-dispatch is off by default now:** `kanban.dispatch_in_gateway: true`
  made gateway processes spawn workers every 60s and decompose seed tasks into dozens.
  Currently `false` in coding+marketer profiles — flip back ONLY when deliberate
  orchestration is wanted. Manual: `hermes kanban --board anti-krisis create/assign/dispatch`.
- One agent session = one git checkout (clone or worktree). Two agents in one tree caused
  branch-stacking, collided Caffeine draft pushes, and orphaned uncommitted changes.
- Before force-resets: `git bundle create backup.bundle --all` (verified 25MB bundle in $HOME)
  preserves every branch tip; stash keeps uncommitted work.
- Verify HTTP artifacts, not just exits: e.g. AKK entry chunk ~minified size post-build;
  grep bundles for removed endpoints to confirm regeneration.

## Security-relevant conventions

- Bootstrap admin must be a hardcoded non-placeholder principal at build time
  (`main.mo`) — placeholder `"aaaaa-aa"` re-enables open admin claiming endpoints.
  Real value in use since PR #2.
- Audit reference docs live in `knowledge/vulnerability-audit-v264.md` with repro paths
  and fix sketches per finding.
