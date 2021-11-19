import { expect } from 'chai'
import { getRepayAndCollateralJTokens } from '../src/services/liquidator.service'
import { Account } from '../src/services/underwater-accounts.service'

describe('getRepayAndCollateralJTokens', function () {
  it('should repay USDC and seize USDC', function () {
    // GIVEN
    const underwaterAccount: Account = {
      hasBorrowed: true,
      health: 1.03836855184200967,
      id: '0x000000e28faa823d5b53ff6c2922c28335840375',
      tokens: [
        {
          borrowBalanceUnderlying: 0,
          id: '0x8b650e26404ac6837539ca96812f0123601e4448-0x000000e28faa823d5b53ff6c2922c28335840375',
          jTokenBalance: 8378.30917688,
          market: {
            id: '0x8b650e26404ac6837539ca96812f0123601e4448',
            underlyingPriceUSD: 1,
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
            underlyingPriceUSD: 1,
          },
          supplyBalanceUnderlying: 331000.3222525106073053763832,
          symbol: 'jUSDC',
          enteredMarket: true,
        },
      ],
      totalBorrowValueInUSD: 255491.69214945627608,
      totalCollateralValueInUSD: 265294.53838489546448,
    }

    // WHEN
    const jTokens = getRepayAndCollateralJTokens(underwaterAccount)

    // THEN
    expect(jTokens.repay.symbol).equal('jUSDC')
    expect(jTokens.collateral.symbol).equal('jUSDC')
  })

  it('should repay WETH and seize WETH', function () {
    // GIVEN
    const underwaterAccount: Account = {
      hasBorrowed: true,
      health: 1.091304357372466297,
      id: '0x06c64b65ce7e07af2dd7ca4b87ed6ae2a4def45e',
      tokens: [
        {
          borrowBalanceUnderlying: 9.16201751688128129885916193998313,
          enteredMarket: true,
          id: '0x929f5cab61dfec79a5431a7734a68d714c4633fa-0x06c64b65ce7e07af2dd7ca4b87ed6ae2a4def45e',
          jTokenBalance: 636.44430116,
          market: {
            id: '0x929f5cab61dfec79a5431a7734a68d714c4633fa',
            underlyingPriceUSD: 4274.8639151,
          },
          supplyBalanceUnderlying: 12.75051860323915899641157752,
          symbol: 'jWETH',
        },
        {
          borrowBalanceUnderlying: 321.6291611932560666608562578243802,
          enteredMarket: true,
          id: '0xc22f01ddc8010ee05574028528614634684ec29e-0x06c64b65ce7e07af2dd7ca4b87ed6ae2a4def45e',
          jTokenBalance: 24328.84071782,
          market: {
            id: '0xc22f01ddc8010ee05574028528614634684ec29e',
            underlyingPriceUSD: 107.3,
          },
          supplyBalanceUnderlying: 490.3896629208213728745305062,
          symbol: 'jAVAX',
        },
      ],
      totalBorrowValueInUSD: 68115.771633669383811079,
      totalCollateralValueInUSD: 74335.038389611235711308,
    }

    // WHEN
    const jTokens = getRepayAndCollateralJTokens(underwaterAccount)

    // THEN
    expect(jTokens.repay.symbol).equal('jWETH')
    expect(jTokens.collateral.symbol).equal('jWETH')
  })

  it('should repay MIM and seize AVAX', function () {
    // GIVEN
    const underwaterAccount: Account = {
      hasBorrowed: true,
      health: 1.093327736361512281,
      id: '0xd6ee257dc510ff6682fa54689d87ace46c8c79cf',
      tokens: [
        {
          borrowBalanceUnderlying: 0,
          enteredMarket: true,
          id: '0x8b650e26404ac6837539ca96812f0123601e4448-0xd6ee257dc510ff6682fa54689d87ace46c8c79cf',
          jTokenBalance: 0,
          market: {
            id: '0x8b650e26404ac6837539ca96812f0123601e4448',
            underlyingPriceUSD: 1.000694,
          },
          supplyBalanceUnderlying: 0,
          symbol: 'jUSDT',
        },
        {
          borrowBalanceUnderlying: 0,
          enteredMarket: true,
          id: '0xc146783a59807154f92084f9243eb139d58da696-0xd6ee257dc510ff6682fa54689d87ace46c8c79cf',
          jTokenBalance: 7447.2956669,
          market: {
            id: '0xc146783a59807154f92084f9243eb139d58da696',
            underlyingPriceUSD: 3.28489842,
          },
          supplyBalanceUnderlying: 148.9459133380656032275297221,
          symbol: 'jXJOE',
        },
        {
          borrowBalanceUnderlying: 0,
          enteredMarket: true,
          id: '0xc22f01ddc8010ee05574028528614634684ec29e-0xd6ee257dc510ff6682fa54689d87ace46c8c79cf',
          jTokenBalance: 1142.03231088,
          market: {
            id: '0xc22f01ddc8010ee05574028528614634684ec29e',
            underlyingPriceUSD: 107.3,
          },
          supplyBalanceUnderlying: 23.01853297310858911852476816,
          symbol: 'jAVAX',
        },
        {
          borrowBalanceUnderlying: 1666.566981829610775157674567670936,
          enteredMarket: true,
          id: '0xce095a9657a02025081e0607c8d8b081c76a75ea-0xd6ee257dc510ff6682fa54689d87ace46c8c79cf',
          jTokenBalance: 0,
          market: {
            id: '0xce095a9657a02025081e0607c8d8b081c76a75ea',
            underlyingPriceUSD: 1.0019756,
          },
          supplyBalanceUnderlying: 0,
          symbol: 'jMIM',
        },
      ],
      totalBorrowValueInUSD: 1666.64790044631126619,
      totalCollateralValueInUSD: 1822.192376306632571135,
    }

    // WHEN
    const jTokens = getRepayAndCollateralJTokens(underwaterAccount)

    // THEN
    expect(jTokens.repay.symbol).equal('jMIM')
    expect(jTokens.collateral.symbol).equal('jAVAX')
  })

  it('should repay USDC and seize AVAX', function () {
    // GIVEN
    const underwaterAccount: Account = {
      hasBorrowed: true,
      health: 1.054177587321269409,
      id: '0xd65a65d17ba88726b61383147e9c013a8ef6ee0b',
      tokens: [
        {
          borrowBalanceUnderlying: 650040.0828816093014350588122531958,
          enteredMarket: true,
          id: '0x8b650e26404ac6837539ca96812f0123601e4448-0xd65a65d17ba88726b61383147e9c013a8ef6ee0b',
          jTokenBalance: 0,
          market: {
            id: '0x8b650e26404ac6837539ca96812f0123601e4448',
            underlyingPriceUSD: 1.000694,
          },
          supplyBalanceUnderlying: 0,
          symbol: 'jUSDT',
        },
        {
          borrowBalanceUnderlying: 0,
          enteredMarket: true,
          id: '0xc22f01ddc8010ee05574028528614634684ec29e-0xd65a65d17ba88726b61383147e9c013a8ef6ee0b',
          jTokenBalance: 421916.81169975,
          market: {
            id: '0xc22f01ddc8010ee05574028528614634684ec29e',
            underlyingPriceUSD: 107.3,
          },
          supplyBalanceUnderlying: 8501.9212315390190903553085635,
          symbol: 'jAVAX',
        },
      ],
      totalBorrowValueInUSD: 650542.93186448520768,
      totalCollateralValueInUSD: 685787.778361807970606803,
    }

    // WHEN
    const jTokens = getRepayAndCollateralJTokens(underwaterAccount)

    // THEN
    expect(jTokens.repay.symbol).equal('jUSDT')
    expect(jTokens.collateral.symbol).equal('jAVAX')
  })
})