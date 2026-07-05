<template>
  <div class="min-h-screen bg-[linear-gradient(180deg,var(--color-background)_0%,var(--color-surface-raised)_100%)] text-[var(--color-text-primary)]">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <SiteHeader />
    <UMain id="main-content">
      <slot />
    </UMain>
    <SiteFooter />
    <a href="https://wa.me/254721596259?text=Hello%20Kenya%20Tradex%2C%20I%20need%20a%20freight%20quote" class="whatsapp-float" target="_blank" rel="noopener"><Icon class="ui-icon" name="lucide:message-circle" aria-hidden="true" /><span>WhatsApp</span></a>
  </div>
</template>
