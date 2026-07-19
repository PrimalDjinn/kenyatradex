<script setup lang="ts">
import { joinURL, withFragment } from 'ufo'

definePageMeta({ layout: 'blog' })

const route = useRoute()
const path = computed(() => `/blog/${String(route.params.slug || '')}`)
const { data: post } = await useAsyncData(`blog:${path.value}`, () => queryCollection('blog').path(path.value).first())

if (!post.value) throw createError({ statusCode: 404, statusMessage: 'Blog post not found' })

const canonical = getAbsoluteSiteUrl(`${path.value}.html`)
const postImage = getAbsoluteSiteUrl(post.value.image)
const organizationId = withFragment(joinURL(getConfiguredSiteUrl(), '/'), '#organization')

useHead({
  title: `${post.value.title} | Kenya Tradex`,
  meta: [
    { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large' },
    { name: 'description', content: post.value.description },
    { name: 'geo.region', content: 'KE' },
    { name: 'geo.placename', content: 'Mombasa' },
    { property: 'og:type', content: 'article' },
    { property: 'og:site_name', content: 'Kenya Tradex' },
    { property: 'og:url', content: canonical },
    { property: 'og:locale', content: 'en_KE' },
    { property: 'og:title', content: post.value.title },
    { property: 'og:description', content: post.value.description },
    { property: 'og:image', content: postImage },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '675' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: post.value.title },
    { name: 'twitter:description', content: post.value.description },
    { name: 'twitter:image', content: postImage }
  ],
  link: [{ rel: 'canonical', href: canonical }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.value.title,
        description: post.value.description,
        image: postImage,
        datePublished: post.value.date,
        dateModified: post.value.updated || post.value.date,
        mainEntityOfPage: canonical,
        author: { '@type': 'Organization', '@id': organizationId, name: 'Kenya Tradex' },
        publisher: { '@type': 'Organization', '@id': organizationId, name: 'Kenya Tradex', logo: { '@type': 'ImageObject', url: getAbsoluteSiteUrl('/images/kenya-tradex-logo.png') } }
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(getBreadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'Blog', item: '/blog.html' },
        { name: post.value.title || 'Blog article', item: canonical || `${path.value}.html` }
      ]))
    }
  ]
})
</script>

<template>
  <!-- JOURNEY: Blog visitors arrive with a practical customs or freight question. The article should answer clearly, then give them a direct path to ask Kenya Tradex about their own file. -->
  <div>
    <section class="page-hero relative isolate overflow-hidden bg-[var(--color-brand-navy)] text-white">
      <NuxtImg class="absolute inset-0 z-[-2] h-full w-full object-cover" :src="post?.image || '/images/home-hero-og.jpg'" :alt="post?.heading || post?.title || 'Kenya Tradex logistics guide'" width="1600" height="900" />
      <div class="absolute inset-0 z-[-1] bg-[linear-gradient(120deg,oklch(16%_0.062_258/.92),oklch(22%_0.075_258/.72),oklch(42%_0.17_27/.45))]" />
      <div class="site-container"><div class="max-w-4xl"><span class="inline-flex items-center gap-2 border-l-2 border-[var(--color-brand-red)] pl-3 text-sm font-bold uppercase tracking-[.12em] text-white/75"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:newspaper" aria-hidden="true" /> {{ post?.category }}</span><p v-if="post?.author" class="mt-5 text-sm font-semibold text-white/70">{{ post.author }}</p><h1 class="mt-3 max-w-[18ch] text-[clamp(2.4rem,5.5vw,4rem)] font-[850] leading-[1.02] tracking-[-.04em] text-white">{{ post?.heading || post?.title }}</h1><p class="mt-6 max-w-2xl text-lg text-white/85">{{ post?.lead || post?.description }}</p><p v-if="post?.date" class="mt-5 text-sm font-semibold text-white/60">Published {{ post.date }}<span v-if="post.updated"> · Updated {{ post.updated }}</span></p></div></div>
    </section>
    <section class="py-12 lg:py-20"><article class="article-prose px-1"><ContentRenderer v-if="post" :value="post" /></article></section>
  </div>
</template>
