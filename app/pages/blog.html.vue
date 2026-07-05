<script setup lang="ts">
definePageMeta({ layout: 'blog' })

const { data: page } = await useAsyncData('page:blog', () => queryCollection('pages').where('slug', '=', 'blog').first())
const { data: posts } = await useAsyncData('blog-posts', () => queryCollection('blog').order('date', 'DESC').all())

if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Blog Page Not Found' })

useSeoMeta(getEditablePageSeo(page.value))
useHead(() => getEditablePageHead(page.value))
</script>

<template>
  <!-- JOURNEY: Readers need a quick, credible answer before they contact a clearing agent. The blog index organizes practical guides and makes the next step feel like asking an operator, not reading generic content. -->
  <section class="section"><div class="container"><div class="section-header centered"><span class="eyebrow"><Icon class="ui-icon" name="lucide:newspaper" aria-hidden="true" /> {{ page?.hero?.eyebrow || 'Logistics Blog' }}</span><h1 class="page-title">{{ page?.hero?.heading || page?.title }}</h1><p class="lead centered">{{ page?.hero?.lead || page?.description }}</p></div><div class="proof-grid"><NuxtLink v-for="post in posts" :key="post.path" class="proof-card" :to="`${post.path}.html`"><NuxtImg :src="post.image || page?.image || '/images/home-hero-og.jpg'" :alt="post.title" width="800" height="500" loading="lazy" /><div><h3>{{ post.title }}</h3><p>{{ post.description }}</p><p class="service-link">Read guide →</p></div></NuxtLink></div><NewsletterForm /></div></section>
</template>
