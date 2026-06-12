<script setup lang="ts">
import { getServicePage } from '~/data/service-pages'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))
const page = computed(() => getServicePage(slug.value))

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}

useHead(() => {
  const current = page.value
  const scripts = current
    ? [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': `${current.canonical}#service`,
            name: current.heading,
            description: current.description,
            serviceType: current.eyebrow,
            url: current.canonical,
            provider: {
              '@type': 'Organization',
              '@id': 'https://kenyatradex.africa/#organization',
              name: 'Kenya Tradex',
              telephone: '+254721596259',
              email: 'info@kenyatradex.africa',
              identifier: [
                { '@type': 'PropertyValue', name: 'KRA PIN', value: 'P051396680R' },
                { '@type': 'PropertyValue', name: 'KIFWA Member Number', value: 'M2294' },
                { '@type': 'PropertyValue', name: 'Customs License', value: 'CAL/001526/24' },
                { '@type': 'PropertyValue', name: 'KPA Number', value: '101839' }
              ]
            },
            areaServed: ['Kenya', 'Uganda', 'Rwanda', 'Burundi', 'Democratic Republic of the Congo', 'South Sudan', 'Tanzania']
          })
        }
      ]
    : []

  if (current?.faq?.length) {
    scripts.push({
      type: 'application/ld+json',
      children: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: current.faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) })
    })
  }

  return {
    title: current?.title,
    meta: [
      { name: 'description', content: current?.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Kenya Tradex' },
      { property: 'og:title', content: current?.title },
      { property: 'og:description', content: current?.description },
      { property: 'og:image', content: current?.heroImage }
    ],
    link: [{ rel: 'canonical', href: current?.canonical }],
    script: scripts
  }
})
</script>

<template>
  <ServicePageView v-if="page" :page="page" />
</template>
