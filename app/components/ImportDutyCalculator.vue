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
const cargoType = ref<CargoType>('finished')
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
  { value: 'specialized', label: 'Specialized Items (35%)' }
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
  <section class="content-block duty-calculator">
    <header class="calculator-header">
      <p class="section-label">Kenya import duty calculator</p>
      <h2>Kenya car import duty, CRSP and cargo duty calculator</h2>
      <p>This calculator provides indicative estimates based on KRA published rates using the CRSP methodology. Actual duties may vary based on specific valuation adjustments and current KRA directives.</p>
    </header>

    <div class="calculator-tabs" role="tablist" aria-label="Import duty calculator sections">
      <button v-for="tab in tabs" :key="tab.value" type="button" :class="['calculator-tab', { active: activeTab === tab.value }]" @click="setTab(tab.value)">
        <Icon class="ui-icon" :name="tab.icon" aria-hidden="true" /> {{ tab.label }}
      </button>
    </div>

    <div class="calculator-panel">
      <div v-if="activeTab === 'vehicle'" class="calculator-fields">
        <div class="field-row">
          <label><span>CRSP Value (KES)</span><input v-model="crsp" inputmode="decimal" placeholder="e.g. 3,200,000" @input="crsp = formatMoneyInput(crsp)" /></label>
          <label><span>Engine CC</span><input v-model="engineCc" type="number" min="0" placeholder="e.g. 1490" /></label>
        </div>
        <div class="field-row">
          <label><span>Fuel Type</span><select v-model="fuel"><option v-for="option in fuelOptions" :key="option.value" :value="option.value">{{ option.label }}</option></select></label>
          <label><span>Vehicle Age</span><select v-model="age"><option v-for="option in ageOptions" :key="option.value" :value="option.value">{{ option.label }}</option></select></label>
        </div>
        <label><span>Condition</span><select v-model="condition"><option value="excellent">Excellent</option></select></label>
        <button class="calculator-button" type="button" @click="calculateVehicle"><Icon class="ui-icon" name="lucide:calculator" aria-hidden="true" /> Calculate Duty</button>

        <div v-if="vehicleResult" class="result-card" aria-live="polite">
          <h3>Tax Breakdown</h3>
          <p><span>Customs Value</span><strong>{{ formatKes(vehicleResult.customsValue) }}</strong></p>
          <p><span>Import Duty (35%)</span><strong>{{ formatKes(vehicleResult.importDuty) }}</strong></p>
          <p><span>Excise Duty ({{ formatPercent(vehicleResult.exciseRate) }})</span><strong>{{ formatKes(vehicleResult.exciseDuty) }}</strong></p>
          <p><span>VAT (16%)</span><strong>{{ formatKes(vehicleResult.vat) }}</strong></p>
          <p><span>RDL (2%)</span><strong>{{ formatKes(vehicleResult.rdl) }}</strong></p>
          <p><span>IDF (2.5%)</span><strong>{{ formatKes(vehicleResult.idf) }}</strong></p>
          <div><span>Total Import Taxes</span><strong>{{ formatKes(vehicleResult.total) }}</strong></div>
        </div>
      </div>

      <div v-else-if="activeTab === 'cargo'" class="calculator-fields">
        <div class="field-row">
          <label><span>Currency</span><select v-model="currency"><option v-for="[value, label] in currencies" :key="value" :value="value">{{ label }}</option></select></label>
          <label><span>CIF Value</span><input v-model="cif" inputmode="decimal" placeholder="e.g. 15,000" @input="cif = formatMoneyInput(cif)" /></label>
        </div>
        <label>
          <span>Exchange Rate</span>
          <input v-model="exchangeRate" type="number" min="0" step="0.0001" />
          <small v-if="loadingRate">Fetching rate...</small>
          <small v-else-if="rateStatus">{{ rateStatus }} <button type="button" class="rate-button" @click="fetchExchangeRate">Refresh</button></small>
        </label>
        <label><span>Category (EAC CET)</span><select v-model="cargoType"><option v-for="option in cargoTypes" :key="option.value" :value="option.value">{{ option.label }}</option></select></label>
        <button class="calculator-button" type="button" @click="calculateCargo"><Icon class="ui-icon" name="lucide:calculator" aria-hidden="true" /> Calculate Duty</button>

        <div v-if="cargoResult" class="result-card" aria-live="polite">
          <h3>Tax Breakdown</h3>
          <p><span>CIF Value (KES)</span><strong>{{ formatKes(cargoResult.cifKes) }}</strong></p>
          <p><span>Import Duty ({{ formatPercent(cargoResult.dutyRate) }})</span><strong>{{ formatKes(cargoResult.importDuty) }}</strong></p>
          <p><span>VAT (16%)</span><strong>{{ formatKes(cargoResult.vat) }}</strong></p>
          <p><span>RDL (2%)</span><strong>{{ formatKes(cargoResult.rdl) }}</strong></p>
          <p><span>IDF (2.5%)</span><strong>{{ formatKes(cargoResult.idf) }}</strong></p>
          <div><span>Total Import Taxes</span><strong>{{ formatKes(cargoResult.total) }}</strong></div>
        </div>
      </div>

      <div v-else class="calculator-fields">
        <p class="tab-desc">Have a customs value? Work backwards to find the original CRSP. Then use that CRSP in the Vehicle Import tab to calculate taxes for similar vehicles of different ages.</p>
        <div class="field-row">
          <label><span>Customs Value (KES)</span><input v-model="customsValue" inputmode="decimal" placeholder="e.g. 868,966" @input="customsValue = formatMoneyInput(customsValue)" /></label>
          <label><span>Engine CC</span><input v-model="crspEngineCc" type="number" min="0" placeholder="e.g. 1490" /></label>
        </div>
        <div class="field-row">
          <label><span>Fuel Type</span><select v-model="crspFuel"><option v-for="option in fuelOptions" :key="option.value" :value="option.value">{{ option.label }}</option></select></label>
          <label><span>Vehicle Age</span><select v-model="crspAge"><option v-for="option in ageOptions" :key="option.value" :value="option.value">{{ option.label }}</option></select></label>
        </div>
        <button class="calculator-button" type="button" @click="calculateCrspValue"><Icon class="ui-icon" name="lucide:search" aria-hidden="true" /> Find CRSP</button>

        <div v-if="crspResult" class="result-card" aria-live="polite">
          <h3>CRSP Found</h3>
          <p><span>Your Customs Value</span><strong>{{ formatKes(parseMoney(customsValue)) }}</strong></p>
          <p><span>Depreciation Used</span><strong>{{ formatPercent(crspResult.depreciation) }}</strong></p>
          <p><span>Divisor Used</span><strong>{{ crspResult.divisor }}</strong></p>
          <p><span>Verification (CV back)</span><strong>{{ formatKes(crspResult.verificationCustomsValue) }}</strong></p>
          <div><span>Original CRSP</span><strong>{{ formatKes(crspResult.crsp) }}</strong></div>
          <p class="crsp-note">Use this CRSP value in the Vehicle Import tab to calculate taxes for similar vehicles of different ages.</p>
        </div>
      </div>
    </div>

    <p v-if="feedback" class="feedback error-text" role="alert">{{ feedback }}</p>
  </section>
</template>

<style scoped>
.duty-calculator {
  overflow: hidden;
}

.calculator-header {
  margin-bottom: 1.2rem;
}

.calculator-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  overflow: hidden;
  border-radius: 18px 18px 0 0;
  background: var(--navy);
}

.calculator-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 58px;
  padding: 0.85rem 1rem;
  border: 0;
  color: rgba(255, 255, 255, 0.72);
  background: transparent;
  font-weight: 850;
  cursor: pointer;
}

.calculator-tab.active,
.calculator-tab:hover {
  color: white;
  background: var(--red);
}

.calculator-panel {
  padding: clamp(20px, 4vw, 30px);
  border: 1px solid var(--line);
  border-top: 0;
  border-radius: 0 0 22px 22px;
  background: white;
}

.calculator-fields,
.field-row {
  display: grid;
  gap: 1rem;
}

.field-row {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

label {
  display: grid;
  gap: 0.45rem;
  font-weight: 800;
  color: var(--ink);
}

input,
select {
  width: 100%;
  min-height: 52px;
  padding: 0.85rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  background: white;
  color: var(--text);
  font: inherit;
}

small {
  color: var(--muted);
  font-weight: 700;
}

.rate-button {
  border: 0;
  background: transparent;
  color: var(--red-dark);
  font-weight: 850;
  cursor: pointer;
}

.calculator-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  min-height: 54px;
  border: 0;
  border-radius: 16px;
  background: var(--red);
  color: white;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 14px 28px rgba(198, 40, 40, 0.24);
}

.result-card {
  display: grid;
  gap: 0;
  margin-top: 0.75rem;
  padding: clamp(20px, 4vw, 28px);
  border-radius: 22px;
  color: white;
  background: linear-gradient(135deg, var(--navy), #1a2d4d);
}

.result-card h3 {
  color: white;
}

.result-card p,
.result-card div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin: 0;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.result-card div {
  display: grid;
  justify-items: center;
  margin-top: 0.9rem;
  padding: 1.1rem;
  border: 0;
  border-radius: 16px;
  background: var(--red);
  text-align: center;
}

.result-card strong {
  color: white;
}

.result-card div strong {
  color: #fbbf24;
  font-size: clamp(1.3rem, 4vw, 1.8rem);
}

.crsp-note,
.tab-desc {
  color: var(--muted);
}

@media (max-width: 650px) {
  .calculator-tabs,
  .field-row {
    grid-template-columns: 1fr;
  }
}
</style>
