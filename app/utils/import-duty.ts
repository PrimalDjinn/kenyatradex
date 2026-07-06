export type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'electric'
export type VehicleAge = 'new' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
export type CargoType = 'raw' | 'capital' | 'finished' | 'specialized'

export const depreciationRates: Record<VehicleAge, number> = {
  new: 0,
  '1': 0,
  '2': 0.2,
  '3': 0.3,
  '4': 0.4,
  '5': 0.5,
  '6': 0.55,
  '7': 0.6,
  '8': 0.65
}

export const cargoDutyRates: Record<CargoType, number> = {
  raw: 0.1,
  capital: 0.1,
  finished: 0.25,
  specialized: 0.35
}

export const fallbackExchangeRates: Record<string, number> = {
  USD: 130,
  EUR: 142,
  GBP: 165,
  JPY: 0.87,
  CNY: 18,
  AED: 35,
  INR: 1.55,
  ZAR: 7,
  TZS: 0.052,
  UGX: 0.035
}

export function parseMoney(value: string | number) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  return Number.parseFloat(value.replace(/,/g, '')) || 0
}

export function getVehicleDivisor(fuel: FuelType, engineCc: number) {
  return (fuel === 'petrol' && engineCc > 3000) || (fuel === 'diesel' && engineCc > 2500) ? 2.35625005 : 2.175
}

export function getVehicleExciseRate(fuel: FuelType, engineCc: number) {
  if (fuel === 'electric') return 0
  if (fuel === 'hybrid') return 0.2
  if (engineCc <= 1500) return 0.2
  if ((fuel === 'petrol' && engineCc > 3000) || (fuel === 'diesel' && engineCc > 2500)) return 0.35
  return 0.25
}

export function calculateVehicleDuty(input: { crsp: number; engineCc: number; fuel: FuelType; age: VehicleAge }) {
  const depreciation = depreciationRates[input.age]
  const divisor = getVehicleDivisor(input.fuel, input.engineCc)
  const customsValue = (input.crsp / divisor) * (1 - depreciation)
  const importDuty = customsValue * 0.35
  const exciseValue = customsValue + importDuty
  const exciseRate = getVehicleExciseRate(input.fuel, input.engineCc)
  const exciseDuty = exciseValue * exciseRate
  const vat = (exciseValue + exciseDuty) * 0.16
  const rdl = customsValue * 0.02
  const idf = customsValue * 0.025
  const total = importDuty + exciseDuty + vat + rdl + idf

  return { customsValue, importDuty, exciseValue, exciseRate, exciseDuty, vat, rdl, idf, total, depreciation, divisor }
}

export function calculateCargoDuty(input: { cif: number; exchangeRate: number; cargoType: CargoType }) {
  const cifKes = input.cif * input.exchangeRate
  const dutyRate = cargoDutyRates[input.cargoType]
  const importDuty = cifKes * dutyRate
  const vat = (cifKes + importDuty) * 0.16
  const rdl = cifKes * 0.02
  const idf = cifKes * 0.025
  const total = importDuty + vat + rdl + idf

  return { cifKes, dutyRate, importDuty, vat, rdl, idf, total }
}

export function calculateCrsp(input: { customsValue: number; engineCc: number; fuel: FuelType; age: VehicleAge }) {
  const depreciation = depreciationRates[input.age]
  const divisor = getVehicleDivisor(input.fuel, input.engineCc)
  const crsp = (input.customsValue * divisor) / (1 - depreciation)
  const verificationCustomsValue = (crsp / divisor) * (1 - depreciation)

  return { crsp, verificationCustomsValue, depreciation, divisor }
}
