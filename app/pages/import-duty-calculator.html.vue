<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { data: page } = await useAsyncData('page:import-duty-calculator', () => queryCollection('pages').where('slug', '=', 'import-duty-calculator').first())

if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Calculator Page Not Found' })

const calculatorBlocks = computed(() => page.value?.blocks || [])
const factorsBlock = computed(() => calculatorBlocks.value.find((block) => block.type === 'list') || calculatorBlocks.value[1])

useSeoMeta(getEditablePageSeo(page.value))
useHead(() => getEditablePageHead(page.value))
</script>

<template>
  <!-- JOURNEY: Calculator visitors want a grounded cost signal before they commit to a shipment or clearance file. The page gives a fast estimate, then moves them toward a reviewed document-based quote. -->
  <div>
    <section class="hero">
      <NuxtImg class="hero-media" :src="page?.hero?.image || page?.image || '/images/calculator-hero.jpg'" :alt="page?.hero?.imageAlt || page?.hero?.heading || 'Kenya import duty calculator'" width="1600" height="900" />
      <div class="container hero-grid">
        <div>
          <span class="eyebrow"><Icon class="ui-icon" name="lucide:calculator" aria-hidden="true" /> Import duty calculator</span>
          <h1>{{ page?.hero?.heading || page?.title }}</h1>
          <p class="lead on-dark">{{ page?.hero?.lead || page?.description }}</p>
        </div>
        <aside class="hero-card"><h2>{{ calculatorBlocks[5]?.title || 'Need a reviewed estimate?' }}</h2><p>{{ calculatorBlocks[5]?.body || 'Share your cargo documents or vehicle details and Kenya Tradex can review the likely clearance path.' }}</p><a class="btn" href="#quote-form">Request help</a></aside>
      </div>
    </section>
    <div class="container content-layout">
      <div>
        <ImportDutyCalculator />
        <section class="content-block">
          <h2>{{ factorsBlock?.title || 'What affects final import duty?' }}</h2>
          <p v-if="factorsBlock?.body">{{ factorsBlock.body }}</p>
          <ul class="check-list">
            <li v-for="item in factorsBlock?.items || []" :key="item"><Icon class="ui-icon" name="lucide:circle-check" aria-hidden="true" /><span>{{ item }}</span></li>
          </ul>
        </section>
      </div>
      <aside id="quote-form" class="sidebar"><div class="quote-card"><QuoteForm v-if="page?.form" v-bind="page.form" /></div></aside>
    </div>
  </div>
</template>
