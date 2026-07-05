type EditablePageLike = {
  slug: string
  title: string
  description?: string
  canonical?: string
  image?: string
  hero?: { image?: string }
  faq?: Array<{ question: string, answer: string }>
}

export function getEditablePageCanonical(page?: Pick<EditablePageLike, 'slug' | 'canonical'> | null) {
  if (!page) return undefined
  return page.canonical || `https://kenyatradex.africa/${page.slug === 'home' ? '' : `${page.slug}.html`}`
}

export function getEditablePageSeo(page?: EditablePageLike | null) {
  const image = page?.hero?.image || page?.image
  return {
    title: page?.title,
    description: page?.description,
    ogType: 'website' as const,
    ogSiteName: 'Kenya Tradex',
    ogTitle: page?.title,
    ogDescription: page?.description,
    ogImage: image
  }
}

export function getEditablePageHead(page?: EditablePageLike | null) {
  const canonical = getEditablePageCanonical(page)
  const scripts = []

  if (page?.faq?.length) {
    scripts.push({
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: page.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer }
        }))
      })
    })
  }

  return {
    link: canonical ? [{ rel: 'canonical', href: canonical }] : [],
    script: scripts
  }
}
