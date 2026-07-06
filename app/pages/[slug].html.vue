<script setup lang="ts">
type ContentBlock = { title?: string, body?: string, items?: string[], steps?: string[] }
type ContentForm = {
  id: string
  pageName: string
  title?: string
  intro?: string
  submitLabel?: string
  successMessage?: string
  fields: Array<{
    name: string
    label: string
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'hidden'
    placeholder?: string
    value?: string
    required?: boolean
    options?: string[]
  }>
}
type ContentPage = {
  slug: string
  title: string
  description?: string
  canonical?: string
  image?: string
  hero?: { eyebrow?: string, heading?: string, lead?: string, image?: string, updated?: string, reviewedBy?: string }
  related?: Array<{ label: string, href: string }>
  blocks?: ContentBlock[]
  faq?: Array<{ question: string, answer: string }>
  form?: ContentForm
}
type ServicePage = {
  slug: string
  title: string
  description: string
  canonical: string
  heroImage: string
  eyebrow: string
  heading: string
  lead: string
  updated?: string
  reviewedBy?: string
  related?: Array<{ label: string, href: string }>
  sections: Array<{ title: string, body?: string, items?: string[], steps?: string[] }>
  faq?: Array<{ question: string, answer: string }>
  form: ContentForm
}

const route = useRoute()
const slug = String(route.params.slug || '')
const { data: contentPage } = await useAsyncData(`service:${slug}`, () => queryCollection('services').where('slug', '=', slug).first())

if (!contentPage.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}

function toServicePage(page: ContentPage): ServicePage {
  return {
    slug: page.slug,
    title: page.title,
    description: page.description || '',
    canonical: page.canonical || `https://kenyatradex.africa/${page.slug}.html`,
    heroImage: page.hero?.image || page.image || '/images/customs-hero-1200.jpg',
    eyebrow: page.hero?.eyebrow || 'Kenya Tradex service',
    heading: page.hero?.heading || page.title,
    lead: page.hero?.lead || page.description || '',
    updated: page.hero?.updated,
    reviewedBy: page.hero?.reviewedBy,
    related: page.related,
    sections: (page.blocks || []).filter((block) => block.title || block.body || block.items?.length).map((block) => ({
      title: block.title || page.title,
      body: block.body,
      items: block.items,
      steps: block.steps
    })),
    faq: page.faq,
    form: page.form || {
      id: `${page.slug}-form`,
      pageName: `${page.title} Inquiry`,
      title: 'Request Kenya Tradex support',
      intro: 'Share the cargo file basics and Kenya Tradex will respond with the next practical step.',
      submitLabel: 'Send quote request',
      successMessage: 'Request received. Kenya Tradex will respond shortly.',
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Full Name *', required: true },
        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Email Address *', required: true },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '(254) ___ ___ ___' },
        { name: 'message', label: 'Cargo details', type: 'textarea', placeholder: 'Cargo details: type, volume, origin, destination, timing and any document or border requirements. *', required: true }
      ]
    }
  }
}

const page = computed(() => contentPage.value ? toServicePage(contentPage.value) : null)

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
