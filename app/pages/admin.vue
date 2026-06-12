<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const redirectTo = computed(() => {
  const redirect = String(route.query.redirect || '/_studio')
  return redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/_studio'
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
    <main class="admin-login-page">
      <section class="admin-login-card">
        <NuxtLink class="admin-login-brand" to="/">
          <NuxtImg src="/images/kenya-tradex-logo-header.png" alt="Kenya Tradex" width="54" height="54" />
          <span>Kenya Tradex<small>Content Studio</small></span>
        </NuxtLink>
        <div>
          <p class="eyebrow">Admin access</p>
          <h1>Sign in to manage website content.</h1>
          <p class="lead">Use the admin email and password configured in the server environment.</p>
        </div>
        <form class="admin-login-form" @submit.prevent="submit">
          <UFormField label="Email address" name="email" required>
            <UInput v-model="email" type="email" autocomplete="email" placeholder="admin@example.com" size="xl" autofocus />
          </UFormField>
          <UFormField label="Password" name="password" required>
            <UInput v-model="password" type="password" autocomplete="current-password" placeholder="Password" size="xl" />
          </UFormField>
          <UButton type="submit" block size="xl" :loading="loading" class="kt-ui-submit">
            Sign in to Studio
          </UButton>
          <p v-if="error" class="feedback error-text" role="alert">{{ error }}</p>
        </form>
      </section>
    </main>
  </UApp>
</template>
