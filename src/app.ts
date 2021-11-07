import { liquidate } from './services/liquidator.service'

setInterval(liquidate, 5 * 1000)

// TODO: https://www.apollographql.com/docs/react/data/subscriptions/