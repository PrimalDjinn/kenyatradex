<script setup lang="ts">
const mode = ref<'vehicle' | 'cargo'>('vehicle')
const crsp = ref(0)
const cif = ref(0)
const engineCc = ref(1500)
const cargoDutyRate = ref(25)

const vehicle = computed(() => {
  const customs = crsp.value * 0.35
  const exciseRate = engineCc.value > 3000 ? 0.35 : engineCc.value > 1500 ? 0.25 : 0.2
  const excise = (crsp.value + customs) * exciseRate
  const vat = (crsp.value + customs + excise) * 0.16
  const idf = crsp.value * 0.035
  const rdl = crsp.value * 0.02
  return { customs, excise, vat, idf, rdl, total: customs + excise + vat + idf + rdl }
})

const cargo = computed(() => {
  const customs = cif.value * (cargoDutyRate.value / 100)
  const vat = (cif.value + customs) * 0.16
  const idf = cif.value * 0.035
  const rdl = cif.value * 0.02
  return { customs, excise: 0, vat, idf, rdl, total: customs + vat + idf + rdl }
})

const result = computed(() => mode.value === 'vehicle' ? vehicle.value : cargo.value)
const formatKes = (value: number) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0)
const importTypes = [
  { label: 'Vehicle import', value: 'vehicle' },
  { label: 'General cargo', value: 'cargo' }
]
</script>

<template>
  <div class="content-block calculator">
    <h2>Kenya import duty calculator</h2>
    <p>This calculator provides a practical estimate only. Final KRA values depend on HS code, CRSP, customs valuation,
      inspection outcome and current regulations.</p>
    <UFormField label="Import type" name="import-type">
      <USelect v-model="mode" :items="importTypes" value-key="value" class="w-full" />
    </UFormField>
    <template v-if="mode === 'vehicle'">
      <UFormField label="CRSP or customs value in KES" name="crsp">
        <UInput v-model.number="crsp" type="number" min="0" placeholder="e.g. 2500000" class="w-full" />
      </UFormField>
      <UFormField label="Engine CC" name="engine-cc">
        <UInput v-model.number="engineCc" type="number" min="0" placeholder="e.g. 1500" class="w-full" />
      </UFormField>
    </template>
    <template v-else>
      <UFormField label="CIF value in KES" name="cif">
        <UInput v-model.number="cif" type="number" min="0" placeholder="e.g. 500000" class="w-full" />
      </UFormField>
      <UFormField label="Customs duty rate (%)" name="cargo-duty-rate">
        <UInput v-model.number="cargoDutyRate" type="number" min="0" max="100" class="w-full" />
      </UFormField>
    </template>
    <div class="result-box" aria-live="polite">
      <div class="result-row"><span>Customs duty</span><strong>{{ formatKes(result.customs) }}</strong></div>
      <div class="result-row"><span>Excise duty</span><strong>{{ formatKes(result.excise) }}</strong></div>
      <div class="result-row"><span>VAT</span><strong>{{ formatKes(result.vat) }}</strong></div>
      <div class="result-row"><span>IDF</span><strong>{{ formatKes(result.idf) }}</strong></div>
      <div class="result-row"><span>RDL</span><strong>{{ formatKes(result.rdl) }}</strong></div>
      <div class="result-row"><span>Estimated taxes</span><strong>{{ formatKes(result.total) }}</strong></div>
    </div>
  </div>
</template>
