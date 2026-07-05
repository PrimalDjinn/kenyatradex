<script setup lang="ts">
const { data: posts } = await useAsyncData('blog-posts', () => queryCollection('blog').order('date', 'DESC').all())
const { data: page } = await useAsyncData('page:blog', () => queryCollection('pages').where('slug', '=', 'blog').first())
const fallbackPage = { slug: 'blog', title: 'Kenya Tradex Logistics Blog', description: 'Guides on customs clearance, freight forwarding, import duty and regional cargo movement in Kenya.', canonical: 'https://kenyatradex.africa/blog.html' }
useSeoMeta(getEditablePageSeo(page.value || fallbackPage))
useHead(() => getEditablePageHead(page.value || fallbackPage))
</script>

<template>
  <!-- JOURNEY: Readers need a quick, credible answer before they contact a clearing agent. The blog index organizes practical guides and makes the next step feel like asking an operator, not reading generic content. -->
  <SiteShell>
    <section class="section">
      <div class="container">
        <div class="section-header centered">
          <span class="eyebrow blog-eyebrow"><Icon class="ui-icon" name="lucide:newspaper" aria-hidden="true" /> {{ page?.hero?.eyebrow || 'Logistics Blog' }}</span>
          <h1 class="page-title">{{ page?.hero?.heading || page?.title || 'Practical guides for Kenya importers and exporters.' }}</h1>
          <p class="lead centered">{{ page?.hero?.lead || page?.description || 'Customs, freight, duty and corridor guidance from the Kenya Tradex team.' }}</p>
        </div>
        <template v-for="block in page?.blocks || []" :key="block.title">
        <NewsletterForm v-if="block.type === 'newsletter'" :title="block.title" :body="block.body" />
        <section v-else class="content-block blog-index-block">
          <h2 v-if="block.title">{{ block.title }}</h2>
          <p v-if="block.body">{{ block.body }}</p>
          <p v-for="paragraph in block.paragraphs || []" :key="paragraph">{{ paragraph }}</p>
        </section>
        </template>
        <div class="proof-grid">
          <NuxtLink v-for="post in posts" :key="post.path" class="proof-card" :to="`${post.path}.html`">
            <NuxtImg :src="post.image || '/images/home-hero-og.jpg'" :alt="post.title" width="800" height="500" loading="lazy" />
            <div><h3>{{ post.title }}</h3><p>{{ post.description }}</p><p class="service-link">Read guide -></p></div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </SiteShell>
</template>
