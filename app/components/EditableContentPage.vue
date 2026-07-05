<script setup lang="ts">
import type { EditablePage } from '~/types/content-page'

const props = defineProps<{
  page: EditablePage
  icon?: string
  showCalculator?: boolean
}>()

const heroImage = computed(() => props.page.hero?.image || props.page.image || '/images/home-hero-og.jpg')
const heroHeading = computed(() => props.page.hero?.heading || props.page.title)
const heroLead = computed(() => props.page.hero?.lead || props.page.description || '')
const whatsAppText = computed(() => encodeURIComponent(`Hello Kenya Tradex, I need help with ${props.page.title}`))
</script>

<template>
  <SiteShell>
    <section class="hero compact-hero">
      <NuxtImg class="hero-media" :src="heroImage" :alt="page.hero?.imageAlt || heroHeading" width="1600" height="900" loading="eager" preload />
      <div class="container hero-grid">
        <div>
          <span class="eyebrow"><Icon class="ui-icon" :name="icon || 'lucide:file-text'" aria-hidden="true" /> {{ page.hero?.eyebrow || 'Kenya Tradex' }}</span>
          <h1>{{ heroHeading }}</h1>
          <p v-if="heroLead" class="lead on-dark">{{ heroLead }}</p>
          <p v-if="page.hero?.updated || page.hero?.reviewedBy" class="hero-note">
            <strong v-if="page.hero?.updated">Updated {{ page.hero.updated }}</strong><span v-if="page.hero?.reviewedBy"> | Reviewed by {{ page.hero.reviewedBy }}</span>
          </p>
          <div class="hero-actions">
            <a class="btn" href="#quote-form"><Icon class="ui-icon" name="lucide:send" aria-hidden="true" /> Request support</a>
            <a class="btn-secondary" :href="`https://wa.me/254721596259?text=${whatsAppText}`" target="_blank" rel="noopener"><Icon class="ui-icon" name="lucide:message-circle" aria-hidden="true" /> WhatsApp</a>
          </div>
        </div>
        <aside class="hero-card">
          <h2>Kenya Tradex support</h2>
          <ul>
            <li><Icon class="ui-icon" name="lucide:circle-check" aria-hidden="true" /><span>Founder-led customs and logistics expertise.</span></li>
            <li><Icon class="ui-icon" name="lucide:circle-check" aria-hidden="true" /><span>200+ cargo files handled monthly.</span></li>
            <li><Icon class="ui-icon" name="lucide:circle-check" aria-hidden="true" /><span>Zero cargo-loss record to date.</span></li>
          </ul>
        </aside>
      </div>
    </section>

    <div class="container content-layout">
      <main>
        <div v-if="page.related?.length" class="related-links">
          <strong><Icon class="ui-icon" name="lucide:link" aria-hidden="true" /> Related:</strong>
          <template v-for="(link, index) in page.related" :key="link.href">
            <span /> <NuxtLink :to="link.href">{{ link.label }}</NuxtLink><span v-if="index < page.related.length - 1"> | </span>
          </template>
        </div>

        <ImportDutyCalculator v-if="showCalculator" />

        <NewsletterForm v-for="block in (page.blocks || []).filter((item) => item.type === 'newsletter')" :key="`${block.title}-${block.body}`" :title="block.title" :body="block.body" />
        <section v-for="block in (page.blocks || []).filter((item) => item.type !== 'newsletter')" :key="`${block.type || 'block'}-${block.title || block.body || block.note}`" class="content-block" :class="block.type ? `content-block-${block.type}` : undefined">
          <p v-if="block.eyebrow" class="section-label">{{ block.eyebrow }}</p>
          <h2 v-if="block.title">{{ block.title }}</h2>
          <NuxtImg v-if="block.image" class="block-image" :src="block.image" :alt="block.imageAlt || block.title || page.title" width="1100" height="620" loading="lazy" />
          <p v-if="block.body">{{ block.body }}</p>
          <p v-for="paragraph in block.paragraphs || []" :key="paragraph">{{ paragraph }}</p>
          <ul v-if="block.items?.length" class="check-list">
            <li v-for="item in block.items" :key="item"><Icon class="ui-icon" name="lucide:circle-check" aria-hidden="true" /><span>{{ item }}</span></li>
          </ul>
          <ul v-if="block.steps?.length" class="process-list">
            <li v-for="(step, index) in block.steps" :key="step"><Icon class="ui-icon" name="lucide:circle-dot" aria-hidden="true" /><span><strong>Step {{ index + 1 }}:</strong> {{ step }}</span></li>
          </ul>
          <div v-if="block.links?.length" class="block-links">
            <NuxtLink v-for="link in block.links" :key="link.href" class="btn-inline" :to="link.href">{{ link.label }}</NuxtLink>
          </div>
          <p v-if="block.note" class="content-note">{{ block.note }}</p>
        </section>

        <section v-if="page.faq?.length" class="content-block">
          <h2>Frequently asked questions</h2>
          <ul class="faq-list">
            <li v-for="item in page.faq" :key="item.question"><Icon class="ui-icon" name="lucide:circle-help" aria-hidden="true" /><span><strong>{{ item.question }}</strong><br>{{ item.answer }}</span></li>
          </ul>
        </section>
      </main>

      <aside id="quote-form" class="sidebar">
        <div v-if="page.form" class="quote-card">
          <QuoteForm v-bind="page.form" />
        </div>
        <div v-if="page.pdf" class="contact-card document-card">
          <h3>Download PDF</h3>
          <p>Use the printable guide alongside the editable page content.</p>
          <NuxtLink class="btn" :to="page.pdf">Open PDF</NuxtLink>
        </div>
        <div class="contact-card">
          <h3>Contact Kenya Tradex</h3>
          <p><Icon class="ui-icon" name="lucide:phone" aria-hidden="true" /> <a href="tel:+254721596259">+254 721 596 259</a></p>
          <p><Icon class="ui-icon" name="lucide:message-circle" aria-hidden="true" /> <a href="https://wa.me/254721596259" target="_blank" rel="noopener">+254 721 596 259 (WhatsApp)</a></p>
          <p><Icon class="ui-icon" name="lucide:mail" aria-hidden="true" /> <a href="mailto:info@kenyatradex.africa">info@kenyatradex.africa</a></p>
          <p><Icon class="ui-icon" name="lucide:map-pin" aria-hidden="true" /> Mombasa and Nairobi, Kenya</p>
        </div>
      </aside>
    </div>
  </SiteShell>
</template>
