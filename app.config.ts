export default defineAppConfig({
  ui: {
    icons: {
      loading: 'i-lucide-loader-circle',
      check: 'i-lucide-check',
      chevronDown: 'i-lucide-chevron-down'
    },
    button: {
      slots: {
        base: 'rounded-xl font-bold cursor-pointer disabled:cursor-not-allowed'
      }
    },
    input: {
      slots: {
        base: 'rounded-xl min-h-12 text-base bg-white'
      }
    },
    select: {
      slots: {
        base: 'rounded-xl min-h-12 text-base bg-white',
        content: 'z-60'
      }
    },
    textarea: {
      slots: {
        base: 'rounded-2xl min-h-32 text-base bg-white'
      }
    }
  }
})
