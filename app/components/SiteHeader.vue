<script setup lang="ts">
const open = ref(false)
const route = useRoute()
const { data: site } = await useAsyncData('site:settings:header', () => queryCollection('site').where('slug', '=', 'settings').first())
const navLinks = computed(() => site.value?.navLinks || [])
const brand = computed(() => site.value?.brand || { name: 'Kenya Tradex', headerTagline: 'Mombasa freight operations desk', logo: '/images/kenya-tradex-logo-header.png' })
const contact = computed(() => site.value?.contact || { whatsapp: 'https://wa.me/254721596259' })

watch(open, (value) => {
  if (import.meta.client) document.body.classList.toggle('menu-open', value)
})

watch(() => route.fullPath, () => {
  open.value = false
})

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => window.addEventListener('keydown', closeOnEscape))

onBeforeUnmount(() => {
  if (import.meta.client) window.removeEventListener('keydown', closeOnEscape)
  if (import.meta.client) document.body.classList.remove('menu-open')
})
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-white/10 bg-[var(--color-brand-navy)]/95 text-white backdrop-blur-xl">
    <div class="site-container flex min-h-18 items-center justify-between gap-4">
      <NuxtLink class="inline-flex items-center gap-3 no-underline" to="/">
        <span class="grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-white p-1"><NuxtImg :src="brand.logo" :alt="`${brand.name} Logo`" width="50" height="50" /></span>
        <span class="flex flex-col text-lg font-extrabold leading-tight">{{ brand.name }}<small class="hidden text-xs font-medium text-white/65 sm:block">{{ brand.headerTagline }}</small></span>
      </NuxtLink>
      <button class="inline-grid h-11 w-11 place-items-center rounded-xl border border-white/20 bg-white/10 text-white xl:hidden" type="button" aria-label="Menu" :aria-expanded="open" aria-controls="site-navigation" @click="open = !open">
        <Icon class="h-[1.1em] w-[1.1em] shrink-0" :name="open ? 'lucide:x' : 'lucide:menu'" aria-hidden="true" />
      </button>
      <button v-if="open" class="fixed inset-0 top-18 -z-10 bg-black/45 xl:hidden" type="button" aria-label="Close menu" @click="open = false" />
      <ul id="site-navigation" class="fixed inset-x-4 top-21 max-h-[calc(100dvh-6rem)] list-none flex-col gap-1 overflow-y-auto rounded-2xl border border-white/10 bg-[var(--color-brand-navy)] p-4 shadow-2xl xl:static xl:flex xl:max-h-none xl:flex-row xl:items-center xl:overflow-visible xl:border-0 xl:bg-transparent xl:p-0 xl:shadow-none" :class="open ? 'flex' : 'hidden xl:flex'">
        <li v-for="link in navLinks" :key="link.href">
          <a v-if="link.external" class="block rounded-full px-4 py-3 text-sm font-bold text-white/85 no-underline transition hover:bg-white/10 hover:text-white" :href="link.href" target="_blank" rel="noopener" @click="open = false">{{ link.label }}</a>
          <NuxtLink v-else class="block rounded-full px-4 py-3 text-sm font-bold text-white/85 no-underline transition hover:bg-white/10 hover:text-white" :to="link.href" @click="open = false">{{ link.label }}</NuxtLink>
        </li>
        <li class="xl:ml-2"><a class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand-red)] px-5 py-3 font-extrabold text-white no-underline transition hover:bg-[var(--color-brand-red-dark)]" :href="`${contact.whatsapp}?text=Hello%20Kenya%20Tradex%2C%20I%20need%20a%20freight%20quote`" target="_blank" rel="noopener"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:message-circle" aria-hidden="true" /> Quote file</a></li>
      </ul>
    </div>
  </header>
</template>
