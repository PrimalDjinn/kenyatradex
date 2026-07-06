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
  <header class="sticky top-0 z-50 border-b border-white/10 bg-[var(--color-brand-navy)]/95 text-white backdrop-blur-xl">
    <div class="mx-auto flex min-h-20 w-[min(1180px,calc(100%-48px))] items-center justify-between gap-4">
      <NuxtLink class="inline-flex items-center gap-3 no-underline" to="/">
        <span class="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-white p-1 shadow-lg"><NuxtImg :src="brand.logo" :alt="`${brand.name} Logo`" width="50" height="50" /></span>
        <span class="flex flex-col text-lg font-black leading-tight">{{ brand.name }}<small class="text-xs font-semibold text-white/70">{{ brand.headerTagline }}</small></span>
      </NuxtLink>
      <button class="inline-grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white lg:hidden" type="button" aria-label="Menu" :aria-expanded="open" @click="open = !open">
        <Icon class="h-[1.1em] w-[1.1em] shrink-0" :name="open ? 'lucide:x' : 'lucide:menu'" aria-hidden="true" />
      </button>
      <ul class="fixed inset-x-4 top-24 list-none flex-col gap-2 rounded-3xl bg-[var(--color-brand-navy)] p-4 shadow-2xl lg:static lg:flex lg:flex-row lg:items-center lg:bg-transparent lg:p-0 lg:shadow-none" :class="open ? 'flex' : 'hidden lg:flex'">
        <li v-for="link in navLinks" :key="link.href">
          <a v-if="link.external" class="block rounded-full px-4 py-3 text-sm font-bold text-white/85 no-underline transition hover:bg-white/10 hover:text-white" :href="link.href" target="_blank" rel="noopener" @click="open = false">{{ link.label }}</a>
          <NuxtLink v-else class="block rounded-full px-4 py-3 text-sm font-bold text-white/85 no-underline transition hover:bg-white/10 hover:text-white" :to="link.href" @click="open = false">{{ link.label }}</NuxtLink>
        </li>
        <li class="lg:ml-2"><a class="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--color-brand-red)] px-5 py-3 font-black text-white no-underline shadow-lg shadow-red-950/10 transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-red-dark)]" :href="`${contact.whatsapp}?text=Hello%20Kenya%20Tradex%2C%20I%20need%20a%20freight%20quote`" target="_blank" rel="noopener"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:message-circle" aria-hidden="true" /> Quote file</a></li>
      </ul>
    </div>
  </header>
</template>
