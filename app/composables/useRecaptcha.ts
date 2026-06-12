export function useRecaptcha() {
  const config = useRuntimeConfig()
  const loaded = useState('kenya-tradex:recaptcha-loaded', () => false)
  const loading = useState('kenya-tradex:recaptcha-loading', () => false)

  async function load() {
    if (!import.meta.client) return
    if (window.grecaptcha || loaded.value || loading.value) return
    loading.value = true
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.onload = () => {
        loaded.value = true
        loading.value = false
        resolve()
      }
      script.onerror = () => {
        loading.value = false
        reject(new Error('Failed to load reCAPTCHA'))
      }
      document.head.appendChild(script)
    })
  }

  function render(element: HTMLElement, callbacks: { onSuccess: () => void; onExpired: () => void }) {
    if (!import.meta.client || !window.grecaptcha) return null
    return window.grecaptcha.render(element, {
      sitekey: config.public.recaptchaSiteKey,
      callback: callbacks.onSuccess,
      'expired-callback': callbacks.onExpired
    })
  }

  return { load, render }
}

declare global {
  interface Window {
    grecaptcha?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => number
      getResponse: (widgetId?: number) => string
      reset: (widgetId?: number) => void
    }
  }
}
