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
  <section class="newsletter-panel">
    <div>
      <p class="section-label">Newsletter</p>
      <h2>{{ title || 'Stay Informed on Trade Regulations' }}</h2>
      <p>{{ body || 'Get monthly updates on customs policy changes, new import regulations, and practical logistics tips delivered to your inbox. No spam, unsubscribe anytime.' }}</p>
    </div>
    <form class="newsletter-form" @submit.prevent="submit">
      <input v-model="website" class="sr-only" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">
      <input v-model="name" type="text" name="name" placeholder="Your name" autocomplete="name" aria-label="Your name">
      <input v-model="email" type="email" name="email" placeholder="Your email address" autocomplete="email" aria-label="Email address" required>
      <button type="submit" class="btn" :disabled="sending"><Icon class="ui-icon" name="lucide:send" aria-hidden="true" /> {{ sending ? 'Subscribing...' : 'Subscribe to Updates' }}</button>
      <p v-if="feedback" class="feedback" :class="feedbackType === 'error' ? 'error-text' : 'success-text'" role="status">{{ feedback }}</p>
    </form>
  </section>
</template>

<style scoped>
.newsletter-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.7fr);
  gap: clamp(24px, 5vw, 48px);
  align-items: center;
  padding: clamp(28px, 5vw, 48px);
  margin-bottom: 1.35rem;
  border-radius: 28px;
  color: white;
  background: linear-gradient(135deg, var(--navy-deep), var(--navy));
  box-shadow: var(--shadow);
}

.newsletter-panel h2 {
  color: white;
}

.newsletter-panel p {
  color: rgba(255, 255, 255, 0.82);
}

.newsletter-form {
  display: grid;
  gap: 1rem;
}

.newsletter-form input {
  margin: 0;
  color: white;
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
}

.newsletter-form input::placeholder {
  color: rgba(255, 255, 255, 0.62);
}

.newsletter-form .btn {
  border: 0;
}

@media (max-width: 760px) {
  .newsletter-panel {
    grid-template-columns: 1fr;
  }
}
</style>
