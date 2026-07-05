<template>
  <div class="min-h-screen bg-[linear-gradient(180deg,var(--color-background)_0%,var(--color-surface-raised)_100%)] text-[var(--color-text-primary)]">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <SiteHeader />
    <UMain id="main-content" class="blog-layout">
      <slot />
    </UMain>
    <SiteFooter />
  </div>
</template>
