<script setup lang="ts">
const route = useRoute()
const path = computed(() => `/blog/${String(route.params.slug || '')}`)
const { data: post } = await useAsyncData(`blog:${path.value}`, () => queryCollection('blog').path(path.value).first())

if (!post.value) throw createError({ statusCode: 404, statusMessage: 'Blog post not found' })

useHead(() => ({
  title: `${post.value?.title} | Kenya Tradex`,
  meta: [
    { name: 'description', content: post.value?.description },
    { property: 'og:title', content: post.value?.title },
    { property: 'og:description', content: post.value?.description },
    { property: 'og:image', content: post.value?.image }
  ],
  link: [{ rel: 'canonical', href: `https://kenyatradex.africa${path.value}.html` }]
}))
</script>

<template>
  <!-- JOURNEY: Blog visitors arrive with a practical customs or freight question. The article should answer clearly, then give them a direct path to ask Kenya Tradex about their own file. -->
  <SiteShell>
    <section class="hero">
      <NuxtImg class="hero-media" :src="post?.image || '/images/home-hero-og.jpg'" :alt="post?.title || 'Kenya Tradex logistics guide'" width="1600" height="900" />
      <div class="container hero-grid"><div><span class="eyebrow"><Icon class="ui-icon" name="lucide:newspaper" aria-hidden="true" /> Logistics Guide</span><h1>{{ post?.title }}</h1><p class="lead on-dark">{{ post?.description }}</p></div></div>
    </section>
    <section class="section"><div class="container content-block"><ContentRenderer v-if="post" :value="post" /><hr class="content-separator"><NuxtLink class="btn" to="/#contact">Contact Kenya Tradex</NuxtLink></div></section>
  </SiteShell>
</template>
