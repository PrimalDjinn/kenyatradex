<script setup lang="ts">
const { data: page } = await useAsyncData('page:about', () => queryCollection('pages').where('slug', '=', 'about').first())
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
useSeoMeta(getEditablePageSeo(page.value))
useHead(() => getEditablePageHead(page.value))
</script>

<template>
  <EditableContentPage v-if="page" :page="page" icon="lucide:building-2" />
</template>
