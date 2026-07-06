<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { data: page } = await useAsyncData('page:home', () => queryCollection('pages').where('slug', '=', 'home').first())
const { data: settings } = await useAsyncData('site:settings:home', () => queryCollection('site').where('slug', '=', 'settings').first())

if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Home Page Not Found' })

const blocks = computed(() => page.value?.blocks || [])
const heroNote = computed(() => blocks.value[0]?.paragraphs?.[0])
const servicesBlock = computed(() => blocks.value.find((block) => block.title?.includes('Logistics services')))
const coverageBlock = computed(() => blocks.value.find((block) => block.title?.includes('Coverage')))
const advantagesBlock = computed(() => blocks.value.find((block) => block.title?.includes('Operational advantages')))
const contactBlock = computed(() => blocks.value.find((block) => block.title?.includes('Request a freight quote')))
const serviceLinks = computed(() => settings.value?.services || [])
const moreServiceLinks = computed(() => settings.value?.moreServiceLinks || [])
const coverage = computed(() => settings.value?.coverage || [])
const credentials = computed(() => settings.value?.credentials || [])

useSeoMeta(getEditablePageSeo(page.value))
useHead(() => getEditablePageHead(page.value))
</script>

<template>
  <!-- JOURNEY: Importers arrive worried about cargo release, cost, and accountability. The page first proves Kenya Tradex is licensed and reachable, then routes visitors by cargo job, shows corridor coverage, and ends with the exact quote path. -->
  <div>
    <section class="relative isolate overflow-hidden bg-[var(--color-brand-navy)] py-24 text-white lg:py-32">
      <NuxtImg class="absolute inset-0 z-[-2] h-full w-full object-cover" :src="page?.hero?.image || page?.image || '/images/home-hero-poster.jpg'" :alt="page?.hero?.imageAlt || page?.hero?.heading || 'Freight forwarding and customs clearance in Kenya'" width="1280" height="768" preload fetchpriority="high" />
      <div class="absolute inset-0 z-[-1] bg-[linear-gradient(120deg,oklch(16%_0.062_258/.92),oklch(22%_0.075_258/.72),oklch(42%_0.17_27/.45))]" />
      <div class="mx-auto grid w-[min(1180px,calc(100%-48px))] items-center gap-8 lg:grid-cols-[1.25fr_.75fr]">
        <div>
          <span class="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-black text-white"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:anchor" aria-hidden="true" /> {{ page?.hero?.eyebrow || settings?.brand?.headerTagline || 'Mombasa & Nairobi Freight Coordination' }}</span>
          <h1 class="mt-4 mb-4 max-w-[12.5ch] text-4xl font-black tracking-[-0.035em] text-white sm:text-5xl lg:text-7xl">{{ page?.hero?.heading || page?.title }}</h1>
          <p class="max-w-2xl text-lg text-white/90">{{ page?.hero?.lead || page?.description }}</p>
          <p v-if="heroNote" class="mt-4 max-w-2xl text-sm text-white/80"><strong>{{ heroNote }}</strong></p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a class="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--color-brand-red)] px-5 py-3 font-black text-white no-underline shadow-lg transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-red-dark)]" href="https://wa.me/254721596259?text=Hello%20Kenya%20Tradex%2C%20I%20need%20a%20freight%20quote" target="_blank" rel="noopener"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:message-circle" aria-hidden="true" /> Send route details</a>
            <a class="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-3 font-black text-white no-underline transition hover:-translate-y-0.5 hover:bg-white/20" href="https://wa.me/254721596259?text=Track%20BL%20No%3A" target="_blank" rel="noopener"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:crosshair" aria-hidden="true" /> Track cargo by BL</a>
          </div>
          <div class="mt-8 flex flex-wrap gap-3" aria-label="Quick client actions">
            <a class="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white no-underline backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20" href="https://wa.me/254721596259?text=Hello%20Kenya%20Tradex%2C%20quote%201x20ft%20container%20from%20Mombasa%20to%20Kampala" target="_blank" rel="noopener"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:message-circle" aria-hidden="true" /><span>Quote Mombasa to Kampala</span></a>
            <a class="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white no-underline backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20" href="https://wa.me/254721596259?text=Track%20BL%20No%3A" target="_blank" rel="noopener"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:crosshair" aria-hidden="true" /><span>Track cargo by BL No.</span></a>
            <NuxtLink class="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white no-underline backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20" to="/import-duty-calculator.html"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:calculator" aria-hidden="true" /><span>Estimate import duty</span></NuxtLink>
          </div>
        </div>
        <aside class="rounded-[1.75rem] border border-white/15 bg-white/12 p-6 text-white shadow-2xl backdrop-blur-xl" aria-label="Operations summary">
          <p class="mb-3 text-sm font-black uppercase tracking-wide text-white/70">Operations desk</p>
          <h2 class="mb-4 text-3xl font-black text-white lg:text-4xl">{{ blocks[2]?.title || 'One accountable file from arrival notice to delivery.' }}</h2>
          <dl class="grid gap-3">
            <div class="rounded-2xl bg-white/10 p-4"><dt class="text-xs font-black uppercase tracking-wide text-white/60">Primary nodes</dt><dd class="m-0 font-bold text-white">{{ settings?.brand?.tagline || 'Mombasa Port, Nairobi ICD, JKIA' }}</dd></div>
            <div class="rounded-2xl bg-white/10 p-4"><dt class="text-xs font-black uppercase tracking-wide text-white/60">Document flow</dt><dd class="m-0 font-bold text-white">{{ blocks[3]?.title || 'IDF, entries, duty exposure, release orders' }}</dd></div>
            <div class="rounded-2xl bg-white/10 p-4"><dt class="text-xs font-black uppercase tracking-wide text-white/60">Corridors</dt><dd class="m-0 font-bold text-white">{{ coverage.join(', ') }}</dd></div>
          </dl>
          <NuxtLink class="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--color-brand-red)] px-5 py-3 font-black text-white no-underline shadow-lg transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-red-dark)]" to="/customs-clearance-kenya.html"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:clipboard-list" aria-hidden="true" /> View customs clearance</NuxtLink>
        </aside>
      </div>
    </section>

    <section class="bg-white py-6 shadow-sm">
      <div class="mx-auto grid w-[min(1180px,calc(100%-48px))] gap-4 md:grid-cols-2 lg:grid-cols-4" aria-label="Kenya Tradex operating credentials">
        <div class="border-l-4 border-[var(--color-brand-red)] bg-slate-50 p-5"><span class="text-xs font-black uppercase tracking-wide text-[var(--color-text-muted)]">Authority</span><strong class="block text-xl font-black text-[var(--color-text-primary)]">KIFWA M2294</strong><p class="mb-0 text-sm text-[var(--color-text-muted)]">Customs License CAL/001526/24 and KPA 101839 for licensed cargo work.</p></div>
        <div class="border-l-4 border-[var(--color-brand-red)] bg-slate-50 p-5"><span class="text-xs font-black uppercase tracking-wide text-[var(--color-text-muted)]">File volume</span><strong class="block text-xl font-black text-[var(--color-text-primary)]">{{ settings?.proof?.split('|')[0]?.trim() || '200+ monthly' }}</strong><p class="mb-0 text-sm text-[var(--color-text-muted)]">Port, airport and regional workflows handled by a dedicated operations desk.</p></div>
        <div class="border-l-4 border-[var(--color-brand-red)] bg-slate-50 p-5"><span class="text-xs font-black uppercase tracking-wide text-[var(--color-text-muted)]">Custody record</span><strong class="block text-xl font-black text-[var(--color-text-primary)]">{{ settings?.proof?.split('|')[1]?.trim() || 'Zero cargo loss' }}</strong><p class="mb-0 text-sm text-[var(--color-text-muted)]">Consignments stay visible from arrival notice through release and handoff.</p></div>
        <div class="border-l-4 border-[var(--color-brand-red)] bg-slate-50 p-5"><span class="text-xs font-black uppercase tracking-wide text-[var(--color-text-muted)]">Credentials</span><strong class="block text-xl font-black text-[var(--color-text-primary)]">{{ credentials[0] || 'KRA PIN P051396680R' }}</strong><p class="mb-0 text-sm text-[var(--color-text-muted)]">{{ credentials.slice(1).join(' | ') }}</p></div>
      </div>
    </section>

    <section id="services" class="py-16 lg:py-28">
      <div class="mx-auto w-[min(1180px,calc(100%-48px))]">
        <div class="mb-8 max-w-3xl lg:mb-12">
          <p class="mb-4 font-black text-[var(--color-brand-red-dark)]">Cargo desk menu</p>
          <h2 class="mb-4 text-3xl font-black tracking-[-0.025em] text-[var(--color-text-primary)] lg:text-5xl">{{ servicesBlock?.title || 'Pick the point where your shipment needs control' }}</h2>
          <p class="max-w-2xl text-lg text-[var(--color-text-muted)]">{{ servicesBlock?.body || 'Every service page keeps the operating details visible: documents, route, duty exposure and the next handoff.' }}</p>
        </div>
        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink v-for="(service, index) in serviceLinks" :key="service.href" class="rounded-[1.5rem] border border-[color:oklch(22%_0.075_258/.12)] bg-white p-6 text-[var(--color-text-primary)] no-underline shadow-sm transition hover:-translate-y-1 hover:shadow-xl" :to="service.href">
            <span class="text-sm font-black text-[var(--color-brand-red)]">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-[var(--color-brand-red)]"><Icon class="h-[1.1em] w-[1.1em] shrink-0" :name="service.icon || 'lucide:box'" aria-hidden="true" /></span>
            <h3 class="mb-3 text-xl font-extrabold">{{ service.label }}</h3>
            <p class="text-[var(--color-text-muted)]">{{ service.description }}</p>
            <span class="mt-4 inline-block font-black text-[var(--color-brand-red)]">Open service file →</span>
          </NuxtLink>
        </div>
        <p class="mt-8 text-sm text-[var(--color-text-muted)]">
          Also available:
          <template v-for="(link, index) in moreServiceLinks" :key="link.href">
            <NuxtLink class="font-bold text-[var(--color-brand-red)] no-underline hover:underline" :to="link.href">{{ link.label }}</NuxtLink><span v-if="index < moreServiceLinks.length - 1"> | </span>
          </template>
        </p>
      </div>
    </section>

    <section id="coverage" class="py-16 lg:py-28">
      <div class="mx-auto w-[min(1180px,calc(100%-48px))] rounded-[2rem] bg-[var(--color-brand-navy)] p-8 text-white">
        <div class="mb-8 max-w-3xl lg:mb-12">
          <p class="mb-4 font-black text-red-200">Corridor map</p>
          <h2 class="mb-4 text-3xl font-black tracking-[-0.025em] text-white lg:text-5xl">{{ coverageBlock?.title || 'Coverage across Kenya and major East African trade corridors' }}</h2>
          <p class="max-w-2xl text-lg text-white/85">{{ coverageBlock?.body || 'Cargo decisions are made by route, risk and timing. Kenya Tradex keeps the operating map visible from the first quote.' }}</p>
        </div>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="country in coverage" :key="country" class="flex items-center gap-2 rounded-[1.5rem] border border-white/10 bg-white/10 p-6 text-white"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:flag" aria-hidden="true" /> {{ country }}</div>
        </div>
      </div>
    </section>

    <section class="py-16 lg:py-28">
      <div class="mx-auto w-[min(1180px,calc(100%-48px))]">
        <div class="mb-8 flex max-w-3xl flex-col justify-between gap-4 lg:mb-12 lg:max-w-none lg:flex-row lg:items-end">
          <h2 class="mb-4 text-3xl font-black tracking-[-0.025em] text-[var(--color-text-primary)] lg:text-5xl">{{ advantagesBlock?.title || 'Operational advantages for importers and exporters' }}</h2>
          <p class="max-w-2xl text-lg text-[var(--color-text-muted)]">{{ advantagesBlock?.body || 'A single logistics partner for freight coordination, customs support and regional cargo movement.' }}</p>
        </div>
        <div class="grid gap-5 md:grid-cols-3">
          <div v-for="(item, index) in advantagesBlock?.items || []" :key="item" class="rounded-[1.5rem] border border-[color:oklch(22%_0.075_258/.12)] bg-white p-6 text-[var(--color-text-primary)] shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><Icon class="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-[var(--color-brand-red)]" :name="['lucide:headphones', 'lucide:globe-2', 'lucide:scale'][index] || 'lucide:circle-check'" aria-hidden="true" /><div><h3 class="mb-3 text-xl font-extrabold">{{ item.split(':')[0] || item }}</h3><p class="text-[var(--color-text-muted)]">{{ item.includes(':') ? item.split(':').slice(1).join(':').trim() : item }}</p></div></div>
        </div>
      </div>
    </section>

    <section id="contact" class="bg-white py-16 lg:py-28">
      <div class="mx-auto w-[min(1180px,calc(100%-48px))]">
        <div class="mb-8 grid max-w-none gap-5 lg:mb-12 lg:grid-cols-[1fr_.75fr]">
          <div>
            <p class="mb-4 font-black text-[var(--color-brand-red-dark)]">Quote intake</p>
            <h2 class="mb-4 text-3xl font-black tracking-[-0.025em] text-[var(--color-text-primary)] lg:text-5xl">Send the file once. Get a practical next step.</h2>
            <div class="mt-4 flex flex-wrap gap-2" aria-label="Quote review cues">
              <span class="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-2 text-sm font-bold text-[var(--color-brand-red-dark)]"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:file-check-2" aria-hidden="true" /> Documents checked</span>
              <span class="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-2 text-sm font-bold text-[var(--color-brand-red-dark)]"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:route" aria-hidden="true" /> Route confirmed</span>
              <span class="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-2 text-sm font-bold text-[var(--color-brand-red-dark)]"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:clock-3" aria-hidden="true" /> Next step returned</span>
            </div>
          </div>
          <p class="max-w-2xl text-lg text-[var(--color-text-muted)]">For freight, clearance, warehousing, project cargo or cross-border transport, Kenya Tradex responds best when the route, cargo type and document status are visible from the start.</p>
        </div>
        <div class="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <aside class="rounded-[1.75rem] bg-[var(--color-brand-navy)] p-6 text-white" aria-label="Kenya Tradex direct contact details">
            <div class="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-bold"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:badge-check" aria-hidden="true" /> Licensed freight desk</div>
            <h3 class="mb-3 text-xl font-extrabold text-white">Kenya Tradex</h3>
            <p class="text-white/80">{{ contactBlock?.body || 'Mombasa-based coordination for cargo files moving through port, ICD, JKIA and regional corridors.' }}</p>
            <div class="my-5 grid gap-3 sm:grid-cols-2" aria-label="Fast contact options">
              <a class="flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-white no-underline" :href="`tel:${settings?.contact?.phoneHref || '+254721596259'}`"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:phone" aria-hidden="true" /><span>Call<br><strong>{{ settings?.contact?.phone || '+254 721 596 259' }}</strong></span></a>
              <a class="flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-white no-underline" :href="`${settings?.contact?.whatsapp || 'https://wa.me/254721596259'}?text=Hello%20Kenya%20Tradex%2C%20I%20need%20cargo%20support`" target="_blank" rel="noopener"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:message-circle" aria-hidden="true" /><span>WhatsApp<br><strong>Send cargo details</strong></span></a>
            </div>
            <dl class="space-y-4">
              <div class="grid gap-1"><dt class="text-xs font-black uppercase text-white/60">Office</dt><dd class="m-0 flex gap-2"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:map-pin" aria-hidden="true" /> {{ settings?.contact?.address || 'Liwatoni Road, Mombasa, Kenya' }}</dd></div>
              <div class="grid gap-1"><dt class="text-xs font-black uppercase text-white/60">Email</dt><dd class="m-0 flex gap-2"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:mail" aria-hidden="true" /> <a :href="`mailto:${settings?.contact?.email || 'info@kenyatradex.africa'}`">{{ settings?.contact?.email || 'info@kenyatradex.africa' }}</a></dd></div>
              <div class="grid gap-1"><dt class="text-xs font-black uppercase text-white/60">Registration</dt><dd class="m-0 flex gap-2"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:id-card" aria-hidden="true" /> KRA PIN P051396680R</dd></div>
              <div class="grid gap-1"><dt class="text-xs font-black uppercase text-white/60">Licenses</dt><dd class="m-0 flex gap-2"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:shield-check" aria-hidden="true" /><span class="grid"><span>KIFWA Member No: M2294</span><span>Customs License: CAL/001526/24</span></span></dd></div>
            </dl>
            <div class="mt-5 rounded-2xl bg-white/10 p-4">
              <span>What to send first</span>
              <p>Route, cargo type, invoice value, packing list, BL/AWB if available, and destination deadline.</p>
            </div>
          </aside>
          <div class="rounded-[1.75rem] border border-[color:oklch(22%_0.075_258/.12)] bg-white p-6 text-[var(--color-text-primary)] shadow-2xl">
            <QuoteForm v-if="page?.form" v-bind="page.form" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
