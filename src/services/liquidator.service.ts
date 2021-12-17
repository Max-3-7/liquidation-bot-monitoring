import { fetchAccounts, Token, Account } from './accounts.service'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import TraderJoeLiquidatorABI from './../ABI/avalanche/TraderJoeLiquidator.json'
import * as dotenv from 'dotenv'
dotenv.config()

const web3 = new Web3(process.env.PROVIDER_URL)

export async function fetchUnderwaterAccountsAndLiquidate() {
  const health_lt = 1
  const underwaterAccounts = await fetchAccounts(health_lt)

  if (underwaterAccounts.length === 0) {
    return
  }

  underwaterAccounts.forEach((account) => liquidateUnderwaterAccount(account))
}

export async function liquidateUnderwaterAccount(underwaterAccount: Account) {
  const borrower = underwaterAccount.id
  const jTokens = getRepayAndCollateralJTokens(underwaterAccount)
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
  console.log(`Liquidating ${borrower}, will repay ${jTokenRepay} and seize ${jTokenCollateral}`)

  const owner = web3.eth.accounts.privateKeyToAccount(process.env.OWNER_PRIVATE_KEY)
  const liquidator = new web3.eth.Contract(TraderJoeLiquidatorABI as AbiItem[], process.env.TRADERJOE_LIQUIDATOR_ADDRESS, { from: owner.address })
  const result = await liquidator.methods
    .liquidate(borrower, jTokenRepay, jTokenCollateral)
    .call()
    .catch((e) => console.error(e))

  console.log(result)
  console.log('\n')
}

function getSupplyBalanceUnderlyingInUSD(token: Token) {
  return token.supplyBalanceUnderlying * token.market.underlyingPriceUSD
}

function getBorrowBalanceUnderlyingInUSD(token: Token) {
  return token.borrowBalanceUnderlying * token.market.underlyingPriceUSD
}

export async function printAccountsWithLowHealth() {
  const accounts = await fetchAccounts(1.3)
  const formattedAccounts = accounts.map((account) => {
    const jTokens = getRepayAndCollateralJTokens(account)
    return {
      "Borrower": account.id,
      "Health": Number(account.health).toFixed(3),
      "Asset to repay": jTokens.repay.symbol,
      "Borrow amount in USD": Number(jTokens.repay.borrowBalanceUnderlying * jTokens.repay.market.underlyingPriceUSD).toFixed(3),
      "Collateral asset to seize": jTokens.collateral.symbol,
      "Supply amount in USD": Number(jTokens.collateral.supplyBalanceUnderlying * jTokens.collateral.market.underlyingPriceUSD).toFixed(3),
      "Estimated profit in USD": ((jTokens.repay.borrowBalanceUnderlying * jTokens.repay.market.underlyingPriceUSD * 0.58) - (jTokens.repay.borrowBalanceUnderlying * jTokens.repay.market.underlyingPriceUSD * 0.50)).toFixed(3)
    }
  })
  console.table(formattedAccounts)
}