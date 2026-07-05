<script setup lang="ts">
const open = ref(false)
const { data: site } = await useAsyncData('site:settings:header', () => queryCollection('site').where('slug', '=', 'settings').first())
const navLinks = computed(() => site.value?.navLinks || [])
const brand = computed(() => site.value?.brand || { name: 'Kenya Tradex', headerTagline: 'Mombasa freight operations desk', logo: '/images/kenya-tradex-logo-header.png' })
const contact = computed(() => site.value?.contact || { whatsapp: 'https://wa.me/254721596259' })

watch(open, (value) => {
  if (import.meta.client) document.body.classList.toggle('menu-open', value)
})

onBeforeUnmount(() => {
  if (import.meta.client) document.body.classList.remove('menu-open')
})
</script>

<template>
  <header class="site-header">
    <div class="container nav-shell">
      <NuxtLink class="logo" to="/">
        <span class="logo-mark"><NuxtImg :src="brand.logo" :alt="`${brand.name} Logo`" width="50" height="50" /></span>
        <span class="logo-copy">{{ brand.name }}<small>{{ brand.headerTagline }}</small></span>
      </NuxtLink>
      <button class="menu-toggle" type="button" aria-label="Menu" :aria-expanded="open" @click="open = !open">
        <Icon class="ui-icon" :name="open ? 'lucide:x' : 'lucide:menu'" aria-hidden="true" />
      </button>
      <ul class="nav-links" :class="{ show: open }">
        <li v-for="link in navLinks" :key="link.href">
          <a v-if="link.external" :href="link.href" target="_blank" rel="noopener" @click="open = false">{{ link.label }}</a>
          <NuxtLink v-else :to="link.href" @click="open = false">{{ link.label }}</NuxtLink>
        </li>
        <li class="nav-action"><a class="nav-cta" :href="`${contact.whatsapp}?text=Hello%20Kenya%20Tradex%2C%20I%20need%20a%20freight%20quote`" target="_blank" rel="noopener"><Icon class="ui-icon" name="lucide:message-circle" aria-hidden="true" /> Quote file</a></li>
      </ul>
    </div>
  </header>
</template>
