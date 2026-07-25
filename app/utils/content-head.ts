import { joinURL, withFragment, withTrailingSlash } from "ufo";

type EditablePageLike = {
  slug: string;
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
  hero?: { image?: string };
  faq?: Array<{ question: string; answer: string }>;
};

export function getConfiguredSiteUrl() {
  const config = useRuntimeConfig();
  const configured = String(config.public.siteUrl || "").trim();
  if (configured) return configured.replace(/\/+$/, "");
  if (import.meta.server) return useRequestURL().origin.replace(/\/+$/, "");
  if (import.meta.client && window.location.origin) return window.location.origin.replace(/\/+$/, "");
  return "https://kenyatradex.africa";
}

export function getAbsoluteSiteUrl(path?: string | null) {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return joinURL(getConfiguredSiteUrl(), path);
}

export function getEditablePageCanonical(page?: Pick<EditablePageLike, "slug" | "canonical"> | null) {
  if (!page) return undefined;
  return (
    page.canonical ||
    (page.slug === "home"
      ? withTrailingSlash(getConfiguredSiteUrl())
      : joinURL(getConfiguredSiteUrl(), `${page.slug}.html`))
  );
}

export function getEditablePageSeo(page?: EditablePageLike | null) {
  const canonical = getEditablePageCanonical(page);
  const image = getAbsoluteSiteUrl(page?.hero?.image || page?.image);
  return {
    title: page?.title,
    description: page?.description,
    robots: "index, follow, max-snippet:-1, max-image-preview:large",
    ogType: "website" as const,
    ogSiteName: "Kenya Tradex",
    ogUrl: canonical,
    ogLocale: "en_KE",
    ogTitle: page?.title,
    ogDescription: page?.description,
    ogImage: image,
    ogImageWidth: "1200",
    ogImageHeight: "675",
    twitterCard: "summary_large_image" as const,
    twitterTitle: page?.title,
    twitterDescription: page?.description,
    twitterImage: image,
  };
}

export function getOrganizationSchemas() {
  const siteUrl = getConfiguredSiteUrl();
  const organizationId = withFragment(joinURL(siteUrl, "/"), "#organization");
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: "Kenya Tradex",
    url: siteUrl,
    logo: joinURL(siteUrl, "/images/kenya-tradex-logo.png"),
    telephone: "+254721596259",
    email: "info@kenyatradex.africa",
    identifier: [
      { "@type": "PropertyValue", name: "KRA PIN", value: "P051396680R" },
      { "@type": "PropertyValue", name: "KIFWA Member Number", value: "M2294" },
      {
        "@type": "PropertyValue",
        name: "Customs License",
        value: "CAL/001526/24",
      },
      { "@type": "PropertyValue", name: "KPA Number", value: "101839" },
    ],
    areaServed: ["Kenya", "Uganda", "Rwanda", "Burundi", "Democratic Republic of the Congo", "South Sudan", "Tanzania"],
  };

  return [
    organization,
    {
      ...organization,
      "@type": "LocalBusiness",
      "@id": withFragment(joinURL(siteUrl, "/"), "#localbusiness"),
      address: {
        "@type": "PostalAddress",
        streetAddress: "Liwatoni Road",
        addressLocality: "Mombasa",
        addressCountry: "KE",
      },
      parentOrganization: { "@id": organizationId },
    },
  ];
}

export function getBreadcrumbSchema(items: Array<{ name: string; item: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getAbsoluteSiteUrl(item.item),
    })),
  };
}

export function getEditablePageHead(page?: EditablePageLike | null) {
  const canonical = getEditablePageCanonical(page);
  const scripts = [];

  if (page) {
    scripts.push({
      type: "application/ld+json",
      innerHTML: JSON.stringify(
        getBreadcrumbSchema([
          { name: "Home", item: "/" },
          { name: page.title, item: canonical || "/" },
        ]),
      ),
    });
  }

  if (page?.faq?.length) {
    scripts.push({
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: page.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }),
    });
  }

  return {
    link: canonical ? [{ rel: "canonical", href: canonical }] : [],
    meta: [
      { name: "geo.region", content: "KE" },
      { name: "geo.placename", content: "Mombasa" },
    ],
    script: scripts,
  };
}
