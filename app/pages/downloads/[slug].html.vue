<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = String(route.params.slug || '')
const { data: page } = await useAsyncData(`download:${slug}`, () => queryCollection('downloads').where('slug', '=', slug).first())

if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Download Not Found' })

const introBlock = computed(() => page.value?.blocks?.[0])
const checklistBlock = computed(() => page.value?.blocks?.find((block) => block.items?.length))

useSeoMeta(getEditablePageSeo(page.value))
useHead(() => getEditablePageHead(page.value))
</script>

<template>
  <!-- JOURNEY: Download visitors need to understand the resource quickly, collect the file, and know when to ask Kenya Tradex for a document review. -->
  <div>
    <section class="hero">
      <NuxtImg class="hero-media" :src="page?.hero?.image || page?.image || '/images/home-hero-og.jpg'" :alt="page?.hero?.imageAlt || page?.hero?.heading || page?.title" width="1600" height="900" />
      <div class="container hero-grid">
        <div>
          <span class="eyebrow"><Icon class="ui-icon" name="lucide:download" aria-hidden="true" /> Kenya Tradex download</span>
          <h1>{{ page?.hero?.heading || page?.title }}</h1>
          <p class="lead on-dark">{{ page?.hero?.lead || page?.description }}</p>
          <div class="hero-actions">
            <a v-if="page?.pdf" class="btn" :href="page.pdf" target="_blank" rel="noopener"><Icon class="ui-icon" name="lucide:file-down" aria-hidden="true" /> Download resource</a>
            <a class="btn-secondary" href="#quote-form"><Icon class="ui-icon" name="lucide:send" aria-hidden="true" /> Request help</a>
          </div>
        </div>
        <aside class="hero-card">
          <h2>{{ introBlock?.title || 'Before you move cargo' }}</h2>
          <p>{{ introBlock?.body || page?.description }}</p>
        </aside>
      </div>
    </section>

    <div class="container content-layout">
      <div>
        <section v-if="checklistBlock" class="content-block">
          <h2>{{ checklistBlock.title }}</h2>
          <p v-if="checklistBlock.body">{{ checklistBlock.body }}</p>
          <ul class="check-list">
            <li v-for="item in checklistBlock.items" :key="item"><Icon class="ui-icon" name="lucide:circle-check" aria-hidden="true" /><span>{{ item }}</span></li>
          </ul>
        </section>
        <section v-for="block in page?.blocks?.filter((item) => item !== checklistBlock) || []" :key="block.title || block.body" class="content-block">
          <h2 v-if="block.title">{{ block.title }}</h2>
          <p v-if="block.body">{{ block.body }}</p>
          <p v-for="paragraph in block.paragraphs || []" :key="paragraph">{{ paragraph }}</p>
        </section>
      </div>
      <aside id="quote-form" class="sidebar">
        <div v-if="page?.pdf" class="contact-card document-card">
          <h3>Download file</h3>
          <a class="btn" :href="page.pdf" target="_blank" rel="noopener"><Icon class="ui-icon" name="lucide:file-down" aria-hidden="true" /> Open PDF</a>
        </div>
        <div class="quote-card">
          <QuoteForm v-if="page?.form" v-bind="page.form" />
        </div>
      </aside>
    </div>
  </div>
</template>
