import type { FormField, LinkItem } from './site'

export type EditableBlock = {
  type?: string
  title?: string
  eyebrow?: string
  body?: string
  paragraphs?: string[]
  items?: string[]
  steps?: string[]
  links?: LinkItem[]
  image?: string
  imageAlt?: string
  note?: string
}

export type EditablePage = {
  slug: string
  title: string
  description?: string
  canonical?: string
  image?: string
  hero?: {
    eyebrow?: string
    heading?: string
    lead?: string
    image?: string
    imageAlt?: string
    updated?: string
    reviewedBy?: string
  }
  blocks?: EditableBlock[]
  faq?: Array<{ question: string; answer: string }>
  related?: LinkItem[]
  form?: {
    id: string
    pageName: string
    title?: string
    intro?: string
    submitLabel?: string
    successMessage?: string
    fields: FormField[]
  }
  pdf?: string
}
