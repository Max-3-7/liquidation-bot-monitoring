# Trader Joe lending monitoring

1. Monitor underwater accounts via TraderJoe lending subgraph
2. Determine which assets to repay and seize
3. Trigger the liquidate method of a contract with three parameters : borrower address, asset to repay, asset to seize

## Commands

### Run the application
```
npm run start
```

### Print low health accounts 
```
npm run print
```
<img width="1303" alt="Screenshot 2021-12-17 at 23 10 04" src="https://user-images.githubusercontent.com/52084503/146613707-f22186c3-a06b-413a-b2d0-5dda2471d30e.png">


## Test

```
npm run test
```

## Configuration

### Environment variables

| ENV Variable                 | Description                                                                 |
| ---------------------------- | --------------------------------------------------------------------------- |
| PROVIDER_URL                 | Avalanche network URL                                                       |
| THEGRAPH_BASE_URL            | TraderJoe lending subgraph URL                                              |
| TRADERJOE_LIQUIDATOR_ADDRESS | Liquidator contract address                                                 |
| OWNER_PRIVATE_KEY            | Owner of TRADERJOE_LIQUIDATOR_ADDRESS                                       |
