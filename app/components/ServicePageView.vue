<script setup lang="ts">
import type { ServicePage } from '~/types/site'

defineProps<{ page: ServicePage }>()
</script>

<template>
  <!-- JOURNEY: Service visitors need to know whether Kenya Tradex handles their exact cargo situation. Each page confirms the service, shows the documents/process involved, keeps related options visible, and holds the quote form beside the decision. -->
  <SiteShell>
    <section class="hero">
      <NuxtImg class="hero-media" :src="page.heroImage" :alt="page.heading" width="1600" height="900" loading="eager" preload />
      <div class="container hero-grid">
        <div>
          <span class="eyebrow"><Icon class="ui-icon" name="lucide:anchor" aria-hidden="true" /> {{ page.eyebrow }}</span>
          <h1>{{ page.heading }}</h1>
          <p class="lead on-dark">{{ page.lead }}</p>
          <p v-if="page.updated" class="hero-note"><strong>Updated {{ page.updated }}</strong><span v-if="page.reviewedBy"> | Reviewed by {{ page.reviewedBy }}</span></p>
          <div class="hero-actions">
            <a class="btn" href="#quote-form"><Icon class="ui-icon" name="lucide:send" aria-hidden="true" /> Request quote</a>
            <a class="btn-secondary" href="https://wa.me/254721596259?text=Hello%20Kenya%20Tradex%2C%20I%20need%20cargo%20support" target="_blank" rel="noopener"><Icon class="ui-icon" name="lucide:message-circle" aria-hidden="true" /> Chat on WhatsApp</a>
          </div>
        </div>
        <aside class="hero-card">
          <h2>Kenya Tradex support</h2>
          <ul>
            <li><Icon class="ui-icon" name="lucide:circle-check" aria-hidden="true" /><span>Licensed freight, customs and logistics coordination.</span></li>
            <li><Icon class="ui-icon" name="lucide:circle-check" aria-hidden="true" /><span>Mombasa, Nairobi and regional corridor focus.</span></li>
            <li><Icon class="ui-icon" name="lucide:circle-check" aria-hidden="true" /><span>Direct quote path by form, phone or WhatsApp.</span></li>
          </ul>
        </aside>
      </div>
    </section>
    <div class="container content-layout">
      <div>
        <div v-if="page.related?.length" class="related-links">
          <strong><Icon class="ui-icon" name="lucide:link" aria-hidden="true" /> Related services:</strong>
          <template v-for="(link, index) in page.related" :key="link.href">
            <span /> <NuxtLink :to="link.href">{{ link.label }}</NuxtLink><span v-if="index < page.related.length - 1"> | </span>
          </template>
        </div>
        <section v-for="section in page.sections" :key="section.title" class="content-block">
          <h2>{{ section.title }}</h2>
          <p v-if="section.body">{{ section.body }}</p>
          <ul v-if="section.items" class="check-list">
            <li v-for="item in section.items" :key="item"><Icon class="ui-icon" name="lucide:circle-check" aria-hidden="true" /><span>{{ item }}</span></li>
          </ul>
          <ul v-if="section.steps" class="process-list">
            <li v-for="(step, index) in section.steps" :key="step"><Icon class="ui-icon" name="lucide:circle-dot" aria-hidden="true" /><span><strong>Step {{ index + 1 }}:</strong> {{ step }}</span></li>
          </ul>
        </section>
        <section v-if="page.faq?.length" class="content-block">
          <h2>Frequently asked questions</h2>
          <ul class="faq-list">
            <li v-for="item in page.faq" :key="item.question"><Icon class="ui-icon" name="lucide:circle-help" aria-hidden="true" /><span><strong>{{ item.question }}</strong><br>{{ item.answer }}</span></li>
          </ul>
        </section>
      </div>
      <aside id="quote-form" class="sidebar">
        <div class="quote-card">
          <QuoteForm v-bind="page.form" />
        </div>
        <div class="contact-card document-card">
          <h3>What to send first</h3>
          <ul class="check-list">
            <li><Icon class="ui-icon" name="lucide:file-text" aria-hidden="true" /><span>BL or AWB if cargo has shipped.</span></li>
            <li><Icon class="ui-icon" name="lucide:file-check-2" aria-hidden="true" /><span>Invoice and packing list for document review.</span></li>
            <li><Icon class="ui-icon" name="lucide:map" aria-hidden="true" /><span>Origin, destination and delivery deadline.</span></li>
          </ul>
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
