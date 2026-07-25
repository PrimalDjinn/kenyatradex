<script setup lang="ts">
useHead({
  script: getOrganizationSchemas().map((schema) => ({
    type: 'application/ld+json',
    innerHTML: JSON.stringify(schema)
  }))
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="repeating-linear-gradient(to right,#0b1a33 0%,#c62828 48%,#971d1d 72%,#0b1a33 100%)" :height="4" :duration="2600" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
