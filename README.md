# Trader Joe Liquidation Bot

1. Identity underwater accounts (0 < health < 1) using subgraph: https://thegraph.com/hosted-service/subgraph/traderjoe-xyz/lending

Subscription to trigger smart contract function ?

2. Choose collateral to be seized

3. Flash loan (see Aave doc: https://docs.aave.com/developers/guides/flash-loans)

## Test

```
source .env

npx ganache-cli \
--fork https://mainnet.infura.io/v3/$WEB3_INFURA_PROJECT_ID \
--unlock $WETH_WHALE \
--unlock $DAI_WHALE \
--unlock $USDC_WHALE \
--unlock $USDT_WHALE \
--unlock $WBTC_WHALE \
--networkId 999
``