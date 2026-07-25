<script setup lang="ts">
definePageMeta({ layout: "default" });

const route = useRoute();
const token = computed(() => String(route.query.token || ""));
const status = ref<"idle" | "sending" | "success" | "error">("idle");

async function unsubscribe() {
  if (!token.value || status.value === "sending") return;
  status.value = "sending";
  try {
    await $fetch(`/api/newsletter/unsubscribe`, {
      method: "POST",
      query: { token: token.value },
    });
    status.value = "success";
  } catch {
    status.value = "error";
  }
}

useHead({ title: "Manage Newsletter Subscription | Kenya Tradex" });
</script>

<template>
  <main
    class="site-container flex min-h-[65vh] items-center justify-center py-16"
  >
    <section
      class="w-full max-w-xl border-t-4 border-[var(--color-brand-red)] bg-white p-6 text-[var(--color-text-primary)] sm:p-10"
    >
      <template v-if="status === 'success'">
        <h1 class="section-title mb-4">You are unsubscribed</h1>
        <p class="text-[var(--color-text-muted)]">
          Kenya Tradex will no longer send newsletter updates to this address.
        </p>
      </template>
      <template v-else>
        <h1 class="section-title mb-4">Unsubscribe from updates?</h1>
        <p class="mb-6 text-[var(--color-text-muted)]">
          You will stop receiving Kenya Tradex customs, trade regulation and
          logistics updates.
        </p>
        <button
          class="inline-flex min-h-12 items-center justify-center bg-[var(--color-brand-red)] px-5 py-3 font-extrabold text-white disabled:opacity-60"
          :disabled="!token || status === 'sending'"
          @click="unsubscribe"
        >
          {{
            status === "sending" ? "Unsubscribing..." : "Confirm unsubscribe"
          }}
        </button>
        <p
          v-if="status === 'error'"
          class="mt-4 font-semibold text-[var(--color-brand-red)]"
          role="alert"
        >
          This unsubscribe link is invalid or expired.
        </p>
      </template>
    </section>
  </main>
</template>
