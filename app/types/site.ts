export type LinkItem = {
  label: string
  href: string
  icon?: string
  description?: string
  external?: boolean
}

export type FormField = {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'hidden'
  placeholder?: string
  value?: string
  required?: boolean
  options?: string[]
}

export type ServicePage = {
  slug: string
  title: string
  description: string
  canonical: string
  heroImage: string
  eyebrow: string
  heading: string
  lead: string
  updated?: string
  reviewedBy?: string
  related?: LinkItem[]
  sections: Array<{
    title: string
    body?: string
    items?: string[]
    steps?: string[]
  }>
  faq?: Array<{ question: string; answer: string }>
  form: {
    id: string
    pageName: string
    title: string
    intro: string
    submitLabel: string
    successMessage: string
    fields: FormField[]
  }
}
