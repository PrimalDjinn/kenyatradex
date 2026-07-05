<script setup lang="ts">
const { data: site } = await useAsyncData('site:settings:footer', () => queryCollection('site').where('slug', '=', 'settings').first())
const contact = computed(() => site.value?.contact || { phone: '+254 721 596 259', phoneHref: '+254721596259', email: 'info@kenyatradex.africa', address: 'Liwatoni Road, Mombasa, Kenya', whatsapp: 'https://wa.me/254721596259' })
const brand = computed(() => site.value?.brand || { name: 'Kenya Tradex', tagline: 'Freight, customs and regional logistics', logo: '/images/kenya-tradex-logo-header.png' })
const primaryServices = computed(() => (site.value?.services || []).slice(0, 6))
const corridorLinks = computed(() => (site.value?.moreServiceLinks || []).filter((link) => ['Transit Cargo', 'Shipping from Dubai', 'Shipping from China', 'Import from South Africa'].includes(link.label)))
const credentials = computed(() => site.value?.credentials || ['KRA PIN P051396680R', 'KIFWA M2294', 'Customs CAL/001526/24', 'KPA 101839'])
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-cta">
        <div>
          <p class="footer-kicker">Mombasa operations desk</p>
          <h2>Have a cargo file that needs movement, release or route clarity?</h2>
        </div>
        <div class="footer-cta-actions">
          <a class="btn" :href="`${contact.whatsapp}?text=Hello%20Kenya%20Tradex%2C%20I%20need%20a%20cargo%20file%20review`" target="_blank" rel="noopener"><Icon class="ui-icon" name="lucide:message-circle" aria-hidden="true" /> Send file details</a>
          <a class="footer-phone" :href="`tel:${contact.phoneHref}`"><Icon class="ui-icon" name="lucide:phone" aria-hidden="true" /> {{ contact.phone }}</a>
        </div>
      </div>
      <div class="footer-grid">
        <div class="footer-brand footer-col">
          <NuxtLink class="footer-logo" to="/">
            <NuxtImg :src="brand.logo" :alt="`${brand.name} Logo`" width="54" height="54" />
            <span>{{ brand.name }}<small>{{ brand.tagline }}</small></span>
          </NuxtLink>
          <p>Licensed coordination for cargo moving through Mombasa Port, Nairobi ICD, JKIA and East African corridors.</p>
          <div class="footer-credentials" aria-label="Operating credentials">
            <span v-for="credential in credentials" :key="credential">{{ credential }}</span>
          </div>
          <p class="footer-proof">{{ site?.proof || '200+ cargo files handled monthly | Zero cargo-loss record to date' }}</p>
        </div>
        <div class="footer-col">
          <h4>Core cargo desks</h4>
          <NuxtLink v-for="service in primaryServices" :key="service.href" :to="service.href">{{ service.label }}</NuxtLink>
        </div>
        <div class="footer-col">
          <h4>Corridors & special files</h4>
          <NuxtLink v-for="link in corridorLinks" :key="link.href" :to="link.href">{{ link.label }}</NuxtLink>
          <NuxtLink to="/vehicle-import-to-kenya.html">Vehicle Import</NuxtLink>
          <NuxtLink to="/project-logistics.html">Project Logistics</NuxtLink>
        </div>
        <div class="footer-contact footer-col">
          <h4>Direct contact</h4>
          <a :href="`tel:${contact.phoneHref}`"><Icon class="ui-icon" name="lucide:phone" aria-hidden="true" /> {{ contact.phone }}</a>
          <a :href="`${contact.whatsapp}?text=Track%20BL%20No%3A`" target="_blank" rel="noopener"><Icon class="ui-icon" name="lucide:crosshair" aria-hidden="true" /> Track cargo by BL</a>
          <a :href="`mailto:${contact.email}`"><Icon class="ui-icon" name="lucide:mail" aria-hidden="true" /> {{ contact.email }}</a>
          <p><Icon class="ui-icon" name="lucide:map-pin" aria-hidden="true" /> {{ contact.address }}</p>
          <div class="footer-utility"><a href="/sitemap.xml">Sitemap</a><a href="/robots.txt">Robots.txt</a></div>
        </div>
      </div>
      <div class="copyright">
        <p>© 2026 Kenya Tradex. Freight forwarding and logistics from Mombasa, Kenya.</p>
        <p>Send route, cargo type, invoice value, packing list and BL/AWB where available.</p>
      </div>
    </div>
  </footer>
</template>
