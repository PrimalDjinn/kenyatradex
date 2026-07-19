<script setup lang="ts">
const { data: site } = await useAsyncData('site:settings:footer', () => queryCollection('site').where('slug', '=', 'settings').first())
const contact = computed(() => site.value?.contact || { phone: '+254 721 596 259', phoneHref: '+254721596259', email: 'info@kenyatradex.africa', address: 'BP Plaza, 3rd Floor, Umoja Rd, Mombasa', whatsapp: 'https://wa.me/254786850801' })
const brand = computed(() => site.value?.brand || { name: 'Kenya Tradex', tagline: 'Freight, Customs & Regional Logistics', logo: '/images/kenya-tradex-logo-header.png' })
const primaryServices = computed(() => site.value?.services || [])
const moreServices = computed(() => site.value?.moreServiceLinks || [])
const credentials = computed(() => site.value?.credentials || ['KRA PIN: P051***680R', 'KIFWA Member No: M2294', 'Customs License: CAL/001526/24', 'KPA No. 10**39'])
</script>

<template>
  <footer class="bg-[var(--color-brand-navy)] py-12 text-white">
    <div class="site-container">
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div class="grid content-start gap-3">
          <NuxtLink class="inline-flex items-center gap-3 no-underline" to="/">
            <NuxtImg :src="brand.logo" :alt="`${brand.name} Logo`" width="54" height="54" />
            <span class="flex flex-col text-lg font-black leading-tight">{{ brand.name }}<small class="text-xs font-semibold text-white/70">{{ brand.tagline }}</small></span>
          </NuxtLink>
          <p class="text-white/70">Freight forwarding, customs clearance and logistics support for cargo moving through Kenya into regional East and Central African markets.</p>
          <div class="grid gap-1 border-t-2 border-[var(--color-brand-red)] pt-3 text-xs font-semibold text-white/65" aria-label="Operating credentials">
            <span v-for="credential in credentials" :key="credential">{{ credential }}</span>
          </div>
          <p class="font-bold text-white/70">{{ site?.proof || '200+ cargo files handled monthly | Zero cargo-loss record to date' }}</p>
        </div>
        <div class="grid content-start gap-3">
          <h4 class="font-black text-white">Services</h4>
          <NuxtLink v-for="service in primaryServices" :key="service.href" class="flex min-h-11 items-center text-white/75 no-underline hover:text-white" :to="service.href">{{ service.label }}</NuxtLink>
        </div>
        <div class="grid content-start gap-3">
          <h4 class="font-black text-white">More services</h4>
          <NuxtLink v-for="link in moreServices" :key="link.href" class="flex min-h-11 items-center text-white/75 no-underline hover:text-white" :to="link.href">{{ link.label }}</NuxtLink>
        </div>
        <div class="grid content-start gap-3">
          <h4 class="font-black text-white">Contact</h4>
          <a class="inline-flex min-h-11 items-center gap-2 text-white/75 no-underline hover:text-white" :href="`tel:${contact.phoneHref}`"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:phone" aria-hidden="true" /> {{ contact.phone }}</a>
          <a class="inline-flex min-h-11 items-center gap-2 text-white/75 no-underline hover:text-white" :href="`${contact.whatsapp}?text=Track%20BL%20No%3A`" target="_blank" rel="noopener"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:crosshair" aria-hidden="true" /> Track cargo by BL</a>
          <a class="inline-flex min-h-11 items-center gap-2 text-white/75 no-underline hover:text-white" href="https://maps.app.goo.gl/FgwAR5uw3TTwHLpTA" target="_blank" rel="noopener"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:map" aria-hidden="true" /> Find us on Google Maps</a>
          <a class="inline-flex min-h-11 items-center gap-2 text-white/75 no-underline hover:text-white" :href="`mailto:${contact.email}`"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:mail" aria-hidden="true" /> {{ contact.email }}</a>
          <p class="inline-flex gap-2 text-white/70"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:map-pin" aria-hidden="true" /> {{ contact.address }}</p>
          <div class="flex gap-3"><a class="inline-flex min-h-11 items-center text-white/75 no-underline hover:text-white" href="/sitemap.xml">Sitemap</a><a class="inline-flex min-h-11 items-center text-white/75 no-underline hover:text-white" href="/robots.txt">Robots.txt</a></div>
        </div>
      </div>
      <div class="mt-8 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/60 lg:flex-row">
        <p>© 2026 Kenya Tradex | Freight forwarding & logistics from Mombasa, Kenya</p>
      </div>
    </div>
  </footer>
</template>
