import { fetchUnderwaterAccountsAndLiquidate, printAccountsWithLowHealth } from './services/liquidator.service'

const args = process.argv.slice(2)

if (args[0] === '--print-low-health-accounts') {
    printAccountsWithLowHealth()
} else {
    setInterval(fetchUnderwaterAccountsAndLiquidate, 1 * 1000)
}