<script setup lang="ts">
import type { CargoType, FuelType, VehicleAge } from '~/utils/import-duty'
import { calculateCargoDuty, calculateCrsp, calculateVehicleDuty, fallbackExchangeRates, parseMoney } from '~/utils/import-duty'

type Tab = 'vehicle' | 'cargo' | 'crsp'

const activeTab = ref<Tab>('vehicle')
const crsp = ref('')
const engineCc = ref('')
const fuel = ref<FuelType | ''>('')
const age = ref<VehicleAge | ''>('')
const condition = ref('excellent')
const currency = ref('USD')
const cif = ref('')
const exchangeRate = ref('130')
const cargoType = ref<CargoType>('raw')
const customsValue = ref('')
const crspEngineCc = ref('')
const crspFuel = ref<FuelType | ''>('')
const crspAge = ref<VehicleAge | ''>('')
const vehicleResult = ref<ReturnType<typeof calculateVehicleDuty> | null>(null)
const cargoResult = ref<ReturnType<typeof calculateCargoDuty> | null>(null)
const crspResult = ref<ReturnType<typeof calculateCrsp> | null>(null)
const feedback = ref('')
const rateStatus = ref('')
const loadingRate = ref(false)

const tabs: Array<{ value: Tab; label: string; icon: string }> = [
  { value: 'vehicle', label: 'Vehicle Import', icon: 'lucide:car' },
  { value: 'cargo', label: 'General Cargo', icon: 'lucide:package' },
  { value: 'crsp', label: 'CRSP Finder', icon: 'lucide:search' }
]

const fuelOptions = [
  { value: '', label: 'Select fuel' },
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'electric', label: 'Electric' }
]

const ageOptions = [
  { value: '', label: 'Select age' },
  { value: 'new', label: 'Brand New (2026)' },
  { value: '1', label: 'Less than 1 year (2025)' },
  { value: '2', label: '1-2 years (20%) - 2025' },
  { value: '3', label: '2-3 years (30%) - 2024' },
  { value: '4', label: '3-4 years (40%) - 2023' },
  { value: '5', label: '4-5 years (50%) - 2022' },
  { value: '6', label: '5-6 years (55%) - 2021' },
  { value: '7', label: '6-7 years (60%) - 2020' },
  { value: '8', label: '7-8 years (65%) - 2019' }
]

const currencies = [
  ['USD', 'USD - US Dollar'],
  ['EUR', 'EUR - Euro'],
  ['GBP', 'GBP - British Pound'],
  ['JPY', 'JPY - Japanese Yen'],
  ['CNY', 'CNY - Chinese Yuan'],
  ['AED', 'AED - UAE Dirham'],
  ['INR', 'INR - Indian Rupee'],
  ['ZAR', 'ZAR - South African Rand'],
  ['TZS', 'TZS - Tanzanian Shilling'],
  ['UGX', 'UGX - Ugandan Shilling']
]

const cargoTypes: Array<{ value: CargoType; label: string }> = [
  { value: 'raw', label: 'Raw Materials (10%)' },
  { value: 'capital', label: 'Capital Goods (10%)' },
  { value: 'finished', label: 'Finished Goods (25%)' },
  { value: 'specialized', label: 'Specialized Items (35%)' },
  { value: 'selected', label: 'Selected Goods (45%)' }
]

function setTab(tab: Tab) {
  activeTab.value = tab
  feedback.value = ''
}

function formatKes(value: number) {
  return `KES ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number.isFinite(value) ? value : 0)}`
}

function formatPercent(value: number) {
  return `${Number((value * 100).toFixed(2))}%`
}

function formatMoneyInput(value: string) {
  const [whole, decimal] = value.replace(/[^0-9.]/g, '').split('.')
  const formattedWhole = (whole || '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decimal === undefined ? formattedWhole : `${formattedWhole}.${decimal}`
}

function calculateVehicle() {
  feedback.value = ''
  const parsedCrsp = parseMoney(crsp.value)
  const parsedCc = Number.parseFloat(engineCc.value)
  if (!parsedCrsp || !parsedCc || !fuel.value || !age.value) {
    feedback.value = 'Please fill all required vehicle fields.'
    vehicleResult.value = null
    return
  }
  vehicleResult.value = calculateVehicleDuty({ crsp: parsedCrsp, engineCc: parsedCc, fuel: fuel.value, age: age.value })
}

function calculateCargo() {
  feedback.value = ''
  const parsedCif = parseMoney(cif.value)
  const parsedRate = Number.parseFloat(exchangeRate.value) || fallbackExchangeRates[currency.value] || 130
  if (!parsedCif) {
    feedback.value = 'Please enter CIF value.'
    cargoResult.value = null
    return
  }
  cargoResult.value = calculateCargoDuty({ cif: parsedCif, exchangeRate: parsedRate, cargoType: cargoType.value })
}

function calculateCrspValue() {
  feedback.value = ''
  const parsedCustomsValue = parseMoney(customsValue.value)
  const parsedCc = Number.parseFloat(crspEngineCc.value)
  if (!parsedCustomsValue || !parsedCc || !crspFuel.value || !crspAge.value) {
    feedback.value = 'Please fill all required CRSP finder fields.'
    crspResult.value = null
    return
  }
  crspResult.value = calculateCrsp({ customsValue: parsedCustomsValue, engineCc: parsedCc, fuel: crspFuel.value, age: crspAge.value })
}

async function fetchExchangeRate() {
  loadingRate.value = true
  rateStatus.value = ''
  try {
    const primary = await $fetch<{ rates?: Record<string, number> }>(`https://open.er-api.com/v6/latest/${currency.value}`)
    const rate = primary.rates?.KES
    if (rate) {
      exchangeRate.value = rate.toFixed(4)
      rateStatus.value = `1 ${currency.value} = ${rate.toFixed(2)} KES`
      return
    }
    throw new Error('KES rate not found')
  } catch {
    try {
      const fallback = await $fetch<{ rates?: Record<string, number> }>(`https://api.exchangerate-api.com/v4/latest/${currency.value}`)
      const rate = fallback.rates?.KES
      if (rate) {
        exchangeRate.value = rate.toFixed(4)
        rateStatus.value = `1 ${currency.value} = ${rate.toFixed(2)} KES`
        return
      }
    } catch {
      // Use the legacy static fallback below.
    }
    const rate = fallbackExchangeRates[currency.value] || 130
    exchangeRate.value = rate.toFixed(4)
    rateStatus.value = `1 ${currency.value} = ${rate.toFixed(2)} KES (estimated)`
  } finally {
    loadingRate.value = false
  }
}

watch(currency, () => {
  fetchExchangeRate().catch(() => { })
})

onMounted(() => {
  fetchExchangeRate().catch(() => { })
})
</script>

<template>
  <section class="duty-calculator overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-4 sm:p-6">
    <header class="mb-5">
      <p class="mb-2 text-sm font-bold uppercase tracking-[.12em] text-[var(--color-brand-red-dark)]">Choose an estimate</p>
      <h2 class="section-title mb-4 text-[var(--color-text-primary)]">Vehicle, cargo or reverse CRSP</h2>
      <p class="text-[var(--color-text-muted)]">This calculator provides indicative estimates based on KRA published rates using the CRSP methodology. Actual duties may vary based on specific valuation adjustments and current KRA directives.</p>
    </header>

    <div class="grid grid-cols-3 overflow-hidden rounded-t-xl bg-[var(--color-brand-navy)]" role="tablist" aria-label="Import duty calculator sections">
      <button v-for="tab in tabs" :key="tab.value" type="button" class="inline-flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 px-1 py-2 text-[.7rem] font-extrabold transition sm:flex-row sm:gap-2 sm:px-4 sm:py-3 sm:text-sm" :class="activeTab === tab.value ? 'bg-[var(--color-brand-red)] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'" @click="setTab(tab.value)">
        <Icon class="h-[1.1em] w-[1.1em] shrink-0" :name="tab.icon" aria-hidden="true" /> <span class="truncate">{{ tab.label }}</span>
      </button>
    </div>

    <div class="rounded-b-xl border border-t-0 border-[var(--color-border)] bg-white p-4 sm:p-6 lg:p-8">
      <div v-if="activeTab === 'vehicle'" class="grid gap-4">
        <div class="grid gap-4 md:grid-cols-2">
          <label class="grid gap-2 font-extrabold text-[var(--color-text-primary)]"><span>CRSP Value (KES)</span><input v-model="crsp" class="min-h-13 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-[var(--color-text-primary)]" inputmode="decimal" placeholder="e.g. 3,200,000" @input="crsp = formatMoneyInput(crsp)" /></label>
          <label class="grid gap-2 font-extrabold text-[var(--color-text-primary)]"><span>Engine CC</span><input v-model="engineCc" class="min-h-13 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-[var(--color-text-primary)]" type="number" min="0" placeholder="e.g. 1490" /></label>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <label class="grid gap-2 font-extrabold text-[var(--color-text-primary)]"><span>Fuel Type</span><select v-model="fuel" class="min-h-13 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-[var(--color-text-primary)]"><option v-for="option in fuelOptions" :key="option.value" :value="option.value">{{ option.label }}</option></select></label>
          <label class="grid gap-2 font-extrabold text-[var(--color-text-primary)]"><span>Vehicle Age</span><select v-model="age" class="min-h-13 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-[var(--color-text-primary)]"><option v-for="option in ageOptions" :key="option.value" :value="option.value">{{ option.label }}</option></select></label>
        </div>
        <label class="grid gap-2 font-extrabold text-[var(--color-text-primary)]"><span>Condition</span><select v-model="condition" class="min-h-13 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-[var(--color-text-primary)]"><option value="excellent">Excellent</option></select></label>
        <button class="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[var(--color-brand-red)] px-5 py-3 font-black text-white shadow-lg transition hover:bg-[var(--color-brand-red-dark)]" type="button" @click="calculateVehicle"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:calculator" aria-hidden="true" /> Calculate Duty</button>

        <div v-if="vehicleResult" class="mt-3 grid rounded-3xl bg-[linear-gradient(135deg,var(--color-brand-navy),#1a2d4d)] p-5 text-white lg:p-7" aria-live="polite">
          <h3 class="mb-3 text-xl font-black text-white">Tax Breakdown</h3>
          <p v-for="row in [['Customs Value', vehicleResult.customsValue], ['Import Duty (35%)', vehicleResult.importDuty], [`Excise Duty (${formatPercent(vehicleResult.exciseRate)})`, vehicleResult.exciseDuty], ['VAT (16%)', vehicleResult.vat], ['RDL (2%)', vehicleResult.rdl], ['IDF (2.5%)', vehicleResult.idf]]" :key="String(row[0])" class="m-0 grid gap-1 border-b border-white/10 py-3 sm:grid-cols-[1fr_auto] sm:gap-4"><span>{{ row[0] }}</span><strong class="break-words sm:text-right">{{ formatKes(Number(row[1])) }}</strong></p>
          <div class="mt-4 grid justify-items-center rounded-2xl bg-[var(--color-brand-red)] p-4 text-center"><span>Total Import Taxes</span><strong class="text-2xl text-amber-300">{{ formatKes(vehicleResult.total) }}</strong></div>
        </div>
      </div>

      <div v-else-if="activeTab === 'cargo'" class="grid gap-4">
        <div class="grid gap-4 md:grid-cols-2">
          <label class="grid gap-2 font-extrabold text-[var(--color-text-primary)]"><span>Currency</span><select v-model="currency" class="min-h-13 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-[var(--color-text-primary)]"><option v-for="[value, label] in currencies" :key="value" :value="value">{{ label }}</option></select></label>
          <label class="grid gap-2 font-extrabold text-[var(--color-text-primary)]"><span>CIF Value</span><input v-model="cif" class="min-h-13 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-[var(--color-text-primary)]" inputmode="decimal" placeholder="e.g. 15,000" @input="cif = formatMoneyInput(cif)" /></label>
        </div>
        <label class="grid gap-2 font-extrabold text-[var(--color-text-primary)]">
          <span>Exchange Rate</span>
          <input v-model="exchangeRate" class="min-h-13 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-[var(--color-text-primary)]" type="number" min="0" step="0.0001" />
          <small v-if="loadingRate" class="font-bold text-[var(--color-text-muted)]">Fetching rate...</small>
          <small v-else-if="rateStatus" class="font-bold text-[var(--color-text-muted)]">{{ rateStatus }} <button type="button" class="font-black text-[var(--color-brand-red-dark)]" @click="fetchExchangeRate">Refresh</button></small>
        </label>
        <label class="grid gap-2 font-extrabold text-[var(--color-text-primary)]"><span>Category (EAC CET)</span><select v-model="cargoType" class="min-h-13 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-[var(--color-text-primary)]"><option v-for="option in cargoTypes" :key="option.value" :value="option.value">{{ option.label }}</option></select></label>
        <button class="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[var(--color-brand-red)] px-5 py-3 font-black text-white shadow-lg transition hover:bg-[var(--color-brand-red-dark)]" type="button" @click="calculateCargo"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:calculator" aria-hidden="true" /> Calculate Duty</button>

        <div v-if="cargoResult" class="mt-3 grid rounded-3xl bg-[linear-gradient(135deg,var(--color-brand-navy),#1a2d4d)] p-5 text-white lg:p-7" aria-live="polite">
          <h3 class="mb-3 text-xl font-black text-white">Tax Breakdown</h3>
          <p v-for="row in [['CIF Value (KES)', cargoResult.cifKes], [`Import Duty (${formatPercent(cargoResult.dutyRate)})`, cargoResult.importDuty], ['VAT (16%)', cargoResult.vat], ['RDL (2%)', cargoResult.rdl], ['IDF (2.5%)', cargoResult.idf]]" :key="String(row[0])" class="m-0 grid gap-1 border-b border-white/10 py-3 sm:grid-cols-[1fr_auto] sm:gap-4"><span>{{ row[0] }}</span><strong class="break-words sm:text-right">{{ formatKes(Number(row[1])) }}</strong></p>
          <div class="mt-4 grid justify-items-center rounded-2xl bg-[var(--color-brand-red)] p-4 text-center"><span>Total Import Taxes</span><strong class="text-2xl text-amber-300">{{ formatKes(cargoResult.total) }}</strong></div>
        </div>
      </div>

      <div v-else class="grid gap-4">
        <p class="text-[var(--color-text-muted)]">Have a customs value? Work backwards to find the original CRSP. Then use that CRSP in the Vehicle Import tab to calculate taxes for similar vehicles of different ages.</p>
        <div class="grid gap-4 md:grid-cols-2">
          <label class="grid gap-2 font-extrabold text-[var(--color-text-primary)]"><span>Customs Value (KES)</span><input v-model="customsValue" class="min-h-13 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-[var(--color-text-primary)]" inputmode="decimal" placeholder="e.g. 868,966" @input="customsValue = formatMoneyInput(customsValue)" /></label>
          <label class="grid gap-2 font-extrabold text-[var(--color-text-primary)]"><span>Engine CC</span><input v-model="crspEngineCc" class="min-h-13 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-[var(--color-text-primary)]" type="number" min="0" placeholder="e.g. 1490" /></label>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <label class="grid gap-2 font-extrabold text-[var(--color-text-primary)]"><span>Fuel Type</span><select v-model="crspFuel" class="min-h-13 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-[var(--color-text-primary)]"><option v-for="option in fuelOptions" :key="option.value" :value="option.value">{{ option.label }}</option></select></label>
          <label class="grid gap-2 font-extrabold text-[var(--color-text-primary)]"><span>Vehicle Age</span><select v-model="crspAge" class="min-h-13 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-[var(--color-text-primary)]"><option v-for="option in ageOptions" :key="option.value" :value="option.value">{{ option.label }}</option></select></label>
        </div>
        <button class="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[var(--color-brand-red)] px-5 py-3 font-black text-white shadow-lg transition hover:bg-[var(--color-brand-red-dark)]" type="button" @click="calculateCrspValue"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:search" aria-hidden="true" /> Find CRSP</button>

        <div v-if="crspResult" class="mt-3 grid rounded-3xl bg-[linear-gradient(135deg,var(--color-brand-navy),#1a2d4d)] p-5 text-white lg:p-7" aria-live="polite">
          <h3 class="mb-3 text-xl font-black text-white">CRSP Found</h3>
          <p class="m-0 grid gap-1 border-b border-white/10 py-3 sm:grid-cols-[1fr_auto] sm:gap-4"><span>Your Customs Value</span><strong class="break-words sm:text-right">{{ formatKes(parseMoney(customsValue)) }}</strong></p>
          <p class="m-0 grid gap-1 border-b border-white/10 py-3 sm:grid-cols-[1fr_auto] sm:gap-4"><span>Depreciation Used</span><strong class="sm:text-right">{{ formatPercent(crspResult.depreciation) }}</strong></p>
          <p class="m-0 grid gap-1 border-b border-white/10 py-3 sm:grid-cols-[1fr_auto] sm:gap-4"><span>Divisor Used</span><strong class="sm:text-right">{{ crspResult.divisor }}</strong></p>
          <p class="m-0 grid gap-1 border-b border-white/10 py-3 sm:grid-cols-[1fr_auto] sm:gap-4"><span>Verification (CV back)</span><strong class="break-words sm:text-right">{{ formatKes(crspResult.verificationCustomsValue) }}</strong></p>
          <div class="mt-4 grid justify-items-center rounded-2xl bg-[var(--color-brand-red)] p-4 text-center"><span>Original CRSP</span><strong class="text-2xl text-amber-300">{{ formatKes(crspResult.crsp) }}</strong></div>
          <p class="text-white/80">Use this CRSP value in the Vehicle Import tab to calculate taxes for similar vehicles of different ages.</p>
        </div>
      </div>
    </div>

    <p v-if="feedback" class="mt-4 text-sm font-semibold text-red-600" role="alert">{{ feedback }}</p>
  </section>
</template>
