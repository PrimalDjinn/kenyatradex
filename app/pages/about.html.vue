<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { data: page } = await useAsyncData('page:about', () => queryCollection('pages').where('slug', '=', 'about').first())
const { data: settings } = await useAsyncData('site:settings:about', () => queryCollection('site').where('slug', '=', 'settings').first())

if (!page.value) throw createError({ statusCode: 404, statusMessage: 'About Page Not Found' })

const blocks = computed(() => page.value?.blocks || [])
const featureBlocks = computed(() => blocks.value.filter((block) => block.type === 'list').slice(0, 3))
const credentials = computed(() => settings.value?.credentials || [])

useSeoMeta(getEditablePageSeo(page.value))
useHead(() => getEditablePageHead(page.value))
</script>

<template>
  <!-- JOURNEY: Prospects use the about page to verify legitimacy before sharing cargo documents. The page foregrounds licenses, operating nodes, and the document-first way Kenya Tradex manages cargo risk. -->
  <div>
    <section class="hero"><NuxtImg class="hero-media" :src="page?.hero?.image || page?.image || '/images/customs-hero-1200.jpg'" :alt="page?.hero?.imageAlt || page?.hero?.heading || 'Kenya Tradex logistics company'" width="1600" height="900" /><div class="container hero-grid"><div><span class="eyebrow"><Icon class="ui-icon" name="lucide:building-2" aria-hidden="true" /> About Kenya Tradex</span><h1>{{ page?.hero?.heading || page?.title }}</h1><p class="lead on-dark">{{ page?.hero?.lead || page?.description }}</p></div><aside class="hero-card"><h2>Credentials</h2><ul><li v-for="credential in credentials" :key="credential"><Icon class="ui-icon" name="lucide:circle-check" aria-hidden="true" /> {{ credential }}</li></ul></aside></div></section>
    <section class="section"><div class="container"><div class="features"><article v-for="(block, index) in featureBlocks" :key="block.title" class="feature"><Icon class="ui-icon feature-icon" :name="['lucide:anchor', 'lucide:route', 'lucide:file-check-2'][index] || 'lucide:circle-check'" aria-hidden="true" /><div><h3>{{ block.title }}</h3><p>{{ block.body || block.items?.[0] }}</p></div></article></div></div></section>
  </div>
</template>
