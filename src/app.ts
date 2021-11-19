import { fetchUnderwaterAccountsAndLiquidate } from './services/liquidator.service'

setInterval(fetchUnderwaterAccountsAndLiquidate, 5 * 1000)

// TODO: https://www.apollographql.com/docs/react/data/subscriptions/
