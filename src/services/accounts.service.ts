import fetch from 'cross-fetch'
import { ApolloClient, InMemoryCache, gql, HttpLink, ApolloQueryResult } from '@apollo/client/core'
import * as dotenv from 'dotenv'
dotenv.config()

export interface Token {
  id: string
  symbol: string
  jTokenBalance: number
  borrowBalanceUnderlying: number
  supplyBalanceUnderlying: number
  market: Market
  enteredMarket: boolean
}

interface Market {
  id: string
  underlyingPriceUSD: number
}

export interface Account {
  id: string
  tokens: Token[]
  hasBorrowed: boolean
  health: number
  totalBorrowValueInUSD: number
  totalCollateralValueInUSD: number
}

const client = new ApolloClient({
  link: new HttpLink({ uri: process.env.THEGRAPH_BASE_URL, fetch }),
  cache: new InMemoryCache(),
})

export function fetchAccounts(health_lt: number) {
  const accountsQuery = `
  {
    accounts(where: { health_lt: ${health_lt}, totalBorrowValueInUSD_gt: 0 }, orderBy: health, orderDirection: asc) {
      id
      tokens {
        id
        symbol
        jTokenBalance
        borrowBalanceUnderlying
        supplyBalanceUnderlying
        enteredMarket
        market {
          id
          underlyingPriceUSD
        }
      }
      hasBorrowed
      health
      totalBorrowValueInUSD
      totalCollateralValueInUSD
    }
  }
  `
  
  return client
    .query({
      query: gql(accountsQuery),
    })
    .then((result: ApolloQueryResult<{ accounts: Account[] }>) => result.data.accounts)
    .catch((err) => {
      console.log('Error fetching data: ', err)
      return Promise.reject(err)
    })
}