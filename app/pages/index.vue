<script setup lang="ts">
import { coverage, moreServiceLinks, services } from '~/data/site'

useHead({
  title: 'Kenya Tradex: Freight Forwarding, Customs Clearance & Logistics in Kenya',
  meta: [
    { name: 'description', content: 'Freight forwarding, customs clearance and regional logistics from Mombasa and Nairobi for Kenya, Uganda, Rwanda, DRC and South Sudan.' },
    { property: 'og:title', content: 'Kenya Tradex: Freight Forwarding, Customs Clearance & Logistics in Kenya' },
    { property: 'og:description', content: 'Freight forwarding, customs clearance, warehousing and regional cargo delivery from Mombasa and Nairobi for Kenya and East Africa.' },
    { property: 'og:image', content: 'https://kenyatradex.africa/images/home-hero-og.jpg' }
  ],
  link: [{ rel: 'canonical', href: 'https://kenyatradex.africa/' }]
})
</script>

<template>
  <!-- JOURNEY: Importers arrive worried about cargo release, cost, and accountability. The page first proves Kenya Tradex is licensed and reachable, then routes visitors by cargo job, shows corridor coverage, and ends with the exact quote path. -->
  <SiteShell>
    <section class="hero">
      <NuxtImg class="hero-media" src="/images/home-hero-poster.jpg" alt="Freight forwarding and customs clearance in Kenya" width="1280" height="768" preload fetchpriority="high" />
      <div class="container hero-grid">
        <div>
          <span class="eyebrow"><Icon class="ui-icon" name="lucide:anchor" aria-hidden="true" /> Mombasa & Nairobi Freight Coordination</span>
          <h1>Move cargo through Kenya without losing control of the file.</h1>
          <p class="lead on-dark">Kenya Tradex coordinates freight, customs clearance, warehousing and onward delivery for cargo moving through Mombasa, Nairobi and major East African corridors.</p>
          <p class="hero-note"><strong>Updated June 11, 2026</strong> | Reviewed by Kenya Tradex logistics team</p>
          <div class="hero-actions">
            <a class="btn" href="https://wa.me/254721596259?text=Hello%20Kenya%20Tradex%2C%20I%20need%20a%20freight%20quote" target="_blank" rel="noopener"><Icon class="ui-icon" name="lucide:message-circle" aria-hidden="true" /> Send route details</a>
            <a class="btn-secondary" href="https://wa.me/254721596259?text=Track%20BL%20No%3A" target="_blank" rel="noopener"><Icon class="ui-icon" name="lucide:crosshair" aria-hidden="true" /> Track cargo by BL</a>
          </div>
          <div class="quick-actions" aria-label="Quick client actions">
            <a class="quick-action" href="https://wa.me/254721596259?text=Hello%20Kenya%20Tradex%2C%20quote%201x20ft%20container%20from%20Mombasa%20to%20Kampala" target="_blank" rel="noopener"><Icon class="ui-icon" name="lucide:message-circle" aria-hidden="true" /><span>Quote Mombasa to Kampala</span></a>
            <a class="quick-action" href="https://wa.me/254721596259?text=Track%20BL%20No%3A" target="_blank" rel="noopener"><Icon class="ui-icon" name="lucide:crosshair" aria-hidden="true" /><span>Track cargo by BL No.</span></a>
            <NuxtLink class="quick-action" to="/import-duty-calculator.html"><Icon class="ui-icon" name="lucide:calculator" aria-hidden="true" /><span>Estimate import duty</span></NuxtLink>
          </div>
        </div>
        <aside class="hero-card manifest-card" aria-label="Operations summary">
          <p class="manifest-kicker">Operations desk</p>
          <h2>One accountable file from arrival notice to delivery.</h2>
          <dl class="manifest-list">
            <div><dt>Primary nodes</dt><dd>Mombasa Port, Nairobi ICD, JKIA</dd></div>
            <div><dt>Document flow</dt><dd>IDF, entries, duty exposure, release orders</dd></div>
            <div><dt>Corridors</dt><dd>Kenya, Uganda, Rwanda, DRC, South Sudan</dd></div>
          </dl>
          <NuxtLink class="btn" to="/customs-clearance-kenya.html"><Icon class="ui-icon" name="lucide:clipboard-list" aria-hidden="true" /> View customs clearance</NuxtLink>
        </aside>
      </div>
    </section>

    <section class="trust-strip">
      <div class="container trust-ledger" aria-label="Kenya Tradex operating credentials">
        <div class="trust-item"><span>Authority</span><strong>KIFWA M2294</strong><p>Customs License CAL/001526/24 and KPA 101839 for licensed cargo work.</p></div>
        <div class="trust-item"><span>File volume</span><strong>200+ monthly</strong><p>Port, airport and regional workflows handled by a dedicated operations desk.</p></div>
        <div class="trust-item"><span>Custody record</span><strong>Zero cargo loss</strong><p>Consignments stay visible from arrival notice through release and handoff.</p></div>
        <div class="trust-item"><span>Status path</span><strong>BL tracking</strong><p>Send a bill of lading number and receive a practical cargo status update.</p></div>
      </div>
    </section>

    <section id="services" class="section">
      <div class="container">
        <div class="section-header services-heading">
          <p class="section-label">Cargo desk menu</p>
          <h2>Pick the point where your shipment needs control</h2>
          <p class="lead">Every service page keeps the operating details visible: documents, route, duty exposure and the next handoff.</p>
        </div>
        <div class="services-board">
          <NuxtLink v-for="(service, index) in services" :key="service.href" class="service-card" :to="service.href">
            <span class="service-index">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="service-icon"><Icon class="ui-icon" :name="service.icon || 'lucide:box'" aria-hidden="true" /></span>
            <h3>{{ service.label }}</h3>
            <p>{{ service.description }}</p>
            <span class="service-link">Open service file →</span>
          </NuxtLink>
        </div>
        <p class="more-services">
          Also available:
          <template v-for="(link, index) in moreServiceLinks" :key="link.href">
            <NuxtLink :to="link.href">{{ link.label }}</NuxtLink><span v-if="index < moreServiceLinks.length - 1"> | </span>
          </template>
        </p>
      </div>
    </section>

    <section id="coverage" class="section corridor-section">
      <div class="container corridor-panel">
        <div class="section-header">
          <p class="section-label">Corridor map</p>
          <h2>Coverage across Kenya and major East African trade corridors</h2>
          <p class="lead">Cargo decisions are made by route, risk and timing. Kenya Tradex keeps the operating map visible from the first quote.</p>
        </div>
        <div class="country-badges">
          <div v-for="country in coverage" :key="country" class="country-item"><Icon class="ui-icon" name="lucide:flag" aria-hidden="true" /> {{ country }}</div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-header split-header">
          <h2>Operational advantages for importers and exporters</h2>
          <p class="lead">A single logistics partner for freight coordination, customs support and regional cargo movement.</p>
        </div>
        <div class="features">
          <div class="feature"><Icon class="ui-icon feature-icon" name="lucide:headphones" aria-hidden="true" /><div><h3>Responsive coordination</h3><p>Quick communication from enquiry to cargo movement.</p></div></div>
          <div class="feature"><Icon class="ui-icon feature-icon" name="lucide:globe-2" aria-hidden="true" /><div><h3>Regional logistics focus</h3><p>Built around Mombasa, Nairobi, Kampala and key corridors.</p></div></div>
          <div class="feature"><Icon class="ui-icon feature-icon" name="lucide:scale" aria-hidden="true" /><div><h3>Duty and compliance clarity</h3><p>Plain-language guidance on HS codes, duty exposure, IDF, VAT, RDL and inspections.</p></div></div>
        </div>
      </div>
    </section>

    <section id="contact" class="section contact-section">
      <div class="container">
        <div class="section-header contact-heading">
          <div>
            <p class="section-label">Quote intake</p>
            <h2>Send the file once. Get a practical next step.</h2>
            <div class="contact-heading-cues" aria-label="Quote review cues">
              <span><Icon class="ui-icon" name="lucide:file-check-2" aria-hidden="true" /> Documents checked</span>
              <span><Icon class="ui-icon" name="lucide:route" aria-hidden="true" /> Route confirmed</span>
              <span><Icon class="ui-icon" name="lucide:clock-3" aria-hidden="true" /> Next step returned</span>
            </div>
          </div>
          <p class="lead">For freight, clearance, warehousing, project cargo or cross-border transport, Kenya Tradex responds best when the route, cargo type and document status are visible from the start.</p>
        </div>
        <div class="contact-desk">
          <aside class="contact-info" aria-label="Kenya Tradex direct contact details">
            <div class="contact-stamp"><Icon class="ui-icon" name="lucide:badge-check" aria-hidden="true" /> Licensed freight desk</div>
            <h3>Kenya Tradex</h3>
            <p class="contact-intro">Mombasa-based coordination for cargo files moving through port, ICD, JKIA and regional corridors.</p>
            <div class="contact-actions" aria-label="Fast contact options">
              <a href="tel:+254721596259"><Icon class="ui-icon" name="lucide:phone" aria-hidden="true" /><span>Call<br><strong>+254 721 596 259</strong></span></a>
              <a href="https://wa.me/254721596259?text=Hello%20Kenya%20Tradex%2C%20I%20need%20cargo%20support" target="_blank" rel="noopener"><Icon class="ui-icon" name="lucide:message-circle" aria-hidden="true" /><span>WhatsApp<br><strong>Send cargo details</strong></span></a>
            </div>
            <dl class="contact-list">
              <div><dt>Office</dt><dd><Icon class="ui-icon" name="lucide:map-pin" aria-hidden="true" /> Liwatoni Road, Mombasa, Kenya</dd></div>
              <div><dt>Email</dt><dd><Icon class="ui-icon" name="lucide:mail" aria-hidden="true" /> <a href="mailto:info@kenyatradex.africa">info@kenyatradex.africa</a></dd></div>
              <div><dt>Registration</dt><dd><Icon class="ui-icon" name="lucide:id-card" aria-hidden="true" /> KRA PIN P051396680R</dd></div>
              <div><dt>Licenses</dt><dd><Icon class="ui-icon" name="lucide:shield-check" aria-hidden="true" /><span class="credential-lines"><span>KIFWA Member No: M2294</span><span>Customs License: CAL/001526/24</span></span></dd></div>
            </dl>
            <div class="contact-assurance">
              <span>What to send first</span>
              <p>Route, cargo type, invoice value, packing list, BL/AWB if available, and destination deadline.</p>
            </div>
          </aside>
          <div class="quote-card quote-card-featured">
            <QuoteForm id="quote-form" page-name="Homepage Inquiry" title="Request a quote review" intro="Share the cargo file basics. We will reply with the next clearance, freight or delivery step." submit-label="Send quote request" success-message="Request received. Kenya Tradex will respond shortly." :fields="[{ name: 'name', label: 'Full Name', type: 'text', placeholder: 'Full Name *', required: true }, { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Email Address *', required: true }, { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '(254) ___ ___ ___' }, { name: 'service', label: 'Service', type: 'hidden', value: 'Freight quote request' }, { name: 'destination', label: 'Destination', type: 'hidden', value: 'To be confirmed' }, { name: 'message', label: 'Cargo details', type: 'textarea', placeholder: 'Cargo type and route: e.g. 1x20ft container, Mombasa to Kampala, arrival date, BL No. if available. *', required: true }]" />
          </div>
        </div>
      </div>
    </section>
  </SiteShell>
</template>
