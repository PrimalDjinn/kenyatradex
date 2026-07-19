<script setup lang="ts">
type FormField = {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'hidden'
  placeholder?: string
  value?: string
  required?: boolean
  options?: string[]
}

const props = defineProps<{
  id: string
  pageName: string
  title?: string
  intro?: string
  submitLabel?: string
  successMessage?: string
  fields: FormField[]
}>()

const recaptchaBox = ref<HTMLElement | null>(null)
const widgetId = ref<number | null>(null)
const form = reactive<Record<string, string>>({ page_name: props.pageName })
const errors = ref<Set<string>>(new Set())
const feedback = ref('')
const feedbackType = ref<'error' | 'success' | ''>('')
const sending = ref(false)
const recaptchaError = ref(false)
const { load, render } = useRecaptcha()

for (const field of props.fields) form[field.name] = field.value || ''

const visibleFields = computed(() => props.fields.filter((field) => field.type !== 'hidden'))
const hiddenFields = computed(() => props.fields.filter((field) => field.type === 'hidden'))

function validate() {
  const next = new Set<string>()
  for (const field of props.fields) {
    const value = form[field.name]?.trim() || ''
    if (field.required && !value) next.add(field.name)
  }
  if ((form.name || '').trim().length < 2) next.add('name')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((form.email || '').trim())) next.add('email')
  if (form.phone) {
    const phoneClean = form.phone.replace(/[\s()\-+]/g, '')
    if (!/^(254|0)?[1-9]\d{8,9}$/.test(phoneClean)) next.add('phone')
  }
  errors.value = next
  return next.size === 0
}

function formatPhone() {
  let value = (form.phone || '').replace(/\D/g, '')
  if (value.length > 0 && value[0] !== '2' && value.length <= 3) value = `254${value}`
  if (value.length > 12) value = value.slice(0, 12)
  if (value.length <= 3) form.phone = value
  else if (value.length <= 6) form.phone = `(${value.slice(0, 3)}) ${value.slice(3)}`
  else if (value.length <= 9) form.phone = `(${value.slice(0, 3)}) ${value.slice(3, 6)} ${value.slice(6)}`
  else form.phone = `(${value.slice(0, 3)}) ${value.slice(3, 6)} ${value.slice(6, 9)} ${value.slice(9)}`
}

async function ensureRecaptcha() {
  await load()
  await nextTick()
  if (recaptchaBox.value && widgetId.value === null) {
    const rendered = render(recaptchaBox.value, {
      onSuccess: () => { recaptchaError.value = false },
      onExpired: () => { recaptchaError.value = true }
    })
    if (typeof rendered === 'number') widgetId.value = rendered
  }
}

async function submit() {
  feedback.value = ''
  feedbackType.value = ''
  recaptchaError.value = false
  await ensureRecaptcha().catch(() => { })
  const recaptchaResponse = import.meta.client && window.grecaptcha && widgetId.value !== null ? window.grecaptcha.getResponse(widgetId.value) : ''
  if (!validate() || !recaptchaResponse) {
    recaptchaError.value = !recaptchaResponse
    feedback.value = 'Please fill in all required fields correctly.'
    feedbackType.value = 'error'
    return
  }
  sending.value = true
  try {
    const payload = { ...form, 'g-recaptcha-response': recaptchaResponse }
    await $fetch('/api/contact', { method: 'POST', body: payload })
    feedback.value = props.successMessage || 'Request received. We will get back to you shortly.'
    feedbackType.value = 'success'
    for (const key of Object.keys(form)) if (key !== 'page_name') form[key] = ''
    if (import.meta.client && window.grecaptcha && widgetId.value !== null) window.grecaptcha.reset(widgetId.value)
  } catch (error: unknown) {
    feedback.value = error instanceof Error ? error.message : 'Failed to send. Please try again or email us directly.'
    feedbackType.value = 'error'
    if (import.meta.client && window.grecaptcha && widgetId.value !== null) window.grecaptcha.reset(widgetId.value)
  } finally {
    sending.value = false
  }
}

onMounted(() => {
  const el = recaptchaBox.value?.closest('form')
  if (!el) return
  const start = () => ensureRecaptcha().catch(() => { })
  el.addEventListener('focusin', start, { once: true })
  el.addEventListener('pointerenter', start, { once: true })
  if ('IntersectionObserver' in window && recaptchaBox.value) {
    const observer = new IntersectionObserver((entries, obs) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        start()
        obs.disconnect()
      }
    }, { rootMargin: '500px 0px' })
    observer.observe(recaptchaBox.value)
  }
})
</script>

<template>
  <form :id="id" class="grid gap-4" novalidate @submit.prevent="submit">
    <header v-if="title || intro" class="mb-2">
      <h3 v-if="title" class="mb-3 text-xl font-extrabold text-[var(--color-text-primary)]">{{ title }}</h3>
      <p v-if="intro" class="text-[var(--color-text-muted)]">{{ intro }}</p>
    </header>
    <input type="hidden" name="page_name" :value="pageName">
    <input v-for="field in hiddenFields" :key="field.name" v-model="form[field.name]" type="hidden" :name="field.name">
    <template v-for="field in visibleFields" :key="field.name">
      <UFormField
        :label="field.label"
        :name="field.name"
        :required="field.required"
        :error="errors.has(field.name) ? 'Required or invalid value' : undefined"
        class="w-full"
      >
        <UTextarea
          v-if="field.type === 'textarea'"
          :id="`${id}-${field.name}`"
          v-model="form[field.name]"
          :name="field.name"
          :placeholder="field.placeholder"
          :aria-required="field.required"
          class="w-full"
          size="lg"
          autoresize
        />
        <USelect
          v-else-if="field.type === 'select'"
          :id="`${id}-${field.name}`"
          v-model="form[field.name]"
          :name="field.name"
          :placeholder="field.placeholder || field.label"
          :items="field.options || []"
          :aria-required="field.required"
          class="w-full"
          size="lg"
        />
        <UInput
          v-else
          :id="`${id}-${field.name}`"
          v-model="form[field.name]"
          :name="field.name"
          :type="field.type"
          :placeholder="field.placeholder"
          :aria-required="field.required"
          :autocomplete="field.type === 'email' ? 'email' : field.name === 'name' ? 'name' : field.name === 'phone' ? 'tel' : undefined"
          :inputmode="field.name === 'phone' ? 'tel' : undefined"
          class="w-full"
          size="lg"
          @input="field.name === 'phone' && formatPhone()"
        />
      </UFormField>
    </template>
    <div ref="recaptchaBox" class="recaptcha-frame min-h-20" />
    <p v-if="recaptchaError" class="text-sm font-semibold text-red-600">Please verify you are human.</p>
    <UButton type="submit" block size="xl" :loading="sending" leading-icon="i-lucide-send" class="font-black">
      {{ sending ? 'Sending...' : submitLabel || 'Send quote request' }}
    </UButton>
    <p
      v-if="feedback"
      class="text-sm font-semibold"
      :class="feedbackType === 'error' ? 'text-red-600' : 'text-green-700'"
      role="status"
      aria-live="polite"
    >
      {{ feedback }}
    </p>
  </form>
</template>
