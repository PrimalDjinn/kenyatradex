<template>
  <div class="min-h-screen bg-[linear-gradient(180deg,var(--color-background)_0%,var(--color-surface-raised)_100%)] text-[var(--color-text-primary)]">
    <a href="#main-content" class="absolute -top-24 left-1/2 z-[100] -translate-x-1/2 rounded-b-xl bg-[var(--color-brand-red)] px-6 py-3 font-bold text-white no-underline focus:top-0">Skip to main content</a>
    <SiteHeader />
    <UMain id="main-content">
      <slot />
    </UMain>
    <SiteFooter />
    <a href="https://wa.me/254721596259?text=Hello%20Kenya%20Tradex%2C%20I%20need%20a%20freight%20quote" class="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 font-black text-white no-underline shadow-2xl hover:bg-green-700" target="_blank" rel="noopener"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:message-circle" aria-hidden="true" /><span class="hidden sm:inline">WhatsApp</span></a>
  </div>
</template>
