<script setup lang="ts">
type ServicePage = {
  slug: string
  title: string
  description: string
  canonical: string
  heroImage: string
  eyebrow: string
  heading: string
  lead: string
  updated?: string
  reviewedBy?: string
  related?: Array<{ label: string, href: string }>
  sections: Array<{ title: string, body?: string, paragraphs?: string[], items?: string[], steps?: string[], links?: Array<{ label: string, href: string, external?: boolean }>, image?: string, imageAlt?: string, note?: string }>
  faq?: Array<{ question: string, answer: string }>
  form: {
    id: string
    pageName: string
    title?: string
    intro?: string
    submitLabel?: string
    successMessage?: string
    fields: Array<{
      name: string
      label: string
      type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'hidden'
      placeholder?: string
      value?: string
      required?: boolean
      options?: string[]
    }>
  }
}

defineProps<{ page: ServicePage }>()
</script>

<template>
  <!-- JOURNEY: Service visitors need to know whether Kenya Tradex handles their exact cargo situation. Each page confirms the service, shows the documents/process involved, keeps related options visible, and holds the quote form beside the decision. -->
  <div>
    <section class="page-hero relative isolate overflow-hidden bg-[var(--color-brand-navy)] text-white">
      <NuxtImg class="absolute inset-0 z-[-2] h-full w-full object-cover" :src="page.heroImage" :alt="page.heading" width="1600" height="900" loading="eager" preload />
      <div class="absolute inset-0 z-[-1] bg-[linear-gradient(120deg,oklch(16%_0.062_258/.92),oklch(22%_0.075_258/.72),oklch(42%_0.17_27/.45))]" />
      <div class="site-container">
        <div class="max-w-4xl">
          <span class="inline-flex items-center gap-2 border-l-2 border-[var(--color-brand-red)] pl-3 text-sm font-bold uppercase tracking-[.12em] text-white/75"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:anchor" aria-hidden="true" /> {{ page.eyebrow }}</span>
          <h1 class="page-hero-title mt-5 text-white">{{ page.heading }}</h1>
          <p class="mt-6 max-w-2xl text-lg text-white/85">{{ page.lead }}</p>
          <p v-if="page.updated" class="mt-4 max-w-2xl text-sm text-white/80"><strong>Updated {{ page.updated }}</strong><span v-if="page.reviewedBy"> | Reviewed by {{ page.reviewedBy }}</span></p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand-red)] px-5 py-3 font-extrabold text-white no-underline transition hover:bg-[var(--color-brand-red-dark)]" href="#quote-form"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:send" aria-hidden="true" /> Request quote</a>
            <a class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/35 px-5 py-3 font-bold text-white no-underline transition hover:bg-white/10" href="https://wa.me/254786850801?text=Hello%20Kenya%20Tradex%2C%20I%20need%20cargo%20support" target="_blank" rel="noopener"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:message-circle" aria-hidden="true" /> Chat on WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
    <div class="site-container grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_330px] lg:py-20">
      <div class="order-2 min-w-0 lg:order-1">
        <div v-if="page.related?.length" class="mb-4 border-y border-[var(--color-border)] py-4 text-sm">
          <strong class="inline-flex items-center gap-2"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:link" aria-hidden="true" /> Related services:</strong>
          <template v-for="(link, index) in page.related" :key="link.href">
            <span /> <NuxtLink class="font-bold text-[var(--color-brand-red)] no-underline hover:underline" :to="link.href">{{ link.label }}</NuxtLink><span v-if="index < page.related.length - 1"> | </span>
          </template>
        </div>
        <section v-for="section in page.sections" :key="section.title" class="content-flow border-b border-[var(--color-border)] py-8 first:pt-4">
          <h2 class="section-title text-[var(--color-text-primary)]">{{ section.title }}</h2>
          <NuxtImg v-if="section.image" class="w-full rounded-xl" :src="section.image" :alt="section.imageAlt || section.title" width="1000" height="600" loading="lazy" />
          <p v-if="section.body" class="max-w-[72ch] text-[var(--color-text-muted)]">{{ section.body }}</p>
          <p v-for="paragraph in section.paragraphs || []" :key="paragraph" class="max-w-[72ch] text-[var(--color-text-muted)]">{{ paragraph }}</p>
          <ul v-if="section.items" class="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
            <li v-for="item in section.items" :key="item" class="flex gap-3 text-[var(--color-text-muted)]"><Icon class="mt-1 h-[1.1em] w-[1.1em] shrink-0 text-[var(--color-brand-red)]" name="lucide:circle-check" aria-hidden="true" /><span>{{ item }}</span></li>
          </ul>
          <ul v-if="section.steps" class="m-0 list-none space-y-3 p-0">
            <li v-for="(step, index) in section.steps" :key="step" class="flex gap-3 text-[var(--color-text-muted)]"><Icon class="mt-1 h-[1.1em] w-[1.1em] shrink-0 text-[var(--color-brand-red)]" name="lucide:circle-dot" aria-hidden="true" /><span><strong>Step {{ index + 1 }}:</strong> {{ step }}</span></li>
          </ul>
          <div v-if="section.links?.length" class="flex flex-wrap gap-3">
            <a v-for="link in section.links" :key="link.href" class="font-bold text-[var(--color-brand-red-dark)] underline decoration-transparent underline-offset-4 transition hover:decoration-current" :href="link.href" :target="link.external ? '_blank' : undefined" :rel="link.external ? 'noopener' : undefined">{{ link.label }}</a>
          </div>
          <p v-if="section.note" class="border-l-4 border-[var(--color-brand-red)] bg-[var(--color-surface-raised)] p-4 text-sm text-[var(--color-text-primary)]">{{ section.note }}</p>
        </section>
        <section v-if="page.faq?.length" class="mt-10 bg-[var(--color-harbor)] p-5 sm:p-8">
          <h2 class="section-title mb-6 text-[var(--color-text-primary)]">Frequently asked questions</h2>
          <div class="divide-y divide-[var(--color-border)]">
            <details v-for="item in page.faq" :key="item.question" class="group py-4"><summary class="cursor-pointer list-none pr-8 font-extrabold text-[var(--color-text-primary)]">{{ item.question }}</summary><p class="mt-3 max-w-[70ch] text-[var(--color-text-muted)]">{{ item.answer }}</p></details>
          </div>
        </section>
      </div>
      <aside id="quote-form" class="order-1 space-y-5 lg:order-2 lg:sticky lg:top-24 lg:self-start">
        <div class="rounded-2xl border border-[var(--color-border)] bg-white p-4 text-[var(--color-text-primary)] shadow-lg sm:p-6">
          <QuoteForm v-bind="page.form" :title="undefined" :intro="undefined" />
        </div>
        <div class="hidden border-t border-[var(--color-border)] pt-5 text-[var(--color-text-primary)] lg:block">
          <h3 class="mb-3 text-xl font-extrabold">Contact Kenya Tradex</h3>
          <p class="flex gap-2"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:phone" aria-hidden="true" /> <a href="tel:+254721596259">+254 721 596 259</a></p>
          <p class="flex gap-2"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:message-circle" aria-hidden="true" /> <a href="https://wa.me/254786850801" target="_blank" rel="noopener">+254 786 850 801 (WhatsApp)</a></p>
          <p class="flex gap-2"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:mail" aria-hidden="true" /> <a href="mailto:info@kenyatradex.africa">info@kenyatradex.africa</a></p>
          <p class="flex gap-2"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:map-pin" aria-hidden="true" /> BP Plaza, 3rd Floor, Umoja Rd, Mombasa</p>
        </div>
      </aside>
    </div>
  </div>
</template>
