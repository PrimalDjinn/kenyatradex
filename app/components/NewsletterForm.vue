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
  <section class="mb-6 grid items-center gap-8 rounded-[1.75rem] bg-[linear-gradient(135deg,var(--color-brand-navy-deep),var(--color-brand-navy))] p-8 text-white shadow-xl lg:grid-cols-[minmax(0,1fr)_minmax(280px,.7fr)] lg:p-12">
    <div>
      <p class="mb-4 font-black text-white/70">Newsletter</p>
      <h2 class="mb-4 text-3xl font-black tracking-[-0.025em] text-white lg:text-5xl">{{ title || 'Stay Informed on Trade Regulations' }}</h2>
      <p class="text-white/80">{{ body || 'Get monthly updates on customs policy changes, new import regulations, and practical logistics tips delivered to your inbox. No spam, unsubscribe anytime.' }}</p>
    </div>
    <form class="grid gap-4" @submit.prevent="submit">
      <input v-model="website" class="sr-only absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">
      <input v-model="name" class="min-h-12 rounded-2xl border border-white/20 bg-white/10 px-4 text-white placeholder:text-white/60" type="text" name="name" placeholder="Your name" autocomplete="name" aria-label="Your name">
      <input v-model="email" class="min-h-12 rounded-2xl border border-white/20 bg-white/10 px-4 text-white placeholder:text-white/60" type="email" name="email" placeholder="Your email address" autocomplete="email" aria-label="Email address" required>
      <button type="submit" class="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-brand-red)] px-5 py-3 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-red-dark)] disabled:cursor-not-allowed disabled:opacity-60" :disabled="sending"><Icon class="h-[1.1em] w-[1.1em] shrink-0" name="lucide:send" aria-hidden="true" /> {{ sending ? 'Subscribing...' : 'Subscribe to Updates' }}</button>
      <p v-if="feedback" class="text-sm font-semibold" :class="feedbackType === 'error' ? 'text-red-200' : 'text-green-200'" role="status">{{ feedback }}</p>
    </form>
  </section>
</template>
