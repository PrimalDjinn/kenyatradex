import { resolve } from 'node:path'

export default defineNuxtConfig({
  compatibilityDate: '2026-06-12',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/content', '@nuxthub/core', '@nuxt/fonts', '@nuxt/icon', '@nuxt/image', '@nuxt/ui', 'nuxt-studio'],
  css: ['~/assets/css/main.css'],
  ui: {
    fonts: false,
    colorMode: false,
    content: true,
    theme: {
      colors: ['primary', 'success', 'error', 'neutral'],
      defaultVariants: {
        color: 'primary',
        size: 'lg'
      }
    }
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=yes' },
        { name: 'author', content: 'Kenya Tradex' },
        { name: 'theme-color', content: '#0b1a33' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/images/favicon-32.png' },
        { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/images/favicon-48.png' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'apple-touch-icon', href: '/images/kenya-tradex-logo.png' }
      ]
    }
  },
  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [300, 400, 500, 600, 700, 800, 900] }
    ]
  },
  image: {
    format: ['webp', 'jpg', 'png'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  },
  content: {
    experimental: { sqliteConnector: 'native' },
    build: {
      markdown: {
        toc: { depth: 3, searchDepth: 3 }
      }
    }
  },
  studio: {
    route: '/_studio',
    auth: {
      sso: {
        serverUrl: process.env.STUDIO_SSO_URL || "https://kenyatradex.africa",
        clientId: process.env.STUDIO_SSO_CLIENT_ID || 'kenyatradex-studio',
        clientSecret: process.env.STUDIO_SSO_CLIENT_SECRET || process.env.NUXT_ADMIN_SESSION_SECRET || process.env.NUXT_ADMIN_PASSWORD
      }
    },
    repository: {
      provider: 'github',
      owner: "PrimalDjinn",
      repo: "kenyatradex",
      branch: process.env.STUDIO_REPOSITORY_BRANCH || 'main'
    },
    git: {
      commit: {
        messagePrefix: 'content:'
      }
    }
  },
  hub: {
    db: {
      dialect: 'postgresql',
      driver: 'postgres-js',
      applyMigrationsDuringBuild: false,
      applyMigrationsDuringDev: true,
      casing: 'snake_case'
    }
  },
  nitro: {
    publicAssets: [
      { dir: 'public/images', baseURL: '/images', maxAge: 60 * 60 * 24 * 30 },
      { dir: 'public/downloads', baseURL: '/downloads', maxAge: 60 * 60 * 24 * 30 }
    ],
    serverAssets: [
      {
        baseName: 'migrations',
        dir: resolve('server/db/migrations/postgresql')
      }
    ]
  },
  runtimeConfig: {
    smtpHost: process.env.NUXT_SMTP_HOST,
    smtpPort: process.env.NUXT_SMTP_PORT,
    smtpSecure: process.env.NUXT_SMTP_SECURE,
    smtpUser: process.env.NUXT_SMTP_USER,
    smtpPass: process.env.NUXT_SMTP_PASS,
    recaptchaSecret: process.env.NUXT_RECAPTCHA_SECRET,
    adminEmail: process.env.NUXT_ADMIN_EMAIL,
    adminPassword: process.env.NUXT_ADMIN_PASSWORD,
    adminSessionSecret: process.env.NUXT_ADMIN_SESSION_SECRET,
    formRecipient: process.env.NUXT_FORM_RECIPIENT || 'info@kenyatradex.africa',
    public: {
      recaptchaSiteKey: process.env.NUXT_PUBLIC_RECAPTCHA_SITE_KEY || '6Lcm37EsAAAAAPg3fzL8Q44FCzMtEsvoQXKA2Xpo',
    }
  }
})
