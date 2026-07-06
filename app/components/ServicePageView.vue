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
  sections: Array<{ title: string, body?: string, items?: string[], steps?: string[] }>
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
    <section class="relative isolate overflow-hidden bg-[var(--color-brand-navy)] py-24 text-white lg:py-32">
      <NuxtImg class="absolute inset-0 z-[-2] h-full w-full object-cover" :src="page.heroImage" :alt="page.heading" width="1600" height="900" loading="eager" preload />
      <div class="absolute inset-0 z-[-1] bg-[linear-gradient(120deg,oklch(16%_0.062_258/.92),oklch(22%_0.075_258/.72),oklch(42%_0.17_27/.45))]" />
      <div class="mx-auto grid w-[min(1180px,calc(100%-48px))] items-center gap-8 lg:grid-cols-[1.25fr_.75fr]">
        <div>
          <span class="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-black text-white"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:anchor" aria-hidden="true" /> {{ page.eyebrow }}</span>
          <h1 class="mt-4 mb-4 max-w-[12.5ch] text-4xl font-black tracking-[-0.035em] text-white sm:text-5xl lg:text-7xl">{{ page.heading }}</h1>
          <p class="max-w-2xl text-lg text-white/90">{{ page.lead }}</p>
          <p v-if="page.updated" class="mt-4 max-w-2xl text-sm text-white/80"><strong>Updated {{ page.updated }}</strong><span v-if="page.reviewedBy"> | Reviewed by {{ page.reviewedBy }}</span></p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a class="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--color-brand-red)] px-5 py-3 font-black text-white no-underline shadow-lg transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-red-dark)]" href="#quote-form"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:send" aria-hidden="true" /> Request quote</a>
            <a class="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-3 font-black text-white no-underline transition hover:-translate-y-0.5 hover:bg-white/20" href="https://wa.me/254721596259?text=Hello%20Kenya%20Tradex%2C%20I%20need%20cargo%20support" target="_blank" rel="noopener"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:message-circle" aria-hidden="true" /> Chat on WhatsApp</a>
          </div>
        </div>
        <aside class="rounded-[1.75rem] border border-white/15 bg-white/12 p-6 text-white shadow-2xl backdrop-blur-xl">
          <h2 class="mb-4 text-3xl font-black text-white">Kenya Tradex support</h2>
          <ul class="m-0 list-none space-y-3 p-0">
            <li class="flex gap-3"><Icon class="mt-1 h-[1.1em] w-[1.1em] shrink-0 text-[var(--color-brand-red)]" name="lucide:circle-check" aria-hidden="true" /><span>Licensed freight, customs and logistics coordination.</span></li>
            <li class="flex gap-3"><Icon class="mt-1 h-[1.1em] w-[1.1em] shrink-0 text-[var(--color-brand-red)]" name="lucide:circle-check" aria-hidden="true" /><span>Mombasa, Nairobi and regional corridor focus.</span></li>
            <li class="flex gap-3"><Icon class="mt-1 h-[1.1em] w-[1.1em] shrink-0 text-[var(--color-brand-red)]" name="lucide:circle-check" aria-hidden="true" /><span>Direct quote path by form, phone or WhatsApp.</span></li>
          </ul>
        </aside>
      </div>
    </section>
    <div class="mx-auto grid w-[min(1180px,calc(100%-48px))] gap-8 py-16 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        <div v-if="page.related?.length" class="mb-6 rounded-2xl border border-[color:oklch(22%_0.075_258/.12)] bg-white p-4 text-sm">
          <strong class="inline-flex items-center gap-2"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:link" aria-hidden="true" /> Related services:</strong>
          <template v-for="(link, index) in page.related" :key="link.href">
            <span /> <NuxtLink class="font-bold text-[var(--color-brand-red)] no-underline hover:underline" :to="link.href">{{ link.label }}</NuxtLink><span v-if="index < page.related.length - 1"> | </span>
          </template>
        </div>
        <section v-for="section in page.sections" :key="section.title" class="mb-6 rounded-[1.5rem] border border-[color:oklch(22%_0.075_258/.12)] bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-3xl font-black tracking-[-0.025em] text-[var(--color-text-primary)] lg:text-5xl">{{ section.title }}</h2>
          <p v-if="section.body" class="text-[var(--color-text-muted)]">{{ section.body }}</p>
          <ul v-if="section.items" class="m-0 list-none space-y-3 p-0">
            <li v-for="item in section.items" :key="item" class="flex gap-3 text-[var(--color-text-muted)]"><Icon class="mt-1 h-[1.1em] w-[1.1em] shrink-0 text-[var(--color-brand-red)]" name="lucide:circle-check" aria-hidden="true" /><span>{{ item }}</span></li>
          </ul>
          <ul v-if="section.steps" class="m-0 list-none space-y-3 p-0">
            <li v-for="(step, index) in section.steps" :key="step" class="flex gap-3 text-[var(--color-text-muted)]"><Icon class="mt-1 h-[1.1em] w-[1.1em] shrink-0 text-[var(--color-brand-red)]" name="lucide:circle-dot" aria-hidden="true" /><span><strong>Step {{ index + 1 }}:</strong> {{ step }}</span></li>
          </ul>
        </section>
        <section v-if="page.faq?.length" class="mb-6 rounded-[1.5rem] border border-[color:oklch(22%_0.075_258/.12)] bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-3xl font-black tracking-[-0.025em] text-[var(--color-text-primary)] lg:text-5xl">Frequently asked questions</h2>
          <ul class="m-0 list-none space-y-3 p-0">
            <li v-for="item in page.faq" :key="item.question" class="flex gap-3 text-[var(--color-text-muted)]"><Icon class="mt-1 h-[1.1em] w-[1.1em] shrink-0 text-[var(--color-brand-red)]" name="lucide:circle-help" aria-hidden="true" /><span><strong>{{ item.question }}</strong><br>{{ item.answer }}</span></li>
          </ul>
        </section>
      </div>
      <aside id="quote-form" class="space-y-5 lg:sticky lg:top-28 lg:self-start">
        <div class="rounded-[1.75rem] border border-[color:oklch(22%_0.075_258/.12)] bg-white p-6 text-[var(--color-text-primary)] shadow-2xl">
          <QuoteForm v-bind="page.form" />
        </div>
        <div class="rounded-[1.75rem] border border-[color:oklch(22%_0.075_258/.12)] bg-white p-6 text-[var(--color-text-primary)] shadow-2xl">
          <h3 class="mb-3 text-xl font-extrabold">What to send first</h3>
          <ul class="m-0 list-none space-y-3 p-0">
            <li class="flex gap-3"><Icon class="mt-1 h-[1.1em] w-[1.1em] shrink-0 text-[var(--color-brand-red)]" name="lucide:file-text" aria-hidden="true" /><span>BL or AWB if cargo has shipped.</span></li>
            <li class="flex gap-3"><Icon class="mt-1 h-[1.1em] w-[1.1em] shrink-0 text-[var(--color-brand-red)]" name="lucide:file-check-2" aria-hidden="true" /><span>Invoice and packing list for document review.</span></li>
            <li class="flex gap-3"><Icon class="mt-1 h-[1.1em] w-[1.1em] shrink-0 text-[var(--color-brand-red)]" name="lucide:map" aria-hidden="true" /><span>Origin, destination and delivery deadline.</span></li>
          </ul>
        </div>
        <div class="rounded-[1.75rem] border border-[color:oklch(22%_0.075_258/.12)] bg-white p-6 text-[var(--color-text-primary)] shadow-2xl">
          <h3 class="mb-3 text-xl font-extrabold">Contact Kenya Tradex</h3>
          <p class="flex gap-2"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:phone" aria-hidden="true" /> <a href="tel:+254721596259">+254 721 596 259</a></p>
          <p class="flex gap-2"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:message-circle" aria-hidden="true" /> <a href="https://wa.me/254721596259" target="_blank" rel="noopener">+254 721 596 259 (WhatsApp)</a></p>
          <p class="flex gap-2"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:mail" aria-hidden="true" /> <a href="mailto:info@kenyatradex.africa">info@kenyatradex.africa</a></p>
          <p class="flex gap-2"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:map-pin" aria-hidden="true" /> Mombasa and Nairobi, Kenya</p>
        </div>
      </aside>
    </div>
  </div>
</template>
