<script setup lang="ts">
definePageMeta({ layout: 'blog' })

const { data: page } = await useAsyncData('page:blog', () => queryCollection('pages').where('slug', '=', 'blog').first())
const { data: posts } = await useAsyncData('blog-posts', () => queryCollection('blog').order('date', 'DESC').all())

if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Blog Page Not Found' })

useSeoMeta(getEditablePageSeo(page.value))
useHead(getEditablePageHead(page.value))
</script>

<template>
  <!-- JOURNEY: Readers need a quick, credible answer before they contact a clearing agent. The blog index organizes practical guides and makes the next step feel like asking an operator, not reading generic content. -->
  <section :data-content-id="page?.id" class="pt-16 pb-16 lg:pt-24 lg:pb-20"><div class="site-container min-w-0"><div class="mx-auto mb-8 max-w-3xl text-center lg:mb-12"><span class="inline-flex items-center gap-2 rounded-full border border-white/25 bg-[var(--color-brand-navy)] px-4 py-2 text-sm font-black text-white"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:newspaper" aria-hidden="true" /> {{ page?.hero?.eyebrow || 'Logistics Blog' }}</span><h1 class="mx-auto mt-4 mb-4 max-w-[13.5ch] text-4xl font-black tracking-[-0.035em] text-[var(--color-text-primary)] sm:text-5xl lg:text-7xl">{{ page?.hero?.heading || page?.title }}</h1><p class="mx-auto max-w-2xl text-lg text-[var(--color-text-muted)]">{{ page?.hero?.lead || page?.description }}</p></div><div class="grid min-w-0 gap-5 md:grid-cols-2 lg:grid-cols-3"><NuxtLink v-for="post in posts" :key="post.path" class="flex h-full min-w-0 flex-col rounded-2xl border border-[var(--color-border)] bg-white p-6 text-[var(--color-text-primary)] no-underline transition hover:border-[var(--color-brand-red)]" :to="post.path"><NuxtImg class="mb-4 aspect-[8/5] w-full rounded-xl object-cover" :src="post.image || page?.image || '/images/home-hero-og.jpg'" :alt="post.title" width="800" height="500" loading="lazy" /><div class="flex min-w-0 flex-1 flex-col"><h2 class="mb-3 break-words text-xl font-extrabold">{{ post.title }}</h2><p class="text-[var(--color-text-muted)]">{{ post.description }}</p><p class="mt-auto pt-4 font-extrabold text-[var(--color-brand-red)]">Read guide →</p></div></NuxtLink></div><NewsletterForm /></div></section>
</template>
