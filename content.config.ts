import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
  icon: z.string().optional(),
  description: z.string().optional(),
  external: z.boolean().optional()
})

const heroSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  lead: z.string().optional(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  updated: z.string().optional(),
  reviewedBy: z.string().optional()
}).passthrough()

const blockSchema = z.object({
  type: z.string().optional(),
  title: z.string().optional(),
  eyebrow: z.string().optional(),
  body: z.string().optional(),
  paragraphs: z.array(z.string()).optional(),
  items: z.array(z.string()).optional(),
  steps: z.array(z.string()).optional(),
  links: z.array(linkSchema).optional(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  note: z.string().optional()
}).passthrough()

const formFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.enum(['text', 'email', 'tel', 'textarea', 'select', 'hidden']),
  placeholder: z.string().optional(),
  value: z.string().optional(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional()
})

const formSchema = z.object({
  id: z.string(),
  pageName: z.string(),
  title: z.string().optional(),
  intro: z.string().optional(),
  submitLabel: z.string().optional(),
  successMessage: z.string().optional(),
  fields: z.array(formFieldSchema)
}).passthrough()

const editablePageSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string().optional(),
  canonical: z.string().optional(),
  image: z.string().optional(),
  hero: heroSchema.optional(),
  blocks: z.array(blockSchema).optional(),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  form: formSchema.optional(),
  related: z.array(linkSchema).optional(),
  pdf: z.string().optional()
}).passthrough()

export default defineContentConfig({
  collections: {
    site: defineCollection({
      type: 'data',
      source: 'site/**/*.json',
      schema: z.object({
        slug: z.string(),
        brand: z.object({ name: z.string(), tagline: z.string().optional(), headerTagline: z.string().optional(), logo: z.string() }),
        contact: z.object({ phone: z.string(), phoneHref: z.string(), email: z.string(), address: z.string(), whatsapp: z.string() }),
        navLinks: z.array(linkSchema),
        services: z.array(linkSchema),
        moreServiceLinks: z.array(linkSchema),
        coverage: z.array(z.string()).optional(),
        credentials: z.array(z.string()).optional(),
        proof: z.string().optional()
      }).passthrough()
    }),
    pages: defineCollection({
      type: 'data',
      source: 'pages/**/*.json',
      schema: editablePageSchema
    }),
    services: defineCollection({
      type: 'data',
      source: 'services/**/*.json',
      schema: editablePageSchema
    }),
    downloads: defineCollection({
      type: 'data',
      source: 'downloads/**/*.json',
      schema: editablePageSchema
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        image: z.string().optional(),
        date: z.string().optional(),
        updated: z.string().optional()
      })
    })
  }
})
