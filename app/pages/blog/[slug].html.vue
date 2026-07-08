<script setup lang="ts">
definePageMeta({ layout: 'blog' })

const route = useRoute()
const path = computed(() => `/blog/${String(route.params.slug || '')}`)
const { data: post } = await useAsyncData(`blog:${path.value}`, () => queryCollection('blog').path(path.value).first())

if (!post.value) throw createError({ statusCode: 404, statusMessage: 'Blog post not found' })

const canonical = getAbsoluteSiteUrl(`${path.value}.html`)
const postImage = getAbsoluteSiteUrl(post.value.image)
const organizationId = `${getConfiguredSiteUrl()}/#organization`

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
    <section class="relative isolate overflow-hidden bg-[var(--color-brand-navy)] py-24 text-white lg:py-32">
      <NuxtImg class="absolute inset-0 z-[-2] h-full w-full object-cover" :src="post?.image || '/images/home-hero-og.jpg'" :alt="post?.title || 'Kenya Tradex logistics guide'" width="1600" height="900" />
      <div class="absolute inset-0 z-[-1] bg-[linear-gradient(120deg,oklch(16%_0.062_258/.92),oklch(22%_0.075_258/.72),oklch(42%_0.17_27/.45))]" />
      <div class="mx-auto grid w-[min(1180px,calc(100%-48px))] items-center gap-8 lg:grid-cols-[1.25fr_.75fr]"><div><span class="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-black text-white"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:newspaper" aria-hidden="true" /> Logistics Guide</span><h1 class="mt-4 mb-4 max-w-[12.5ch] text-4xl font-black tracking-[-0.035em] text-white sm:text-5xl lg:text-7xl">{{ post?.title }}</h1><p class="max-w-2xl text-lg text-white/90">{{ post?.description }}</p></div></div>
    </section>
    <section class="py-16 lg:py-28"><div class="mx-auto mb-6 w-[min(1180px,calc(100%-48px))] rounded-[1.5rem] border border-[color:oklch(22%_0.075_258/.12)] bg-white p-6 shadow-sm"><ContentRenderer v-if="post" :value="post" /><hr class="my-8 border-[color:oklch(22%_0.075_258/.12)]"><NuxtLink class="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--color-brand-red)] px-5 py-3 font-black text-white no-underline shadow-lg transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-red-dark)]" to="/#contact">Contact Kenya Tradex</NuxtLink></div></section>
  </div>
</template>
