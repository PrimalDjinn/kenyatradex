<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { data: page } = await useAsyncData('page:import-duty-calculator', () => queryCollection('pages').where('slug', '=', 'import-duty-calculator').first())

if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Calculator Page Not Found' })

const calculatorBlocks = computed(() => page.value?.blocks || [])
const factorsBlock = computed(() => calculatorBlocks.value.find((block) => block.type === 'list') || calculatorBlocks.value[1])
const supportingBlocks = computed(() => calculatorBlocks.value.filter((block) => block !== factorsBlock.value && (block.title || block.body || block.paragraphs?.length || block.items?.length)))

useSeoMeta(getEditablePageSeo(page.value))
useHead(() => getEditablePageHead(page.value))
</script>

<template>
  <!-- JOURNEY: Calculator visitors want a grounded cost signal before they commit to a shipment or clearance file. The page gives a fast estimate, then moves them toward a reviewed document-based quote. -->
  <div>
    <section class="relative isolate overflow-hidden bg-[var(--color-brand-navy)] py-24 text-white lg:py-32">
      <NuxtImg class="absolute inset-0 z-[-2] h-full w-full object-cover" :src="page?.hero?.image || page?.image || '/images/calculator-hero.jpg'" :alt="page?.hero?.imageAlt || page?.hero?.heading || 'Kenya import duty calculator'" width="1600" height="900" />
      <div class="absolute inset-0 z-[-1] bg-[linear-gradient(120deg,oklch(16%_0.062_258/.92),oklch(22%_0.075_258/.72),oklch(42%_0.17_27/.45))]" />
      <div class="mx-auto grid w-[min(1180px,calc(100%-48px))] items-center gap-8 lg:grid-cols-[1.25fr_.75fr]">
        <div>
          <span class="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-black text-white"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:calculator" aria-hidden="true" /> Import duty calculator</span>
          <h1 class="mt-4 mb-4 max-w-[12.5ch] text-4xl font-black tracking-[-0.035em] text-white sm:text-5xl lg:text-7xl">{{ page?.hero?.heading || page?.title }}</h1>
          <p class="max-w-2xl text-lg text-white/90">{{ page?.hero?.lead || page?.description }}</p>
        </div>
        <aside class="rounded-[1.75rem] border border-white/15 bg-white/12 p-6 text-white shadow-2xl backdrop-blur-xl"><h2 class="mb-4 text-3xl font-black text-white">{{ calculatorBlocks[5]?.title || 'Need a reviewed estimate?' }}</h2><p>{{ calculatorBlocks[5]?.body || 'Share your cargo documents or vehicle details and Kenya Tradex can review the likely clearance path.' }}</p><a class="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--color-brand-red)] px-5 py-3 font-black text-white no-underline shadow-lg transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-red-dark)]" href="#quote-form">Request help</a></aside>
      </div>
    </section>
    <div class="mx-auto grid w-[min(1180px,calc(100%-48px))] gap-8 py-16 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        <ImportDutyCalculator />
        <section class="mb-6 rounded-[1.5rem] border border-[color:oklch(22%_0.075_258/.12)] bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-3xl font-black tracking-[-0.025em] text-[var(--color-text-primary)] lg:text-5xl">{{ factorsBlock?.title || 'What affects final import duty?' }}</h2>
          <p v-if="factorsBlock?.body" class="text-[var(--color-text-muted)]">{{ factorsBlock.body }}</p>
          <ul class="m-0 list-none space-y-3 p-0">
            <li v-for="item in factorsBlock?.items || []" :key="item" class="flex gap-3 text-[var(--color-text-muted)]"><Icon class="mt-1 h-[1.1em] w-[1.1em] shrink-0 text-[var(--color-brand-red)]" name="lucide:circle-check" aria-hidden="true" /><span>{{ item }}</span></li>
          </ul>
        </section>
        <section v-for="block in supportingBlocks" :key="block.title || block.body" class="mb-6 rounded-[1.5rem] border border-[color:oklch(22%_0.075_258/.12)] bg-white p-6 shadow-sm">
          <h2 v-if="block.title" class="mb-4 text-3xl font-black tracking-[-0.025em] text-[var(--color-text-primary)] lg:text-5xl">{{ block.title }}</h2>
          <p v-if="block.body" class="text-[var(--color-text-muted)]">{{ block.body }}</p>
          <p v-for="paragraph in block.paragraphs || []" :key="paragraph" class="text-[var(--color-text-muted)]">{{ paragraph }}</p>
          <ul v-if="block.items?.length" class="m-0 list-none space-y-3 p-0">
            <li v-for="item in block.items" :key="item" class="flex gap-3 text-[var(--color-text-muted)]"><Icon class="mt-1 h-[1.1em] w-[1.1em] shrink-0 text-[var(--color-brand-red)]" name="lucide:circle-check" aria-hidden="true" /><span>{{ item }}</span></li>
          </ul>
        </section>
      </div>
      <aside id="quote-form" class="space-y-5 lg:sticky lg:top-28 lg:self-start"><div class="rounded-[1.75rem] border border-[color:oklch(22%_0.075_258/.12)] bg-white p-6 text-[var(--color-text-primary)] shadow-2xl"><QuoteForm v-if="page?.form" v-bind="page.form" /></div></aside>
    </div>
  </div>
</template>
