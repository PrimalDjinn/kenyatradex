<script setup lang="ts">
defineProps<{
  title?: string
  body?: string
  source?: string
}>()

const name = ref('')
const email = ref('')
const website = ref('')
const sending = ref(false)
const feedback = ref('')
const feedbackType = ref<'success' | 'error' | ''>('')

async function submit() {
  feedback.value = ''
  feedbackType.value = ''
  sending.value = true
  try {
    await $fetch('/api/newsletter', {
      method: 'POST',
      body: { name: name.value, email: email.value, website: website.value, source: 'Blog Newsletter Signup' }
    })
    feedback.value = 'You are subscribed to Kenya Tradex trade regulation and logistics updates.'
    feedbackType.value = 'success'
    name.value = ''
    email.value = ''
  } catch (error: unknown) {
    feedback.value = error instanceof Error ? error.message : 'Subscription failed. Please try again.'
    feedbackType.value = 'error'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <section class="mt-12 grid items-center gap-8 rounded-2xl bg-[linear-gradient(135deg,var(--color-brand-navy-deep),var(--color-brand-navy))] p-6 text-white lg:mt-16 lg:grid-cols-5 lg:p-10">
    <div class="lg:col-span-3">
      <p class="mb-2 font-bold text-white/70">Newsletter</p>
      <h2 class="mb-4 max-w-[18ch] text-3xl font-extrabold leading-[1.08] tracking-[-0.025em] text-white lg:text-4xl">{{ title || 'Stay Informed on Trade Regulations' }}</h2>
      <p class="text-white/80">{{ body || 'Get monthly updates on customs policy changes, new import regulations, and practical logistics tips delivered to your inbox. No spam, unsubscribe anytime.' }}</p>
    </div>
    <form class="grid gap-4 lg:col-span-2" @submit.prevent="submit">
      <input v-model="website" class="sr-only absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">
      <input v-model="name" class="min-h-12 rounded-xl border border-white/20 bg-white/10 px-4 text-white placeholder:text-white/60" type="text" name="name" placeholder="Your name" autocomplete="name" aria-label="Your name">
      <input v-model="email" class="min-h-12 rounded-xl border border-white/20 bg-white/10 px-4 text-white placeholder:text-white/60" type="email" name="email" placeholder="Your email address" autocomplete="email" aria-label="Email address" required>
      <button type="submit" class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand-red)] px-5 py-3 font-extrabold text-white transition hover:bg-[var(--color-brand-red-dark)] disabled:cursor-not-allowed disabled:opacity-60" :disabled="sending"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:send" aria-hidden="true" /> {{ sending ? 'Subscribing...' : 'Subscribe to Updates' }}</button>
      <p v-if="feedback" class="text-sm font-semibold" :class="feedbackType === 'error' ? 'text-red-200' : 'text-green-200'" role="status">{{ feedback }}</p>
    </form>
  </section>
</template>
