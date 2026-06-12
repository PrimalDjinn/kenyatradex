<script setup lang="ts">
import { getServicePage } from '~/data/service-pages'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))
const page = computed(() => getServicePage(slug.value))

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}

useHead(() => ({
  title: page.value?.title,
  meta: [
    { name: 'description', content: page.value?.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Kenya Tradex' },
    { property: 'og:title', content: page.value?.title },
    { property: 'og:description', content: page.value?.description },
    { property: 'og:image', content: page.value?.heroImage }
  ],
  link: [{ rel: 'canonical', href: page.value?.canonical }],
  script: page.value?.faq?.length ? [{ type: 'application/ld+json', children: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: page.value.faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }) }] : []
}))
</script>

<template>
  <ServicePageView v-if="page" :page="page" />
</template>
