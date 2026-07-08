<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const redirectTo = computed(() => {
  const redirect = String(route.query.redirect || '/blog.html')
  return redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/blog.html'
})

const { data: session } = await useFetch('/api/admin/session')

if (session.value?.authenticated) {
  await navigateTo(redirectTo.value, { external: false })
}

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    await navigateTo(redirectTo.value, { external: false })
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UApp>
    <main class="grid min-h-screen place-items-center bg-[linear-gradient(180deg,var(--color-background)_0%,var(--color-surface-raised)_100%)] p-6">
      <section class="grid w-full max-w-lg gap-6 rounded-[1.75rem] border border-[color:oklch(22%_0.075_258/.12)] bg-white p-8 shadow-2xl">
        <NuxtLink class="inline-flex items-center gap-3 no-underline" to="/">
          <NuxtImg src="/images/kenya-tradex-logo-header.png" alt="Kenya Tradex" width="54" height="54" />
          <span class="flex flex-col text-lg font-black leading-tight text-[var(--color-text-primary)]">Kenya Tradex<small class="text-xs font-semibold text-[var(--color-text-muted)]">Content Studio</small></span>
        </NuxtLink>
        <div>
          <p class="mb-4 inline-flex items-center rounded-full bg-red-50 px-4 py-2 text-sm font-black text-[var(--color-brand-red-dark)]">Admin access</p>
          <h1 class="mb-4 text-4xl font-black tracking-[-0.035em] text-[var(--color-text-primary)]">Sign in to manage website content.</h1>
          <p class="text-[var(--color-text-muted)]">Use the admin email and password configured in the server environment.</p>
        </div>
        <form class="grid gap-4" @submit.prevent="submit">
          <UFormField label="Email address" name="email" required>
            <UInput v-model="email" type="email" autocomplete="email" placeholder="admin@example.com" size="xl" autofocus />
          </UFormField>
          <UFormField label="Password" name="password" required>
            <UInput v-model="password" type="password" autocomplete="current-password" placeholder="Password" size="xl" />
          </UFormField>
          <UButton type="submit" block size="xl" :loading="loading" class="font-black">
            Sign in to Studio
          </UButton>
          <p v-if="error" class="text-sm font-semibold text-red-600" role="alert">{{ error }}</p>
        </form>
      </section>
    </main>
  </UApp>
</template>
