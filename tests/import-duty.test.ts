import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { calculateCargoDuty, calculateCrsp, calculateVehicleDuty } from '../app/utils/import-duty.ts'

function close(actual: number, expected: number) {
  assert.ok(Math.abs(actual - expected) < 0.01, `expected ${actual} to be close to ${expected}`)
}

describe('legacy import duty formulas', () => {
  it('calculates vehicle import duty using CRSP, age, fuel and engine size', () => {
    const result = calculateVehicleDuty({ crsp: 3_200_000, engineCc: 1490, fuel: 'petrol', age: '3' })

    close(result.customsValue, 1_029_885.0574712643)
    close(result.importDuty, 360_459.7701149425)
    close(result.exciseRate, 0.2)
    close(result.exciseDuty, 278_068.9655172414)
    close(result.vat, 266_946.2068965517)
    close(result.rdl, 20_597.7011494253)
    close(result.idf, 25_747.1264367816)
    close(result.total, 951_819.7701149427)
  })

  it('calculates cargo import duty using CIF, exchange rate and EAC CET category', () => {
    const result = calculateCargoDuty({ cif: 15_000, exchangeRate: 130, cargoType: 'finished' })

    close(result.cifKes, 1_950_000)
    close(result.dutyRate, 0.25)
    close(result.importDuty, 487_500)
    close(result.vat, 390_000)
    close(result.rdl, 39_000)
    close(result.idf, 48_750)
    close(result.total, 965_250)
  })

  it('finds CRSP from customs value using the legacy divisor and depreciation schedule', () => {
    const result = calculateCrsp({ customsValue: 868_966, engineCc: 1490, fuel: 'petrol', age: '3' })

    close(result.crsp, 2_700_001.5)
    close(result.verificationCustomsValue, 868_966)
    close(result.depreciation, 0.3)
    close(result.divisor, 2.175)
  })
})
