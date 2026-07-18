<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { data: page } = await useAsyncData('page:import-duty-calculator', () => queryCollection('pages').where('slug', '=', 'import-duty-calculator').first())

if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Calculator Page Not Found' })

const calculatorBlocks = computed(() => page.value?.blocks || [])
const factorsBlock = computed(() => calculatorBlocks.value.find((block) => block.type === 'list') || calculatorBlocks.value[1])
const supportingBlocks = computed(() => calculatorBlocks.value.filter((block, index) => index > 0 && block !== factorsBlock.value && block.title !== 'Additional legacy details' && (block.title || block.body || block.paragraphs?.length || block.items?.length || block.links?.length)))

useSeoMeta(getEditablePageSeo(page.value))
useHead(getEditablePageHead(page.value))
</script>

<template>
  <!-- JOURNEY: Calculator visitors want a grounded cost signal before they commit to a shipment or clearance file. The page gives a fast estimate, then moves them toward a reviewed document-based quote. -->
  <div>
    <section class="page-hero relative isolate overflow-hidden bg-[var(--color-brand-navy)] text-white">
      <NuxtImg class="absolute inset-0 z-[-2] h-full w-full object-cover" :src="page?.hero?.image || page?.image || '/images/calculator-hero.jpg'" :alt="page?.hero?.imageAlt || page?.hero?.heading || 'Kenya import duty calculator'" width="1600" height="900" />
      <div class="absolute inset-0 z-[-1] bg-[linear-gradient(120deg,oklch(16%_0.062_258/.92),oklch(22%_0.075_258/.72),oklch(42%_0.17_27/.45))]" />
      <div class="site-container grid items-end gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,.65fr)]">
        <div>
          <span class="inline-flex items-center gap-2 border-l-2 border-[var(--color-brand-red)] pl-3 text-sm font-bold uppercase tracking-[.12em] text-white/75"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:calculator" aria-hidden="true" /> Import duty calculator</span>
          <h1 class="page-hero-title mt-5 text-white">{{ page?.hero?.heading || page?.title }}</h1>
          <p class="mt-6 max-w-2xl text-lg text-white/85">{{ page?.hero?.lead || page?.description }}</p>
        </div>
        <aside class="border-t border-white/25 pt-5 text-white lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0"><p class="mb-2 text-xs font-bold uppercase tracking-[.16em] text-white/55">Before relying on the result</p><h2 class="text-2xl font-extrabold text-white">Plan with the estimate. Clear with reviewed documents.</h2><p class="mt-3 text-white/75">Invoice, BL/AWB and technical specifications determine the final assessment.</p><a class="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand-red)] px-5 py-3 font-extrabold text-white no-underline transition hover:bg-[var(--color-brand-red-dark)]" href="#quote-form">Request a reviewed quote</a></aside>
      </div>
    </section>
    <div class="site-container grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_330px] lg:py-20">
      <div class="min-w-0 space-y-8">
        <ImportDutyCalculator />
        <p class="border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-950"><strong>Disclaimer:</strong> This calculator provides indicative estimates based on the legacy KRA CRSP methodology. Actual duties may vary. For a binding quote, send your <strong>Commercial Invoice</strong>, <strong>Bill of Lading</strong>, and <strong>Technical Data Sheets</strong>.</p>
        <section class="content-flow border-b border-[var(--color-border)] pb-8">
          <h2 class="section-title text-[var(--color-text-primary)]">{{ factorsBlock?.title || 'What affects final import duty?' }}</h2>
          <p v-if="factorsBlock?.body" class="text-[var(--color-text-muted)]">{{ factorsBlock.body }}</p>
          <ul class="m-0 list-none space-y-3 p-0">
            <li v-for="item in factorsBlock?.items || []" :key="item" class="flex gap-3 text-[var(--color-text-muted)]"><Icon class="mt-1 h-[1.1em] w-[1.1em] shrink-0 text-[var(--color-brand-red)]" name="lucide:circle-check" aria-hidden="true" /><span>{{ item }}</span></li>
          </ul>
        </section>
        <section v-for="block in supportingBlocks" :key="block.title || block.body" class="content-flow border-b border-[var(--color-border)] pb-8">
          <h2 v-if="block.title" class="section-title text-[var(--color-text-primary)]">{{ block.title }}</h2>
          <p v-if="block.body" class="text-[var(--color-text-muted)]">{{ block.body }}</p>
          <p v-for="paragraph in block.paragraphs || []" :key="paragraph" class="text-[var(--color-text-muted)]">{{ paragraph }}</p>
          <ul v-if="block.items?.length && !block.links?.length" class="m-0 list-none space-y-3 p-0">
            <li v-for="item in block.items" :key="item" class="flex gap-3 text-[var(--color-text-muted)]"><Icon class="mt-1 h-[1.1em] w-[1.1em] shrink-0 text-[var(--color-brand-red)]" name="lucide:circle-check" aria-hidden="true" /><span>{{ item }}</span></li>
          </ul>
          <div v-if="block.links?.length" class="flex flex-wrap gap-x-5 gap-y-2"><NuxtLink v-for="link in block.links" :key="link.href" class="font-bold text-[var(--color-brand-red-dark)] underline decoration-transparent underline-offset-4 hover:decoration-current" :to="link.href">{{ link.label }}</NuxtLink></div>
        </section>
      </div>
      <aside id="quote-form" class="space-y-5 lg:sticky lg:top-24 lg:self-start"><div class="rounded-2xl border border-[var(--color-border)] bg-white p-4 text-[var(--color-text-primary)] shadow-lg sm:p-6"><QuoteForm v-if="page?.form" v-bind="page.form" /></div></aside>
    </div>
  </div>
</template>
