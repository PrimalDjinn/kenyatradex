<script setup lang="ts">
const route = useRoute()
const slug = String(route.params.slug || '')
const { data: page } = await useAsyncData(`download:${slug}`, () => queryCollection('downloads').where('slug', '=', slug).first())

if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Download Not Found' })

useSeoMeta(getEditablePageSeo(page.value))
useHead(() => getEditablePageHead(page.value))
</script>

<template>
  <EditableContentPage v-if="page" :page="page" icon="lucide:download" />
</template>
