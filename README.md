# Trader Joe lending monitoring

## Commands

### Run the application
```
npm run start
```

### Print low health accounts 
```
npm run print
```

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
