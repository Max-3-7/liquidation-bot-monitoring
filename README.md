# Trader Joe lending monitoring

Bot to monitor TraderJoe underwater accounts. 

It triggers the liquidate method of a contract when accounts with health lower than 1 are detected.

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
