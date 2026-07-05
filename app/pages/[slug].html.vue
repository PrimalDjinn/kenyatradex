<script setup lang="ts">
const route = useRoute()
const slug = String(route.params.slug || '')

const { data: page } = await useAsyncData(`editable-page:${slug}`, async () => {
  const service = await queryCollection('services').where('slug', '=', slug).first()
  if (service) return service
  return queryCollection('pages').where('slug', '=', slug).first()
})

if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })

useSeoMeta(getEditablePageSeo(page.value))
useHead(() => getEditablePageHead(page.value))
</script>

<template>
  <EditableContentPage v-if="page" :page="page" icon="lucide:anchor" />
</template>
