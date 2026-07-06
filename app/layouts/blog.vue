<template>
  <div class="min-h-screen bg-[linear-gradient(180deg,var(--color-background)_0%,var(--color-surface-raised)_100%)] text-[var(--color-text-primary)]">
    <a href="#main-content" class="absolute -top-24 left-1/2 z-[100] -translate-x-1/2 rounded-b-xl bg-[var(--color-brand-red)] px-6 py-3 font-bold text-white no-underline focus:top-0">Skip to main content</a>
    <SiteHeader />
    <UMain id="main-content">
      <slot />
    </UMain>
    <SiteFooter />
  </div>
</template>
