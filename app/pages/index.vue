<script setup lang="ts">
definePageMeta({ layout: "default" });

const { data: page } = await useAsyncData("page:home", () =>
  queryCollection("pages").where("slug", "=", "home").first(),
);
const { data: settings } = await useAsyncData("site:settings:home", () =>
  queryCollection("site").where("slug", "=", "settings").first(),
);

if (!page.value)
  throw createError({ statusCode: 404, statusMessage: "Home Page Not Found" });

const blocks = computed(() => page.value?.blocks || []);
const heroNote = computed(() => blocks.value[0]?.paragraphs?.[0]);
const heroBlock = computed(() => blocks.value[0]);

// FIXME: This is not the right way of doing this, maybe change the structure at source
const founderBlock = computed(() =>
  blocks.value.find((block) => block.title?.includes("23+ years")),
);
const processBlock = computed(() =>
  blocks.value.find((block) => block.title?.includes("Process control")),
);
const servicesBlock = computed(() =>
  blocks.value.find((block) => block.title?.includes("Logistics services")),
);
const coverageBlock = computed(() =>
  blocks.value.find((block) => block.title?.includes("Coverage")),
);
const advantagesBlock = computed(() =>
  blocks.value.find((block) => block.title?.includes("Operational advantages")),
);
const practicalBlock = computed(() =>
  blocks.value.find((block) => block.title?.includes("cargo problems")),
);
const contactBlock = computed(() =>
  blocks.value.find((block) =>
    block.title?.includes("Request a freight quote"),
  ),
);
const serviceLinks = computed(() => settings.value?.services || []);
const moreServiceLinks = computed(() => settings.value?.moreServiceLinks || []);
const coverage = computed(() => settings.value?.coverage || []);
const advantageLabels = [
  "Responsive coordination",
  "Regional logistics focus",
  "End-to-end service",
];
const practicalLabels = [
  "Document-first clearance",
  "Route-aware planning",
  "Duty and compliance clarity",
];
const heroPointLabels = [
  "Ocean, air & road freight",
  "Customs clearance support",
  "Regional delivery",
];

useSeoMeta(getEditablePageSeo(page.value));
useHead(getEditablePageHead(page.value));
</script>

<template>
  <!-- JOURNEY: Importers arrive worried about cargo release, cost, and accountability. The page first proves Kenya Tradex is licensed and reachable, then routes visitors by cargo job, shows corridor coverage, and ends with the exact quote path. -->
  <div :data-content-id="page?.id">
    <section
      class="page-hero relative isolate overflow-hidden bg-[var(--color-brand-navy)] !py-12 text-white lg:!py-24"
    >
      <NuxtImg
        class="absolute inset-0 z-[-2] h-full w-full object-cover"
        :src="
          page?.hero?.image || page?.image || '/images/home-hero-poster.jpg'
        "
        :alt="
          page?.hero?.imageAlt ||
          page?.hero?.heading ||
          'Freight forwarding and customs clearance in Kenya'
        "
        width="1280"
        height="768"
        preload
        fetchpriority="high"
      />
      <div
        class="absolute inset-0 z-[-1] bg-[linear-gradient(120deg,oklch(16%_0.062_258/.92),oklch(22%_0.075_258/.72),oklch(42%_0.17_27/.45))]"
      />
      <div
        class="site-container grid min-w-0 items-end gap-10 lg:grid-cols-[1.25fr_.75fr]"
      >
        <div class="min-w-0">
          <span
            class="inline-flex max-w-full items-start gap-2 border-l-2 border-[var(--color-brand-red)] pl-3 text-xs font-bold uppercase tracking-[.1em] text-white/75 sm:text-sm sm:tracking-[.12em]"
            ><Icon
              class="mt-0.5 h-[1.1em] w-[1.1em] shrink-0"
              name="lucide:anchor"
              aria-hidden="true"
            />
            Mombasa & Nairobi Freight Coordination</span
          >
          <h1 class="page-hero-title mt-4 text-white">
            {{ page?.hero?.heading || page?.title }}
          </h1>
          <p class="mt-5 max-w-2xl text-lg text-white/85">
            {{ page?.hero?.lead || page?.description }}
          </p>
          <p v-if="heroNote" class="mt-3 max-w-2xl text-sm text-white/80">
            <strong>{{ heroNote }}</strong>
          </p>
          <div class="mt-6 flex flex-wrap gap-3 lg:mt-8">
            <a
              class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand-red)] px-5 py-3 font-extrabold text-white no-underline transition hover:bg-[var(--color-brand-red-dark)]"
              href="https://wa.me/254786850801?text=Hello%20Kenya%20Tradex%2C%20I%20need%20a%20freight%20quote%20for%20cargo%20from%20%5Borigin%5D%20to%20%5Bdestination%5D"
              target="_blank"
              rel="noopener"
              ><Icon
                class="h-[1.1em] w-[1.1em] shrink-0"
                name="lucide:message-circle"
                aria-hidden="true"
              />
              Get freight quote on WhatsApp</a
            >
            <a
              class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/35 px-5 py-3 font-bold text-white no-underline transition hover:bg-white/10"
              href="https://wa.me/254786850801?text=Track%20BL%20No%3A"
              target="_blank"
              rel="noopener"
              ><Icon
                class="h-[1.1em] w-[1.1em] shrink-0"
                name="lucide:crosshair"
                aria-hidden="true"
              />
              Track cargo by BL</a
            >
          </div>
          <ul class="mt-5 grid list-none gap-3 p-0 sm:grid-cols-3 lg:mt-6">
            <li
              v-for="(item, index) in heroBlock?.items?.slice(0, 3) || []"
              :key="item"
              class="border-t border-white/25 pt-3 text-sm text-white/85"
            >
              <strong class="block text-white">{{
                heroPointLabels[index]
              }}</strong
              >{{ item.slice(heroPointLabels[index]?.length || 0) }}
            </li>
          </ul>
        </div>
        <aside
          class="min-w-0 border-t border-white/25 pt-5 text-white lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0"
          aria-label="Operations summary"
        >
          <h2 class="mb-4 text-3xl font-black text-white lg:text-4xl">
            {{ heroBlock?.title }}
          </h2>
          <ul class="m-0 list-none space-y-3 p-0">
            <li
              v-for="item in heroBlock?.items?.slice(3) || []"
              :key="item"
              class="flex gap-3 text-white/85"
            >
              <Icon
                class="mt-1 h-[1.1em] w-[1.1em] shrink-0 text-red-300"
                name="lucide:circle-check"
                aria-hidden="true"
              />{{ item }}
            </li>
          </ul>
          <NuxtLink
            class="mt-6 inline-flex min-h-11 items-center justify-center gap-2 font-bold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
            to="/customs-clearance-kenya.html"
            >View customs clearance <span aria-hidden="true">→</span></NuxtLink
          >
        </aside>
      </div>
    </section>

    <section class="bg-white py-6 shadow-sm">
      <div
        class="site-container grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        aria-label="Kenya Tradex operating credentials"
      >
        <div class="border-t-2 border-[var(--color-brand-red)] bg-slate-50 p-5">
          <strong
            class="block text-xl font-black text-[var(--color-text-primary)]"
            >Licensed memberships</strong
          >
          <p class="mb-0 text-sm text-[var(--color-text-muted)]">
            Member of FIATA<br />KIFWA Member No: M2294<br />Customs License:
            CAL/001526/24
          </p>
        </div>
        <div class="border-t-2 border-[var(--color-brand-red)] bg-slate-50 p-5">
          <strong
            class="block text-xl font-black text-[var(--color-text-primary)]"
            >23+ years expertise</strong
          >
          <p class="mb-0 text-sm text-[var(--color-text-muted)]">
            Founder-led customs and logistics experience behind the operating
            approach
          </p>
        </div>
        <div class="border-t-2 border-[var(--color-brand-red)] bg-slate-50 p-5">
          <strong
            class="block text-xl font-black text-[var(--color-text-primary)]"
            >200+ files monthly</strong
          >
          <p class="mb-0 text-sm text-[var(--color-text-muted)]">
            Cargo files handled through port, airport and regional workflows
          </p>
        </div>
        <div class="border-t-2 border-[var(--color-brand-red)] bg-slate-50 p-5">
          <strong
            class="block text-xl font-black text-[var(--color-text-primary)]"
            >Zero cargo loss</strong
          >
          <p class="mb-0 text-sm text-[var(--color-text-muted)]">
            No cargo-loss record to date across handled consignments
          </p>
        </div>
      </div>
    </section>

    <section class="py-16 lg:py-24">
      <div
        class="site-container grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-start"
      >
        <div>
          <p class="mb-3 font-bold text-[var(--color-brand-red-dark)]">
            Founder-led expertise
          </p>
          <h2 class="section-title">{{ founderBlock?.title }}</h2>
          <p class="mt-5 max-w-2xl text-lg text-[var(--color-text-muted)]">
            {{ founderBlock?.body }}
          </p>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="border-t-2 border-[var(--color-brand-red)] bg-white p-6">
            <strong>Former KRA Customs Manager</strong>
            <p class="mt-2 text-sm text-[var(--color-text-muted)]">
              Customs administration, compliance and regulatory process
              experience.
            </p>
          </div>
          <div class="border-t-2 border-[var(--color-brand-red)] bg-white p-6">
            <strong>Former AGL Customs Support Services Manager</strong>
            <p class="mt-2 text-sm text-[var(--color-text-muted)]">
              Operational customs support for complex cargo environments.
            </p>
          </div>
          <div class="border-t-2 border-[var(--color-brand-red)] bg-white p-6">
            <strong>Former AGL C&F Operations Manager</strong>
            <p class="mt-2 text-sm text-[var(--color-text-muted)]">
              Clearing and forwarding leadership across shipment release
              workflows.
            </p>
          </div>
          <div class="border-t-2 border-[var(--color-brand-red)] bg-white p-6">
            <strong>Customs law and business training</strong>
            <p class="mt-2 text-sm text-[var(--color-text-muted)]">
              Master's in Customs Law, Policy and Administration plus MBA
              training.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white py-16 lg:py-24">
      <div class="site-container">
        <div class="mx-auto mb-10 max-w-3xl text-center">
          <p class="mb-3 font-bold text-[var(--color-brand-red-dark)]">
            Operational confidence
          </p>
          <h2 class="section-title mx-auto">{{ processBlock?.title }}</h2>
          <p class="mt-4 text-lg text-[var(--color-text-muted)]">
            {{ processBlock?.body }}
          </p>
        </div>
        <ol
          class="mx-auto max-w-4xl list-none divide-y divide-[var(--color-border)] border-y border-[var(--color-border)] p-0"
        >
          <li
            v-for="(item, index) in processBlock?.items || []"
            :key="item"
            class="grid gap-2 py-6 sm:grid-cols-[3rem_1fr] sm:gap-5"
          >
            <span class="text-2xl font-black text-[var(--color-brand-red)]">{{
              String(index + 1).padStart(2, "0")
            }}</span>
            <div>
              <h3 class="mb-2 text-xl font-extrabold">
                {{ item.split(":")[0] }}
              </h3>
              <p class="text-[var(--color-text-muted)]">
                {{ item.split(":").slice(1).join(":").trim() }}
              </p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section id="services" class="py-16 lg:py-24">
      <div class="site-container">
        <div class="mb-8 max-w-3xl lg:mb-12">
          <p class="mb-4 font-black text-[var(--color-brand-red-dark)]">
            Core services
          </p>
          <h2 class="section-title mb-4 text-[var(--color-text-primary)]">
            {{ servicesBlock?.title }}
          </h2>
          <p class="max-w-2xl text-lg text-[var(--color-text-muted)]">
            {{ servicesBlock?.body }}
          </p>
        </div>
        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="(service, index) in serviceLinks"
            :key="service.href"
            class="rounded-xl border border-[var(--color-border)] bg-white p-6 text-[var(--color-text-primary)] no-underline transition hover:border-[var(--color-brand-red)]"
            :to="service.href"
          >
            <span class="text-sm font-black text-[var(--color-brand-red)]">{{
              String(index + 1).padStart(2, "0")
            }}</span>
            <span
              class="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-[var(--color-brand-red)]"
              ><Icon
                class="h-[1.1em] w-[1.1em] shrink-0"
                :name="service.icon || 'lucide:box'"
                aria-hidden="true"
            /></span>
            <h3 class="mb-3 text-xl font-extrabold">{{ service.label }}</h3>
            <p class="text-[var(--color-text-muted)]">
              {{ service.description }}
            </p>
            <span
              class="mt-4 inline-block font-black text-[var(--color-brand-red)]"
              >Learn more →</span
            >
          </NuxtLink>
        </div>
        <p class="mt-8 text-sm text-[var(--color-text-muted)]">
          Also available:
          <template v-for="(link, index) in moreServiceLinks" :key="link.href">
            <NuxtLink
              class="font-bold text-[var(--color-brand-red)] no-underline hover:underline"
              :to="link.href"
              >{{ link.label }}</NuxtLink
            ><span v-if="index < moreServiceLinks.length - 1"> | </span>
          </template>
        </p>
      </div>
    </section>

    <section id="coverage" class="py-16 lg:py-20">
      <div
        class="site-container rounded-2xl bg-[var(--color-brand-navy)] p-6 text-white sm:p-8"
      >
        <div class="mb-8 max-w-3xl lg:mb-12">
          <p class="mb-4 font-black text-red-200">Regional footprint</p>
          <h2 class="section-title text-white">{{ coverageBlock?.title }}</h2>
        </div>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="country in coverage"
            :key="country"
            class="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 p-6 text-white"
          >
            <Icon
              class="h-[1.1em] w-[1.1em] shrink-0"
              name="lucide:flag"
              aria-hidden="true"
            />
            {{ country }}
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 lg:py-20">
      <div class="site-container">
        <div
          class="mb-8 flex max-w-3xl flex-col justify-between gap-4 lg:mb-12 lg:max-w-none lg:flex-row lg:items-end"
        >
          <h2 class="section-title mb-4 text-[var(--color-text-primary)]">
            {{ advantagesBlock?.title }}
          </h2>
          <p class="max-w-2xl text-lg text-[var(--color-text-muted)]">
            {{ advantagesBlock?.body }}
          </p>
        </div>
        <div class="grid gap-5 md:grid-cols-3">
          <div
            v-for="(item, index) in advantagesBlock?.items || []"
            :key="item"
            class="border-t-4 border-[var(--color-brand-red)] bg-white p-6 text-[var(--color-text-primary)]"
          >
            <Icon
              class="mb-4 h-8 w-8 text-[var(--color-brand-red)]"
              :name="
                ['lucide:headphones', 'lucide:globe-2', 'lucide:scale'][
                  index
                ] || 'lucide:circle-check'
              "
              aria-hidden="true"
            />
            <div>
              <h3 class="mb-3 text-xl font-extrabold">
                {{ advantageLabels[index] }}
              </h3>
              <p class="text-[var(--color-text-muted)]">{{ item }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white py-16 lg:py-24">
      <div class="site-container">
        <div class="mx-auto mb-10 max-w-3xl text-center">
          <p class="mb-3 font-bold text-[var(--color-brand-red-dark)]">
            Practical trade experience
          </p>
          <h2 class="section-title mx-auto">{{ practicalBlock?.title }}</h2>
          <p class="mt-5 text-lg text-[var(--color-text-muted)]">
            {{ practicalBlock?.body }}
          </p>
        </div>
        <div class="grid gap-5 md:grid-cols-3">
          <article
            v-for="(item, index) in practicalBlock?.items || []"
            :key="item"
            class="border-t-4 border-[var(--color-brand-red)] bg-[var(--color-surface-raised)] p-6"
          >
            <h3 class="mb-3 text-xl font-extrabold">
              {{ practicalLabels[index] }}
            </h3>
            <p class="text-[var(--color-text-muted)]">{{ item }}</p>
          </article>
        </div>
      </div>
    </section>

    <section v-if="page?.faq?.length" id="faq" class="py-16 lg:py-24">
      <div class="site-container max-w-4xl">
        <div class="mb-8 text-center">
          <p class="mb-3 font-bold text-[var(--color-brand-red-dark)]">
            Frequently Asked Questions
          </p>
          <h2 class="section-title mx-auto">
            Common questions about freight forwarding and customs clearance
          </h2>
        </div>
        <div
          class="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]"
        >
          <details v-for="item in page.faq" :key="item.question" class="py-5">
            <summary class="cursor-pointer pr-8 text-lg font-extrabold">
              {{ item.question }}
            </summary>
            <p class="mt-3 text-[var(--color-text-muted)]">{{ item.answer }}</p>
          </details>
        </div>
      </div>
    </section>

    <section id="contact" class="bg-white py-16 lg:py-24">
      <div class="site-container">
        <div class="mx-auto mb-10 max-w-3xl text-center">
          <p class="mb-3 font-bold text-[var(--color-brand-red-dark)]">
            Get in touch
          </p>
          <h2 class="section-title mx-auto text-[var(--color-text-primary)]">
            {{ contactBlock?.title }}
          </h2>
          <p class="mt-4 text-lg text-[var(--color-text-muted)]">
            {{ contactBlock?.body }}
          </p>
        </div>
        <div class="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <aside
            class="rounded-xl bg-[var(--color-brand-navy)] p-6 text-white"
            aria-label="Kenya Tradex direct contact details"
          >
            <h3 class="mb-3 text-xl font-extrabold text-white">Kenya Tradex</h3>
            <div class="grid gap-4 text-white/80">
              <a
                class="flex min-h-11 items-center gap-3 text-white"
                href="https://maps.app.goo.gl/FgwAR5uw3TTwHLpTA"
                target="_blank"
                rel="noopener"
                ><Icon
                  class="h-[1.1em] w-[1.1em] shrink-0"
                  name="lucide:map-pin"
                  aria-hidden="true"
                />{{ settings?.contact?.address }}</a
              >
              <a
                class="flex min-h-11 items-center gap-3 text-white"
                :href="`tel:${settings?.contact?.phoneHref}`"
                ><Icon
                  class="h-[1.1em] w-[1.1em] shrink-0"
                  name="lucide:phone"
                  aria-hidden="true"
                />{{ settings?.contact?.phone }}</a
              >
              <a
                class="flex min-h-11 items-center gap-3 text-white"
                :href="`${settings?.contact?.whatsapp}?text=Hello%20Kenya%20Tradex%2C%20I%20need%20cargo%20support`"
                target="_blank"
                rel="noopener"
                ><Icon
                  class="h-[1.1em] w-[1.1em] shrink-0"
                  name="lucide:message-circle"
                  aria-hidden="true"
                />WhatsApp +254 786 850 801</a
              >
              <a
                class="flex min-h-11 items-center gap-3 text-white"
                :href="`mailto:${settings?.contact?.email}`"
                ><Icon
                  class="h-[1.1em] w-[1.1em] shrink-0"
                  name="lucide:mail"
                  aria-hidden="true"
                />{{ settings?.contact?.email }}</a
              >
              <p class="flex gap-3">
                <Icon
                  class="mt-1 h-[1.1em] w-[1.1em] shrink-0"
                  name="lucide:clock"
                  aria-hidden="true"
                />Mon-Sat, 8:00am-5:00pm
              </p>
              <p>KRA PIN: P051***680R</p>
              <p>KIFWA Member No: M2294<br />Customs License: CAL/001526/24</p>
              <p>KPA No. 10**39 | Zero cargo-loss record to date</p>
            </div>
            <div class="mt-6 border-t border-white/15 pt-5">
              <h4 class="mb-3 font-extrabold text-white">Free Client Tools</h4>
              <p class="mb-3 text-sm text-white/75">
                Quick links for checking cargo status, port timelines and import
                documentation systems.
              </p>
              <div class="flex flex-wrap gap-x-4 text-sm">
                <a
                  class="inline-flex min-h-11 items-center text-white"
                  href="https://wa.me/254786850801?text=Track%20BL%20No%3A"
                  target="_blank"
                  rel="noopener"
                  >Track Your Shipment</a
                ><a
                  class="inline-flex min-h-11 items-center text-white"
                  href="https://www.kpa.co.ke/FourteenDaysList"
                  target="_blank"
                  rel="noopener"
                  >KPA 14 Days List</a
                ><a
                  class="inline-flex min-h-11 items-center text-white"
                  href="https://www.kwatos.kpa.co.ke"
                  target="_blank"
                  rel="noopener"
                  >KWATOS</a
                ><a
                  class="inline-flex min-h-11 items-center text-white"
                  href="https://icmscas.kra.go.ke/cas/login"
                  target="_blank"
                  rel="noopener"
                  >KRA iCMS</a
                ><a
                  class="inline-flex min-h-11 items-center text-white"
                  href="https://tfp.kenyatradenet.go.ke/TFBSEW/cusLogin/signin.cl"
                  target="_blank"
                  rel="noopener"
                  >KenTrade Login</a
                >
              </div>
            </div>
          </aside>
          <div
            class="rounded-2xl border border-[var(--color-border)] bg-white p-4 text-[var(--color-text-primary)] shadow-lg sm:p-6"
          >
            <QuoteForm v-if="page?.form" v-bind="page.form" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
