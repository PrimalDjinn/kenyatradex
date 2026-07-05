<script setup lang="ts">
const { data: page } = await useAsyncData('page:home', () => queryCollection('pages').where('slug', '=', 'home').first())
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
useSeoMeta(getEditablePageSeo(page.value))
useHead(() => getEditablePageHead(page.value))
</script>

<template>
  <EditableContentPage v-if="page" :page="page" icon="lucide:anchor" />
</template>
