# Project Guidance

## User Preferences

[No preferences yet]

## Verified Commands

**Frontend** (run from `src/frontend/`):

- **install**: `pnpm install --prefer-offline`
- **typecheck**: `pnpm typecheck`
- **lint fix**: `pnpm fix`
- **build**: `pnpm build`

**Backend** (run from repo root — `mops.toml` lives there; running from `src/backend/` breaks the local `vendor/array` path resolution):

- **install**: `mops install`
- **typecheck**: `mops check --fix`
- **build**: `mops build`

**Backend and frontend integration** (run from root):

- **generate bindings**: `pnpm bindgen` This step is necessary to ensure the frontend can call the backend methods.

## Learnings

- **Worktrees can go stale — always check before building.** A kanban/Caffeine
  worktree may sit many commits behind `origin/main` (this one was 15 behind,
  missing all shipped security fixes). First command in any task:
  `git fetch origin && git rev-list --count HEAD..origin/main` — if behind and
  the branch has no unique commits, `git merge --ff-only origin/main`. Verify
  expected symbols actually exist (e.g. `grep verifyFeeBinding`) before coding.
- **Transient actor vars are excluded from the stable layout.** Under
  `--default-persistent-actors` (Caffeine Motoko builds), a `transient var` at
  actor scope never persists and re-initializes on every upgrade — the correct
  tool for in-flight runtime flags (reentrancy guards). No migration-chain
  entry needed; `mops check` stable-compat confirms.
- **`mops test` layout**: `mo:test` has sync (`mo:test`) and async
  (`mo:test/async`) variants; async tests take `func() : async ()`. Option
  matchers need comparators: `Test.expect.option(x, T.toText, T.equal).equal(?y)`.
  Tests live in `src/backend/test/*.test.mo`, run from repo root.
- **pnpm 11 build-script policy**: a new dep with scripts (e.g. `@dfinity/pic`
  via the Caffeine template) blocks `pnpm install` until allowed in
  `pnpm-workspace.yaml` `allowBuilds`. Set `false` for unused dev-only deps.
- **Local `pnpm build` (vite) deletes the tracked
  `src/frontend/dist/.build-checksums.json`** that Caffeine's cloud build owns.
  Restore it (`git checkout --`) before committing; the commit should never
  include frontend dist churn from a local backend-only task.
- **`mo:test` has no clock.** `Time.now()` returns 0 under the test runtime, so
  timestamp-derivation tests must assert *which anchor* was used (compare
  against the same derivation), never an absolute value. PocketIC likewise does
  NOT run on the host clock — it starts at 2021 unless advanced, so host-clock
  `created_at_time` values are rejected `#CreatedInFuture`; read `pic.getTime()`.
- **`mops check` migration chain needs `check-limit` ≥ pending steps.** With
  `check-limit = 1` a second pending migration only warns and the earlier step
  goes unvalidated; the tool then advises folding — which is WRONG once a
  canister has already applied the earlier step (its next upgrade would find no
  matching input shape). Raise the limit to the real pending count instead.
- **PocketIC is the cheapest way to measure a canister's own call cost** —
  `.pocketic/drain-timing.mjs` runs the exact call sequence with
  `sender = <canister principal>`, which is the only faithful way to time a
  backend→ledger path. Local numbers are a floor; pair them with real mainnet
  round trips (`date +%s%N` around `icp canister call`) before concluding.
- **Never put a commit message with backticks through `git commit -m "..."`.**
  Bash performs command substitution inside double quotes, so backticked words
  (type names, code fragments) get executed, the message is silently corrupted,
  and stray files can appear in the repo root. Write the message to a file with
  `write_file`/python and use `git commit -F <file>`.
