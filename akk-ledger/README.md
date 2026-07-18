# AKK ICRC-1 Ledger (mainnet)

External ledger for Anti Krisis (fork), minted by the Caffeine app canister.

| Field | Value |
|-------|--------|
| Ledger canister | `lsmvv-rqaaa-aaaai-ax2cq-cai` |
| Token name | Anti Krisis Koin |
| Symbol | AKK |
| Decimals | 8 |
| Transfer fee | 10_000 e8s |
| Minting account | `g4i7o-xaaaa-aaaau-ag3bq-cai` (app backend) |
| Controller | `akk-deployer` (`wtghr-y4d6x-mncok-76fms-habs7-tmk5s-cn2xl-vfd26-hcz4q-tv7p3-hae`) |
| Wasm release | `ledger-suite-icrc-2026-03-09` |
| Standards | ICRC-1 + ICRC-2 |

## Wire into the app

Admin Panel → Protocol Settings → AKK Ledger Canister → paste:

```
lsmvv-rqaaa-aaaai-ax2cq-cai
```

Backend validates `icrc1_name == "Anti Krisis Koin"` and minting owner == app principal.

## Redeploy

```bash
cd akk-ledger
export PATH="$HOME/.hermes/node/bin:$PATH"
icp deploy akk_ledger -e ic -y --cycles 3000000000000
```

Init args are in `akk_ledger_init.args` (minting account must stay the live app principal).
