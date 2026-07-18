<script setup lang="ts">
const { data: site } = await useAsyncData('site:settings:footer', () => queryCollection('site').where('slug', '=', 'settings').first())
const contact = computed(() => site.value?.contact || { phone: '+254 721 596 259', phoneHref: '+254721596259', email: 'info@kenyatradex.africa', address: 'Liwatoni Road, Mombasa, Kenya', whatsapp: 'https://wa.me/254721596259' })
const brand = computed(() => site.value?.brand || { name: 'Kenya Tradex', tagline: 'Freight, customs and regional logistics', logo: '/images/kenya-tradex-logo-header.png' })
const primaryServices = computed(() => (site.value?.services || []).slice(0, 6))
const corridorLinks = computed(() => (site.value?.moreServiceLinks || []).filter((link) => ['Transit Cargo', 'Shipping from Dubai', 'Shipping from China', 'Import from South Africa'].includes(link.label)))
const credentials = computed(() => site.value?.credentials || ['KRA PIN P051396680R', 'KIFWA M2294', 'Customs CAL/001526/24', 'KPA 101839'])
</script>

<template>
  <footer class="bg-[var(--color-brand-navy)] py-12 text-white">
    <div class="site-container">
      <div class="mb-10 grid gap-5 border-b border-white/15 pb-9 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p class="text-sm font-black uppercase tracking-wide text-white/60">Mombasa operations desk</p>
          <h2 class="max-w-3xl text-2xl font-extrabold leading-tight tracking-[-0.025em] text-white sm:text-3xl">Have a cargo file that needs movement, release or route clarity?</h2>
        </div>
        <div class="flex flex-wrap gap-3">
          <a class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand-red)] px-5 py-3 font-extrabold text-white no-underline transition hover:bg-[var(--color-brand-red-dark)]" :href="`${contact.whatsapp}?text=Hello%20Kenya%20Tradex%2C%20I%20need%20a%20cargo%20file%20review`" target="_blank" rel="noopener"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:message-circle" aria-hidden="true" /> Send file details</a>
          <a class="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 font-bold text-white no-underline" :href="`tel:${contact.phoneHref}`"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:phone" aria-hidden="true" /> {{ contact.phone }}</a>
        </div>
      </div>
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div class="grid content-start gap-3">
          <NuxtLink class="inline-flex items-center gap-3 no-underline" to="/">
            <NuxtImg :src="brand.logo" :alt="`${brand.name} Logo`" width="54" height="54" />
            <span class="flex flex-col text-lg font-black leading-tight">{{ brand.name }}<small class="text-xs font-semibold text-white/70">{{ brand.tagline }}</small></span>
          </NuxtLink>
          <p class="text-white/70">Licensed coordination for cargo moving through Mombasa Port, Nairobi ICD, JKIA and East African corridors.</p>
          <div class="grid gap-1 border-l-2 border-[var(--color-brand-red)] pl-3 text-xs font-semibold text-white/65" aria-label="Operating credentials">
            <span v-for="credential in credentials" :key="credential">{{ credential }}</span>
          </div>
          <p class="font-bold text-white/70">{{ site?.proof || '200+ cargo files handled monthly | Zero cargo-loss record to date' }}</p>
        </div>
        <div class="grid content-start gap-3">
          <h4 class="font-black text-white">Core cargo desks</h4>
          <NuxtLink v-for="service in primaryServices" :key="service.href" class="text-white/75 no-underline hover:text-white" :to="service.href">{{ service.label }}</NuxtLink>
        </div>
        <div class="grid content-start gap-3">
          <h4 class="font-black text-white">Corridors & special files</h4>
          <NuxtLink v-for="link in corridorLinks" :key="link.href" class="text-white/75 no-underline hover:text-white" :to="link.href">{{ link.label }}</NuxtLink>
          <NuxtLink class="text-white/75 no-underline hover:text-white" to="/vehicle-import-to-kenya.html">Vehicle Import</NuxtLink>
          <NuxtLink class="text-white/75 no-underline hover:text-white" to="/project-logistics.html">Project Logistics</NuxtLink>
        </div>
        <div class="grid content-start gap-3">
          <h4 class="font-black text-white">Direct contact</h4>
          <a class="inline-flex items-center gap-2 text-white/75 no-underline hover:text-white" :href="`tel:${contact.phoneHref}`"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:phone" aria-hidden="true" /> {{ contact.phone }}</a>
          <a class="inline-flex items-center gap-2 text-white/75 no-underline hover:text-white" :href="`${contact.whatsapp}?text=Track%20BL%20No%3A`" target="_blank" rel="noopener"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:crosshair" aria-hidden="true" /> Track cargo by BL</a>
          <a class="inline-flex items-center gap-2 text-white/75 no-underline hover:text-white" :href="`mailto:${contact.email}`"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:mail" aria-hidden="true" /> {{ contact.email }}</a>
          <p class="inline-flex gap-2 text-white/70"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:map-pin" aria-hidden="true" /> {{ contact.address }}</p>
          <div class="flex gap-3"><a class="text-white/75 no-underline hover:text-white" href="/sitemap.xml">Sitemap</a><a class="text-white/75 no-underline hover:text-white" href="/robots.txt">Robots.txt</a></div>
        </div>
      </div>
      <div class="mt-8 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/60 lg:flex-row">
        <p>© 2026 Kenya Tradex. Freight forwarding and logistics from Mombasa, Kenya.</p>
        <p>Send route, cargo type, invoice value, packing list and BL/AWB where available.</p>
      </div>
    </div>
  </footer>
</template>
