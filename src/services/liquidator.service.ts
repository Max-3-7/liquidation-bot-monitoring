import { fetchUnderwaterAccounts, Token, Account } from './underwater-accounts.service'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import TraderJoeLiquidatorABI from './../ABI/TraderJoeLiquidator.json'

// https://docs.traderjoexyz.com/main/contracts
enum ContractAddress {
  Joetroller = '0xdc13687554205E5b89Ac783db14bb5bba4A1eDaC',
  TraderJoeLiquidator = '0x0000000', // TODO
}

const web3 = new Web3('https://api.avax.network/ext/bc/C/rpc')
// const web3 = new Web3('https://api.avax-test.network/ext/bc/C/rpc')

export async function fetchUnderwaterAccountsAndLiquidate() {
  const underwaterAccounts = await fetchUnderwaterAccounts()
  console.log(underwaterAccounts)

  // if (underwaterAccounts.length === 0) {
  //   return
  // }

  underwaterAccounts.forEach((account) => liquidateUnderwaterAccount(account))
}

async function liquidateUnderwaterAccount(underwaterAccount: Account) {
  const borrower = underwaterAccount.id
  console.log(`Liquidating ${borrower}...`)

  console.log(underwaterAccount.tokens)

  const jTokens = getRepayAndCollateralJTokens(underwaterAccount)
  console.log(`[${borrower}] Will repay dept in ${jTokens.repay.symbol} and seize ${jTokens.collateral.symbol}`)

  await liquidate(borrower, jTokens.repay.market.id, jTokens.collateral.market.id)
}

export function getRepayAndCollateralJTokens(underwaterAccount: Account): { repay: Token; collateral: Token } {
  const jTokenWithHighestBorrowValue = underwaterAccount.tokens.reduce((p, c) =>
    getBorrowBalanceUnderlyingInUSD(p) > getBorrowBalanceUnderlyingInUSD(c) ? p : c
  )
  const jTokenCollateral = underwaterAccount.tokens
    .filter((token) => token.enteredMarket === true)
    .reduce((p, c) => (getSupplyBalanceUnderlyingInUSD(p) > getSupplyBalanceUnderlyingInUSD(c) ? p : c))

  return { repay: jTokenWithHighestBorrowValue, collateral: jTokenCollateral }
}

async function liquidate(borrower: string, jTokenRepay: string, jTokenCollateral: string) {
  const liquidator = new web3.eth.Contract(TraderJoeLiquidatorABI as AbiItem[], ContractAddress.TraderJoeLiquidator)
  const result = await liquidator.methods
    .liquidate(borrower, jTokenRepay, jTokenCollateral)
    .call() // TODO: call from owner account
    .catch((e) => {
      throw Error(`[${borrower}] Error : ${e.message}`)
    })

  console.log(result)

  console.log('\n')
}

function getSupplyBalanceUnderlyingInUSD(token: Token) {
  return token.supplyBalanceUnderlying * token.market.underlyingPriceUSD
}

function getBorrowBalanceUnderlyingInUSD(token: Token) {
  return token.borrowBalanceUnderlying * token.market.underlyingPriceUSD
}

// flash loan -> liquidate -> sell collateral -> repay flash loan

// liquidator is msg.sender
// call(from { account: })

// find a way to test the bot : local avax ? testnet ?

// le token liquidité est le token qui correspond au contract (jAvax ici par exemple)

// {
//         "health": "0",
//         "id": "0x00085a6b85b15e7a6bc9f4f4e937ba1709d5fc57",
//         "tokens": [
//           {
//             "accountBorrowIndex": "1",
//             "borrowBalanceUnderlying": "0",
//             "id": "0x585e7bc75089ed111b656faa7aeb1104f5b96c15-0x00085a6b85b15e7a6bc9f4f4e937ba1709d5fc57",
//             "jTokenBalance": "682.45270489",
//             "lifetimeBorrowInterestAccrued": "0",
//             "lifetimeSupplyInterestAccrued": "0.00000000000000000038510644",
//             "storedBorrowBalance": "0",
//             "supplyBalanceUnderlying": "13.65718372786542830438510644",
//             "symbol": "jLINK",
//             "totalUnderlyingBorrowed": "0",
//             "totalUnderlyingRedeemed": "0",
//             "totalUnderlyingRepaid": "0",
//             "totalUnderlyingSupplied": "13.657183727865428304"
//           },
//           {
//             "accountBorrowIndex": "1.0011269056631881",
//             "borrowBalanceUnderlying": "112.5030706387565780860473",
//             "id": "0x8b650e26404ac6837539ca96812f0123601e4448-0x00085a6b85b15e7a6bc9f4f4e937ba1709d5fc57",
//             "jTokenBalance": "0",
//             "lifetimeBorrowInterestAccrued": "0.1266376387565780860473",
//             "lifetimeSupplyInterestAccrued": "0",
//             "storedBorrowBalance": "112.376433",
//             "supplyBalanceUnderlying": "0",
//             "symbol": "jUSDT",
//             "totalUnderlyingBorrowed": "112.376433",
//             "totalUnderlyingRedeemed": "0",
//             "totalUnderlyingRepaid": "0",
//             "totalUnderlyingSupplied": "0"
//           }
//         ],
//         "totalBorrowValueInUSD": "0",
//         "totalCollateralValueInUSD": "0"
//       },

// accounts {
//     id
//     totalBorrowValueInUSD
//     totalCollateralValueInUSD
//     health
//     tokens {
//       id
//       symbol
//       jTokenBalance
//       totalUnderlyingSupplied
//       totalUnderlyingRedeemed
//       accountBorrowIndex
//       totalUnderlyingBorrowed
//       totalUnderlyingRepaid
//       storedBorrowBalance
//       supplyBalanceUnderlying
//       lifetimeSupplyInterestAccrued
//       borrowBalanceUnderlying
//       lifetimeBorrowInterestAccrued
//     }
//   }

// {
//   "data": {
//     "accounts": [
//       {
//         "id": "0x000000e28faa823d5b53ff6c2922c28335840375",
//         "tokens": [
//           {
//             "borrowBalanceUnderlying": "0",
//             "id": "0x8b650e26404ac6837539ca96812f0123601e4448-0x000000e28faa823d5b53ff6c2922c28335840375",
//             "jTokenBalance": "8378.30917688",
//             "market": {
//               "id": "0x8b650e26404ac6837539ca96812f0123601e4448"
//             },
//             "supplyBalanceUnderlying": "168.306191999988726634289512",
//             "symbol": "jUSDT"
//           },
//           {
//             "borrowBalanceUnderlying": "241000.341132535415953296708269059",
//             "id": "0xed6aaf91a2b084bd594dbd1245be3691f9f637ac-0x000000e28faa823d5b53ff6c2922c28335840375",
//             "jTokenBalance": "16484622.571183",
//             "market": {
//               "id": "0xed6aaf91a2b084bd594dbd1245be3691f9f637ac"
//             },
//             "supplyBalanceUnderlying": "331000.3222525106073053763832",
//             "symbol": "jUSDC"
//           }
//         ]
//       },
//       {
//         "id": "0x0044f0ab1281b2bc850bfa39123dec1e8e09001d",
//         "tokens": [
//           {
//             "borrowBalanceUnderlying": "0",
//             "id": "0x3fe38b7b610c0acd10296fef69d9b18eb7a9eb1f-0x0044f0ab1281b2bc850bfa39123dec1e8e09001d",
//             "jTokenBalance": "296.6896039",
//             "market": {
//               "id": "0x3fe38b7b610c0acd10296fef69d9b18eb7a9eb1f"
//             },
//             "supplyBalanceUnderlying": "5.9402805612665367663111622",
//             "symbol": "jWBTC"
//           },
//           {
//             "borrowBalanceUnderlying": "75683.65502760206588751939458248994",
//             "id": "0x8b650e26404ac6837539ca96812f0123601e4448-0x0044f0ab1281b2bc850bfa39123dec1e8e09001d",
//             "jTokenBalance": "0",
//             "market": {
//               "id": "0x8b650e26404ac6837539ca96812f0123601e4448"
//             },
//             "supplyBalanceUnderlying": "0",
//             "symbol": "jUSDT"
//           },
//           {
//             "borrowBalanceUnderlying": "0",
//             "id": "0x929f5cab61dfec79a5431a7734a68d714c4633fa-0x0044f0ab1281b2bc850bfa39123dec1e8e09001d",
//             "jTokenBalance": "828.80587074",
//             "market": {
//               "id": "0x929f5cab61dfec79a5431a7734a68d714c4633fa"
//             },
//             "supplyBalanceUnderlying": "16.59631317824022504712311486",
//             "symbol": "jWETH"
//           },
//           {
//             "borrowBalanceUnderlying": "0",
//             "id": "0xc22f01ddc8010ee05574028528614634684ec29e-0x0044f0ab1281b2bc850bfa39123dec1e8e09001d",
//             "jTokenBalance": "3984.35698004",
//             "market": {
//               "id": "0xc22f01ddc8010ee05574028528614634684ec29e"
//             },
//             "supplyBalanceUnderlying": "80.0341064562279828788921584",
//             "symbol": "jAVAX"
//           },
//           {
//             "borrowBalanceUnderlying": "465842.4116491527391777429265773191",
//             "id": "0xce095a9657a02025081e0607c8d8b081c76a75ea-0x0044f0ab1281b2bc850bfa39123dec1e8e09001d",
//             "jTokenBalance": "23242383.62580017",
//             "market": {
//               "id": "0xce095a9657a02025081e0607c8d8b081c76a75ea"
//             },
//             "supplyBalanceUnderlying": "465547.79199273262785264091035302",
//             "symbol": "jMIM"
//           },
//           {
//             "borrowBalanceUnderlying": "12029.20645866251650507251317319125",
//             "id": "0xed6aaf91a2b084bd594dbd1245be3691f9f637ac-0x0044f0ab1281b2bc850bfa39123dec1e8e09001d",
//             "jTokenBalance": "0",
//             "market": {
//               "id": "0xed6aaf91a2b084bd594dbd1245be3691f9f637ac"
//             },
//             "supplyBalanceUnderlying": "0",
//             "symbol": "jUSDC"
//           }
//         ]
//       }
//     ]
//   }
// }
