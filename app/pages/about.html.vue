<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { data: page } = await useAsyncData('page:about', () => queryCollection('pages').where('slug', '=', 'about').first())
const { data: settings } = await useAsyncData('site:settings:about', () => queryCollection('site').where('slug', '=', 'settings').first())

if (!page.value) throw createError({ statusCode: 404, statusMessage: 'About Page Not Found' })

const blocks = computed(() => page.value?.blocks || [])
const featureBlocks = computed(() => blocks.value.filter((block) => block.type === 'list').slice(0, 3))
const detailBlocks = computed(() => blocks.value.filter((block) => !featureBlocks.value.includes(block)))
const credentials = computed(() => settings.value?.credentials || [])

useSeoMeta(getEditablePageSeo(page.value))
useHead(getEditablePageHead(page.value))
</script>

<template>
  <!-- JOURNEY: Prospects use the about page to verify legitimacy before sharing cargo documents. The page foregrounds licenses, operating nodes, and the document-first way Kenya Tradex manages cargo risk. -->
  <div>
    <section class="relative isolate overflow-hidden bg-[var(--color-brand-navy)] py-24 text-white lg:py-32"><NuxtImg class="absolute inset-0 z-[-2] h-full w-full object-cover" :src="page?.hero?.image || page?.image || '/images/customs-hero-1200.jpg'" :alt="page?.hero?.imageAlt || page?.hero?.heading || 'Kenya Tradex logistics company'" width="1600" height="900" /><div class="absolute inset-0 z-[-1] bg-[linear-gradient(120deg,oklch(16%_0.062_258/.92),oklch(22%_0.075_258/.72),oklch(42%_0.17_27/.45))]" /><div class="mx-auto grid w-[min(1180px,calc(100%-48px))] items-center gap-8 lg:grid-cols-[1.25fr_.75fr]"><div><span class="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-black text-white"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:building-2" aria-hidden="true" /> About Kenya Tradex</span><h1 class="mt-4 mb-4 max-w-[12.5ch] text-4xl font-black tracking-[-0.035em] text-white sm:text-5xl lg:text-7xl">{{ page?.hero?.heading || page?.title }}</h1><p class="max-w-2xl text-lg text-white/90">{{ page?.hero?.lead || page?.description }}</p></div><aside class="rounded-[1.75rem] border border-white/15 bg-white/12 p-6 text-white shadow-2xl backdrop-blur-xl"><h2 class="mb-4 text-3xl font-black text-white">Credentials</h2><ul class="m-0 list-none space-y-3 p-0"><li v-for="credential in credentials" :key="credential" class="flex gap-3"><Icon class="mt-1 h-[1.1em] w-[1.1em] shrink-0 text-[var(--color-brand-red)]" name="lucide:circle-check" aria-hidden="true" /> {{ credential }}</li></ul></aside></div></section>
    <section class="py-16 lg:py-28"><div class="mx-auto w-[min(1180px,calc(100%-48px))]"><div class="grid gap-5 md:grid-cols-3"><article v-for="(block, index) in featureBlocks" :key="block.title" class="rounded-[1.5rem] border border-[color:oklch(22%_0.075_258/.12)] bg-white p-6 text-[var(--color-text-primary)] shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><Icon class="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-[var(--color-brand-red)]" :name="['lucide:anchor', 'lucide:route', 'lucide:file-check-2'][index] || 'lucide:circle-check'" aria-hidden="true" /><div><h3 class="mb-3 text-xl font-extrabold">{{ block.title }}</h3><p class="text-[var(--color-text-muted)]">{{ block.body || block.items?.[0] }}</p></div></article></div></div></section>
    <section class="pb-16 lg:pb-28"><div class="mx-auto grid w-[min(1180px,calc(100%-48px))] gap-5 md:grid-cols-2"><article v-for="block in detailBlocks" :key="block.title || block.body" class="rounded-[1.5rem] border border-[color:oklch(22%_0.075_258/.12)] bg-white p-6 text-[var(--color-text-primary)] shadow-sm"><h2 v-if="block.title" class="mb-4 text-3xl font-black tracking-[-0.025em] text-[var(--color-text-primary)]">{{ block.title }}</h2><p v-if="block.body" class="text-[var(--color-text-muted)]">{{ block.body }}</p><p v-for="paragraph in block.paragraphs || []" :key="paragraph" class="text-[var(--color-text-muted)]">{{ paragraph }}</p><ul v-if="block.items?.length" class="m-0 list-none space-y-3 p-0"><li v-for="item in block.items" :key="item" class="flex gap-3 text-[var(--color-text-muted)]"><Icon class="mt-1 h-[1.1em] w-[1.1em] shrink-0 text-[var(--color-brand-red)]" name="lucide:circle-check" aria-hidden="true" /><span>{{ item }}</span></li></ul></article></div></section>
  </div>
</template>
