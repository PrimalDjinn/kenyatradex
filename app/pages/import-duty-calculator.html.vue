<script setup lang="ts">
useHead({
  title: 'Kenya Import Duty Calculator | KRA Car & Cargo Duty Estimate',
  meta: [{ name: 'description', content: 'Kenya import duty calculator for KRA car duty, vehicle CRSP, cargo customs duty, VAT, excise, IDF and RDL estimates in KES.' }],
  link: [{ rel: 'canonical', href: 'https://kenyatradex.africa/import-duty-calculator.html' }]
})
</script>

<template>
  <!-- JOURNEY: Calculator visitors want a grounded cost signal before they commit to a shipment or clearance file. The page gives a fast estimate, then moves them toward a reviewed document-based quote. -->
  <SiteShell>
    <section class="hero">
      <NuxtImg class="hero-media" src="/images/calculator-hero.jpg" alt="Kenya import duty calculator" width="1600" height="900" />
      <div class="container hero-grid">
        <div>
          <span class="eyebrow"><Icon class="ui-icon" name="lucide:calculator" aria-hidden="true" /> Import duty calculator</span>
          <h1>Estimate Kenya import duty for vehicles and cargo.</h1>
          <p class="lead on-dark">Use this practical calculator for customs duty, VAT, excise, IDF and RDL guidance before contacting Kenya Tradex for file-specific advice.</p>
        </div>
        <aside class="hero-card"><h2>Need a reviewed estimate?</h2><p>Share your cargo documents or vehicle details and Kenya Tradex can review the likely clearance path.</p><a class="btn" href="#quote-form">Request help</a></aside>
      </div>
    </section>
    <div class="container content-layout">
      <div>
        <ImportDutyCalculator />
        <section class="content-block">
          <h2>What affects final import duty?</h2>
          <ul class="check-list">
            <li><Icon class="ui-icon" name="lucide:circle-check" aria-hidden="true" /><span>HS code, customs valuation and cargo description.</span></li>
            <li><Icon class="ui-icon" name="lucide:circle-check" aria-hidden="true" /><span>Vehicle CRSP, age, engine capacity and applicable taxes.</span></li>
            <li><Icon class="ui-icon" name="lucide:circle-check" aria-hidden="true" /><span>KEBS, permits, inspections and other agency requirements.</span></li>
          </ul>
        </section>
      </div>
      <aside id="quote-form" class="sidebar"><div class="quote-card"><QuoteForm id="calculator-form" page-name="Import Duty Calculator Inquiry" title="Request duty help" intro="Share the vehicle or cargo details for a practical review." submit-label="Send duty request" :fields="[{ name: 'name', label: 'Full Name', type: 'text', placeholder: 'Full Name *', required: true }, { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Email Address *', required: true }, { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '(254) ___ ___ ___' }, { name: 'message', label: 'Cargo or vehicle details', type: 'textarea', placeholder: 'Vehicle CRSP/engine/year or cargo CIF/HS code details. *', required: true }]" /></div></aside>
    </div>
  </SiteShell>
</template>
