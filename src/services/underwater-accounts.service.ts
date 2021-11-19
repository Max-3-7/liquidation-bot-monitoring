import fetch from 'cross-fetch'
import { ApolloClient, InMemoryCache, gql, HttpLink, ApolloQueryResult } from '@apollo/client/core'

const apiUrl = 'https://api.thegraph.com/subgraphs/name/traderjoe-xyz/lending'

const accountsQuery = `
  {
    accounts(where: { health_gt: 0.0000000000000001, health_lt: 1, totalBorrowValueInUSD_gt: 0 }) {
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
        }
      }
      hasBorrowed
      health
      totalBorrowValueInUSD
      totalCollateralValueInUSD
    }
}
`

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

const response = [
  {
    hasBorrowed: true,
    health: 1.03836855184200967,
    id: '0x000000e28faa823d5b53ff6c2922c28335840375',
    tokens: [
      {
        borrowBalanceUnderlying: '0',
        id: '0x8b650e26404ac6837539ca96812f0123601e4448-0x000000e28faa823d5b53ff6c2922c28335840375',
        jTokenBalance: 8378.30917688,
        market: {
          id: '0x8b650e26404ac6837539ca96812f0123601e4448',
        },
        supplyBalanceUnderlying: 168.306191999988726634289512,
        symbol: 'jUSDT',
        enteredMarket: true,
      },
      {
        borrowBalanceUnderlying: 255984.9866746117749087573567332085,
        id: '0xed6aaf91a2b084bd594dbd1245be3691f9f637ac-0x000000e28faa823d5b53ff6c2922c28335840375',
        jTokenBalance: 16484622.571183,
        market: {
          id: '0xed6aaf91a2b084bd594dbd1245be3691f9f637ac',
        },
        supplyBalanceUnderlying: 331000.3222525106073053763832,
        symbol: 'jUSDC',
        enteredMarket: true,
      },
    ],
    totalBorrowValueInUSD: 255491.69214945627608,
    totalCollateralValueInUSD: 265294.53838489546448,
  },
]

const client = new ApolloClient({
  link: new HttpLink({ uri: apiUrl, fetch }),
  cache: new InMemoryCache(),
})

export function fetchUnderwaterAccounts() {
  return response as Account[]
  // return client
  //   .query({
  //     query: gql(accountsQuery),
  //   })
  //   .then((result: ApolloQueryResult<{ accounts: Account[] }>) => {
  //     const now = new Date()
  //     console.log(now.toLocaleString())
  //     const accounts = result.data.accounts
  //     console.log(`Found ${accounts.length} underwater accounts`)
  //     accounts.forEach((account) => {
  //       console.log(account)
  //       console.log(account.tokens)
  //       console.log('-------------')
  //     })
  //     return accounts
  //   })
  //   .catch((err) => {
  //     console.log('Error fetching data: ', err)
  //     return Promise.reject(err)
  //   })
}
