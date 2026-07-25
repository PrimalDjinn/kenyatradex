<script setup lang="ts">
import { joinURL, withFragment } from 'ufo'

type ContentLink = { label: string, href: string, external?: boolean }
type ContentBlock = { title?: string, body?: string, paragraphs?: string[], items?: string[], steps?: string[], links?: ContentLink[], image?: string, imageAlt?: string, note?: string }
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
  sections: Array<{ title: string, body?: string, paragraphs?: string[], items?: string[], steps?: string[], links?: ContentLink[], image?: string, imageAlt?: string, note?: string }>
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
    canonical: page.canonical || joinURL(getConfiguredSiteUrl(), `${page.slug}.html`),
    heroImage: page.hero?.image || page.image || '/images/customs-hero-1200.jpg',
    eyebrow: page.hero?.eyebrow || 'Kenya Tradex service',
    heading: page.hero?.heading || page.title,
    lead: page.hero?.lead || page.description || '',
    updated: page.hero?.updated,
    reviewedBy: page.hero?.reviewedBy,
    related: page.related,
    sections: (page.blocks || [])
      .filter((block) => block.title || block.body || block.paragraphs?.length || block.items?.length || block.steps?.length)
      .filter((block) => block.title?.toLowerCase() !== 'additional legacy details')
      .filter((block) => !(page.faq?.length && block.title?.toLowerCase().includes('questions')))
      .filter((block) => block.title?.replace(/\.$/, '') !== page.hero?.heading?.replace(/\.$/, ''))
      .map((block) => ({
        title: block.title || page.title,
        body: block.body,
        paragraphs: block.paragraphs,
        items: block.items,
        steps: block.steps,
        links: block.links,
        image: block.image,
        imageAlt: block.imageAlt,
        note: block.note
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

const page = toServicePage(contentPage.value as ContentPage)

const scripts = [
  {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${page.canonical}#service`,
      name: page.heading,
      description: page.description,
      serviceType: page.eyebrow,
      url: page.canonical,
      provider: {
        '@type': 'Organization',
        '@id': withFragment(joinURL(getConfiguredSiteUrl(), '/'), '#organization'),
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
  },
  {
    type: 'application/ld+json',
    innerHTML: JSON.stringify(getBreadcrumbSchema([
      { name: 'Home', item: '/' },
      { name: page.heading, item: page.canonical }
    ]))
  }
]

if (page.faq?.length) {
  scripts.push({
    type: 'application/ld+json',
    innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: page.faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) })
  })
}

useHead({
  title: page.title,
  meta: [
    { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large' },
    { name: 'description', content: page.description },
    { name: 'geo.region', content: 'KE' },
    { name: 'geo.placename', content: 'Mombasa' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Kenya Tradex' },
    { property: 'og:url', content: page.canonical },
    { property: 'og:locale', content: 'en_KE' },
    { property: 'og:title', content: page.title },
    { property: 'og:description', content: page.description },
    { property: 'og:image', content: getAbsoluteSiteUrl(page.heroImage) },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '675' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: page.title },
    { name: 'twitter:description', content: page.description },
    { name: 'twitter:image', content: getAbsoluteSiteUrl(page.heroImage) }
  ],
  link: [{ rel: 'canonical', href: page.canonical }],
  script: scripts
})
</script>

<template>
  <ServicePageView v-if="page" :data-content-id="contentPage?.id" :page="page" />
</template>
