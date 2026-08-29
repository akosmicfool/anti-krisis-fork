# FeeCollector — CREATE2 Deployment Guide (AKK-4 Option B)

**Status: DEPLOYED + VERIFIED on all four chains (2026-08-28).** Identical
907-byte runtime bytecode at the expected address on ethereum, base, optimism,
celo; `owner()` returns `0x66Cc129C0f758B52d561F0bD2AC8ECf37f19C052` everywhere
(verified via each chain's public RPC, sha256 of deployed code identical).

## What deploys

`contracts/FeeCollector.sol` (Solidity 0.8.24, optimizer 200 runs) — compiled
artifacts in `/tmp/solc-build/FeeCollector.json` (regenerate:
`npm i solc@0.8.24` + compile script in session notes; init code is embedded in
the deploy data below, which is the only thing the factory needs).

## Deployment mechanism

Canonical deterministic-deployment proxy factory (Arachnid, no owner, no
constructor, never re-deployable):

```
0x4e59b44847b379578588920cA78FbF26c0B4956C
```

**Verified live on all four chains** (2026-08-28, `eth_getCode` ≠ empty):
ethereum (publicnode), base (mainnet.base.org), optimism (mainnet.optimism.io),
celo (forno.celo.org).

Send ONE transaction per chain:

- `to`: the factory address above
- `value`: 0
- `data`: the deploy data (salt ++ constructor-patched creation code)

The factory executes `init_code`, which runs the FeeCollector constructor and
RE-DIRECTS the created contract to the given salt — same data ⇒ same address
on every chain. No custom factory, no per-chain salt bookkeeping.

## Prepared values (owner = current fee EOA)

| Field | Value |
|---|---|
| Salt (ASCII) | `anti-krisis-fee-collector-v1` |
| Salt (hex, keccak of ASCII) | `0x510c4acc617c59d4878bd3699fb368c2149cfc1e1ef372cab53ad8795583f6216` |
| Initial owner | `0x66Cc129C0f758B52d561F0bD2AC8ECf37f19C052` (current fee recipient EOA) |
| **Expected address (ALL chains)** | `0x6cBB624D23eeeFd23c7F02912F7F35129174aCD2` |
| Init code hash | `0xbd3d3f91b7104811cc5e9ca9c72f49cc40cfdef0a7ecf42a1c4311306a488f3e` |
| FeePaid topic0 | `0x6306705606f6bb80eb21422af69622d33b086a84411f822776f54f64b5daa027` — keccak of `FeePaid(address,bytes,uint256)`; confirmed against a live receipt from the deployed collector (`0xd1536a6c…3970a` on Base). NOTE: an earlier revision of this doc and of the backend constant carried the phantom hash of `FeePaid(address,address,bytes,uint256)` (`0x35f4df2d…`) — wrong; fixed 2026-08-28. |
| Deploy data | see `deploy-data.txt` (next to this file) — 1192 bytes: salt ++ initCode |

If the initial owner should differ, the deploy data (and expected address)
must be recomputed — the address depends on every byte.

## Deploy steps (per chain: Base 8453, Ethereum 1, Optimism 10, Celo 42220)

1. Switch wallet to the chain.
2. Paste the deploy data as hex data, recipient = factory, value = 0. (In
   Rabby/MetaMask: "Send to contract" / raw data field.)
3. After mining, verify: `eth_getCode(0x6cBB…aCD2)` non-empty, and the
   contract's `owner()` returns `0x66Cc…C052`.
4. Repeat until all four chains show identical code at the identical address.

## After ALL chains are deployed (admin panel)

1. **Set Fee Recipient** → `0x6cBB624D23eeeFd23c7F02912F7F35129174aCD2`
   (fee txs now go to the collector; wallets accept calldata to a contract).
2. **Set Fee Collector Address** → same address.
3. **Arm FeePaid Check** → ON. From this point the backend additionally
   requires a `FeePaid` event from the collector inside every fee receipt.
   Do NOT arm before step 1+2 are done on the live config — arming early
   fails every claim (retriable PENDING, claims eventually age out).

Rollback: disarm the check (admin toggle) — instantly back to v279 semantics.

## Phase 2 notes (agreed, not in this PR)

- Owner transfer: `transferOwnership(canisterTecdsaAddress)` — no redeploy,
  address (and therefore chain config) never changes.
- Future chains: repeat the same deploy data on the new chain; add the chain
  to the allowlist only after the collector exists there.
