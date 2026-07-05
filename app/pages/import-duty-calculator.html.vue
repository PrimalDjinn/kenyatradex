<script setup lang="ts">
const { data: page } = await useAsyncData('page:import-duty-calculator', () => queryCollection('pages').where('slug', '=', 'import-duty-calculator').first())
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
useSeoMeta(getEditablePageSeo(page.value))
useHead(() => getEditablePageHead(page.value))
</script>

<template>
  <EditableContentPage v-if="page" :page="page" icon="lucide:calculator" show-calculator />
</template>
