<script setup lang="ts">
const { data: posts } = await useAsyncData('blog-posts', () => queryCollection('blog').order('date', 'DESC').all())
useHead({ title: 'Kenya Tradex Logistics Blog', meta: [{ name: 'description', content: 'Guides on customs clearance, freight forwarding, import duty and regional cargo movement in Kenya.' }], link: [{ rel: 'canonical', href: 'https://kenyatradex.africa/blog.html' }] })
</script>

<template>
  <!-- JOURNEY: Readers need a quick, credible answer before they contact a clearing agent. The blog index organizes practical guides and makes the next step feel like asking an operator, not reading generic content. -->
  <SiteShell><section class="section"><div class="container"><div class="section-header centered"><span class="eyebrow"><Icon class="ui-icon" name="lucide:newspaper" aria-hidden="true" /> Logistics Blog</span><h1 class="page-title">Practical guides for Kenya importers and exporters.</h1><p class="lead centered">Customs, freight, duty and corridor guidance from the Kenya Tradex team.</p></div><div class="proof-grid"><NuxtLink v-for="post in posts" :key="post.path" class="proof-card" :to="`${post.path}.html`"><NuxtImg :src="post.image || '/images/home-hero-og.jpg'" :alt="post.title" width="800" height="500" loading="lazy" /><div><h3>{{ post.title }}</h3><p>{{ post.description }}</p><p class="service-link">Read guide →</p></div></NuxtLink></div></div></section></SiteShell>
</template>
