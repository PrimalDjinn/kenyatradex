import type { ServicePage } from '~/types/site'

const baseFields = [
  { name: 'name', label: 'Full Name', type: 'text' as const, placeholder: 'Full Name *', required: true },
  { name: 'email', label: 'Email Address', type: 'email' as const, placeholder: 'Email Address *', required: true },
  { name: 'phone', label: 'Phone Number', type: 'tel' as const, placeholder: '(254) ___ ___ ___' }
]

const cargoMessage = { name: 'message', label: 'Cargo details', type: 'textarea' as const, placeholder: 'Cargo details: type, volume, origin, destination, timing and any document or border requirements. *', required: true }

export const servicePages: ServicePage[] = [
  {
    slug: 'customs-clearance-kenya',
    title: 'Customs Clearance Kenya | KRA, KPA & KEBS Import Support',
    description: 'Licensed customs clearance in Kenya for import, export and transit cargo with KRA, KPA, KEBS, IDF, duty planning, document review and release support.',
    canonical: 'https://kenyatradex.africa/customs-clearance-kenya.html',
    heroImage: '/images/clearing-forwarding-hero-1200.jpg',
    eyebrow: 'Licensed Kenya customs clearance support',
    heading: 'Customs clearance in Kenya for importers who need KRA, KPA and KEBS steps handled clearly.',
    lead: 'Kenya Tradex supports import, export and transit cargo files through document review, duty planning, agency requirement checks and release coordination for cargo moving through Mombasa, Nairobi ICD and JKIA.',
    updated: 'June 12, 2026',
    reviewedBy: 'Kenya Tradex customs desk',
    related: [
      { label: 'Mombasa Customs Clearance', href: '/mombasa-customs-clearance.html' },
      { label: 'Nairobi ICD Clearance', href: '/nairobi-icd-customs-clearance.html' },
      { label: 'JKIA Air Cargo Clearance', href: '/jkia-air-cargo-clearance.html' },
      { label: 'Transit Cargo', href: '/transit-cargo-uganda-rwanda-drc-south-sudan.html' }
    ],
    sections: [
      {
        title: 'When this service is the right fit',
        body: 'Use this service when the cargo file must be reviewed before release risk turns into storage, demurrage or delivery delay.',
        items: [
          'Import cargo arriving through Mombasa, Nairobi ICD, JKIA or Moi cargo workflows.',
          'Transit cargo moving from Mombasa to Uganda, Rwanda, Burundi, DRC or South Sudan.',
          'Regulated or sensitive cargo that may need KEBS, PVOC, permits, valuation review or agency coordination.'
        ]
      },
      {
        title: 'What Kenya Tradex checks before clearance starts',
        body: 'Most customs delays start before the cargo reaches release stage. Kenya Tradex handles 200+ cargo files monthly and maintains a zero cargo-loss record to date.',
        items: [
          'Bill of lading, airway bill, commercial invoice and packing list consistency.',
          'HS code, customs value, IDF, VAT, RDL and landed-cost exposure.',
          'Applicable KRA, KPA, KEBS, PVOC and other agency requirements.',
          'Consignee, destination and transit information for the cargo route.',
          'Release, storage, demurrage and onward delivery risks.'
        ]
      },
      {
        title: 'Customs clearance process',
        steps: [
          'Send the BL or AWB, invoice, packing list and cargo route on WhatsApp or the quote form.',
          'Kenya Tradex reviews the file for missing, inconsistent or risky details before entry work begins.',
          'The file is checked against KRA, KPA, KEBS and relevant agency requirements for the cargo type.',
          'Payment timing, inspection status, release orders and onward delivery are coordinated into one workflow.'
        ]
      },
      {
        title: 'Verified trust details',
        body: 'KRA PIN P051396680R | KIFWA Member No. M2294 | Customs License CAL/001526/24 | KPA No. 101839.',
        items: [
          'Licensed customs and freight coordination.',
          '200+ cargo files handled monthly.',
          'Zero cargo-loss record to date.',
          'Track cargo status by BL through WhatsApp.'
        ]
      }
    ],
    faq: [
      { question: 'What documents are needed for customs clearance in Kenya?', answer: 'Common documents include the bill of lading or airway bill, commercial invoice, packing list, import declaration details where applicable, certificates or permits required for the cargo, and consignee details.' },
      { question: 'How long does customs clearance in Kenya take?', answer: 'Clearance time depends on document completeness, cargo type, inspection requirements, payment timing and port or airport workflows. Straightforward files may move faster, while regulated or inspected cargo can take longer.' },
      { question: 'Can Kenya Tradex help with KEBS and other agency requirements?', answer: 'Yes. Kenya Tradex helps importers identify applicable KEBS, PVOC and other agency requirements so documents are prepared before cargo release is delayed.' },
      { question: 'Do you clear transit cargo through Kenya?', answer: 'Yes. Kenya Tradex supports transit cargo documentation and coordination for shipments moving through Kenya to Uganda, Rwanda, Burundi, DRC and South Sudan.' }
    ],
    form: { id: 'customs-clearance-form', pageName: 'Customs Clearance Kenya Inquiry', title: 'Request customs clearance support', intro: 'Share your cargo file details and Kenya Tradex will respond with the next practical customs step.', submitLabel: 'Send customs request', successMessage: 'Request received. Kenya Tradex will respond shortly.', fields: [...baseFields, cargoMessage] }
  },
  {
    slug: 'ocean-freight',
    title: 'Ocean Freight from Mombasa | FCL, LCL & Sea Freight | Kenya Tradex',
    description: 'Ocean freight from Mombasa for FCL, LCL, breakbulk, project cargo and transit shipments to Uganda, Rwanda, DRC and South Sudan.',
    canonical: 'https://kenyatradex.africa/ocean-freight.html',
    heroImage: '/images/ocean-freight-hero.jpg',
    eyebrow: 'Ocean Freight from Mombasa',
    heading: 'FCL, LCL and sea freight through Port of Mombasa.',
    lead: 'Kenya Tradex supports full container load, less than container load, consolidation, customs clearance, transit bonds and inland delivery coordination for cargo moving through Mombasa port.',
    updated: 'June 11, 2026',
    reviewedBy: 'Kenya Tradex sea freight desk',
    related: [
      { label: 'Shipping from China', href: '/shipping-from-china.html' },
      { label: 'Shipping from Dubai', href: '/shipping-from-dubai-to-kenya.html' },
      { label: 'Clearing & Forwarding', href: '/clearing-forwarding.html' }
    ],
    sections: [
      { title: 'Ocean freight services', body: 'Use dedicated or shared container space depending on shipment volume, sensitivity and timing. Kenya Tradex aligns freight booking, document readiness, customs clearance and onward delivery from Mombasa.', items: ['FCL 20ft and 40ft container movement.', 'LCL consolidation for smaller commercial shipments.', 'Breakbulk, oversized and project cargo planning.', 'Transit bond support for regional destinations.'] },
      { title: 'How ocean freight works', steps: ['Share cargo details, origin, destination and preferred timing.', 'Choose FCL, LCL or special cargo handling.', 'Prepare bill of lading, invoice, packing list and import documents.', 'Clear customs at Mombasa and coordinate delivery or transit.'] }
    ],
    faq: [
      { question: 'What ocean freight services does Kenya Tradex provide?', answer: 'Kenya Tradex supports FCL, LCL consolidation, customs clearance, transit bonds and inland delivery coordination for cargo moving through Mombasa port.' },
      { question: 'Do you handle cargo beyond Kenya?', answer: 'Yes. Cargo can move from Mombasa into Uganda, Rwanda, Burundi, DRC, South Sudan and Tanzania with destination-aware documentation and transit bond planning.' }
    ],
    form: { id: 'ocean-form', pageName: 'Ocean Freight Inquiry', title: 'Request an ocean freight quote', intro: 'Share the cargo size, origin and destination and we will advise on FCL, LCL or special handling.', submitLabel: 'Send ocean freight request', successMessage: 'Request received. We will send ocean freight options shortly.', fields: [...baseFields, { name: 'shipment_type', label: 'Shipment type', type: 'select', placeholder: 'Shipment type *', required: true, options: ['FCL 20ft', 'FCL 40ft', 'LCL / shared container', 'Breakbulk / project cargo', 'Not sure - need advice'] }, cargoMessage] }
  },
  {
    slug: 'shipping-from-dubai-to-kenya',
    title: 'Shipping from Dubai to Kenya | Ocean & Air Freight | Kenya Tradex',
    description: 'Ocean freight, air freight, cargo charges and Jebel Ali to Mombasa transit times for shipments moving from Dubai to Kenya.',
    canonical: 'https://kenyatradex.africa/shipping-from-dubai-to-kenya.html',
    heroImage: '/images/dubai-shipping-hero-1200.jpg',
    eyebrow: 'Shipping from Dubai to Kenya',
    heading: 'Ocean and air freight from UAE to Kenya.',
    lead: 'Kenya Tradex provides shipping from Dubai to Kenya with ocean freight from Jebel Ali, air freight from UAE airports, customs clearance at Mombasa or JKIA and delivery coordination.',
    updated: 'April 20, 2026',
    reviewedBy: 'Kenya Tradex UAE trade desk',
    related: [
      { label: 'Jebel Ali Transit Time', href: '/jebel-ali-to-mombasa-transit-time.html' },
      { label: 'Shipping from China', href: '/shipping-from-china.html' },
      { label: 'Vehicle Import', href: '/vehicle-import-to-kenya.html' }
    ],
    sections: [
      { title: 'Shipping from Dubai to Kenya - your complete guide', body: 'Dubai is an important re-export hub for East Africa. Kenya Tradex helps importers compare sea and air freight options, prepare documents and clear cargo on arrival in Kenya.', items: ['Ocean freight from Jebel Ali and UAE ports.', 'Air freight from Dubai and Sharjah airports.', 'Customs clearance at Mombasa port or JKIA.', 'Transit bonds for cargo continuing into regional markets.'] },
      { title: 'How shipping from Dubai works', steps: ['Share cargo details, UAE origin and Kenyan destination.', 'Compare sea freight, air freight or consolidation options.', 'Book space and align supplier handover documents.', 'Clear with KRA and deliver to the final destination.'] }
    ],
    faq: [
      { question: 'How long does shipping from Dubai to Kenya take?', answer: 'Ocean freight from Dubai to Mombasa is commonly planned around 7-12 days on the sea leg. Air freight can be 1-2 days before destination handling and clearance.' },
      { question: 'What products are commonly imported from UAE?', answer: 'Common imports include textiles, machinery, electronics, plastics, chemicals, building materials, vehicle parts and consumer goods.' }
    ],
    form: { id: 'dubai-form', pageName: 'Dubai Shipping Inquiry', title: 'Get a shipping quote from Dubai', intro: 'Share your cargo details and we will provide shipping options from UAE to Kenya.', submitLabel: 'Get shipping quote', successMessage: 'Request received. We will send shipping options within 24 hours.', fields: [...baseFields, { name: 'origin_port', label: 'Origin in UAE', type: 'select', placeholder: 'Origin in UAE *', required: true, options: ['Dubai (Jebel Ali)', 'Dubai (Other)', 'Sharjah', 'Abu Dhabi', 'Other UAE Location'] }, { name: 'shipping_method', label: 'Shipping method', type: 'select', placeholder: 'Shipping method *', required: true, options: ['Sea Freight (FCL - Full Container)', 'Sea Freight (LCL - Shared Container)', 'Air Freight', 'Not sure - need advice'] }, cargoMessage] }
  },
  {
    slug: 'shipping-from-china',
    title: 'Shipping from China to Kenya | Ocean & Air Freight | Kenya Tradex',
    description: 'Shipping from China to Kenya by ocean freight, air freight and LCL consolidation with customs clearance at Mombasa or JKIA.',
    canonical: 'https://kenyatradex.africa/shipping-from-china.html',
    heroImage: '/images/china-shipping-hero-1200.jpg',
    eyebrow: 'Shipping from China to Kenya',
    heading: 'China freight coordination for Kenyan importers.',
    lead: 'Kenya Tradex coordinates commercial cargo from Shanghai, Guangzhou, Shenzhen, Ningbo and other origin hubs into Kenya with freight, documentation and clearance support.',
    updated: 'June 11, 2026',
    reviewedBy: 'Kenya Tradex China trade desk',
    related: [{ label: '1 CBM Shipping Cost', href: '/shipping-cost-from-china-to-kenya-1-cbm.html' }, { label: 'Ocean Freight', href: '/ocean-freight.html' }],
    sections: [
      { title: 'China freight options', body: 'Importers can compare dedicated container space, LCL consolidation and air freight depending on volume, cargo value and urgency.', items: ['FCL for larger commercial shipments.', 'LCL for smaller volumes and samples.', 'Air freight for urgent and high-value goods.', 'Customs clearance and regional delivery after arrival.'] },
      { title: 'How China shipping works', steps: ['Share product type, origin city, volume and destination.', 'Compare ocean, air or consolidation options.', 'Prepare supplier documents and shipping paperwork.', 'Clear cargo through Mombasa or JKIA and arrange onward delivery.'] }
    ],
    faq: [{ question: 'How long does shipping from China to Kenya take?', answer: 'Ocean freight is commonly planned around 20-30 days depending on origin port and routing. Air freight can be 3-5 days before clearance and delivery.' }],
    form: { id: 'china-form', pageName: 'China Shipping Inquiry', title: 'Request a China shipping quote', intro: 'Share your cargo and origin details for China to Kenya freight options.', submitLabel: 'Get China shipping quote', successMessage: 'Request received. We will send China freight options shortly.', fields: [...baseFields, { name: 'origin', label: 'Origin in China', type: 'select', placeholder: 'Origin in China *', required: true, options: ['Shanghai', 'Guangzhou', 'Shenzhen', 'Ningbo', 'Yiwu', 'Other China Location'] }, { name: 'shipping_method', label: 'Shipping method', type: 'select', placeholder: 'Shipping method *', required: true, options: ['Ocean Freight FCL', 'Ocean Freight LCL', 'Air Freight', 'Not sure - need advice'] }, cargoMessage] }
  }
]

const legacyTopics: Record<string, string[]> = {
  'customs-clearance-kenya': ['Import cargo arriving in Kenya', 'Transit cargo through Kenya', 'Regulated or sensitive cargo', 'KRA, KPA, KEBS, IDF and duty planning', 'Document review before release coordination'],
  'clearing-forwarding': ['Forwarding and cargo movement', 'Customs clearing and release', 'Documents and customs requirements', 'Regional destinations supported through transit coordination', 'Mombasa port clearing agents'],
  'air-freight': ['International air freight for urgent cargo', 'JKIA and Moi International Airport cargo support', '24-48 hour priority movement where available', 'Pharmaceuticals, perishables, electronics, samples and high-value cargo', 'Airline, documentation and customs coordination'],
  'overland-transport': ['Road freight from Mombasa and Nairobi', 'Uganda, Rwanda, Burundi, DRC, South Sudan and Tanzania corridors', 'Route planning and transit timing', 'Truck coordination and border documentation', 'Inland delivery after customs release'],
  warehousing: ['Warehousing in Mombasa and Nairobi', 'Cargo storage and handling', 'Cross-docking, pick-and-pack and onward distribution', 'Bonded storage use cases', 'Inventory and phased release coordination'],
  'project-logistics': ['Heavy-lift and oversized cargo', 'Mining, construction, energy and infrastructure projects', 'Route surveys, permits and abnormal-load planning', 'Port handling and site delivery coordination', 'Complex cargo sequencing'],
  'vehicle-import-to-kenya': ['Vehicle imports from Japan, UAE, UK and South Africa', 'Age, inspection and import document checks', 'RoRo or container shipping', 'Duty, VAT, IDF and landed-cost planning', 'Customs clearance and registration support'],
  'cross-border-consulting': ['EAC and AfCFTA trade advisory', 'Rules of origin and tariff planning', 'Export documents and market-entry support', 'Regional compliance and corridor planning', 'Practical consultation before cargo moves'],
  'customs-consultancy': ['Tariff classification and HS code review', 'KRA compliance and duty planning', 'Rules of origin and EAC CET exposure', 'Common customs mistakes to avoid', 'Post-clearance and importer advisory support'],
  'mombasa-customs-clearance': ['Container imports through Port of Mombasa', 'Transit cargo from Mombasa', 'Regulated goods and agency requirements', 'Port release planning', 'Document readiness before vessel arrival'],
  'nairobi-icd-customs-clearance': ['Nairobi ICD document readiness', 'Inspection planning', 'Delivery timing for Nairobi importers', 'Container cargo moving inland', 'KRA and terminal coordination'],
  'jkia-air-cargo-clearance': ['Urgent air cargo customs release', 'Courier cargo, perishables, pharma and spare parts', 'Correct documents before arrival', 'Controlled cargo checks', 'Airport handling and delivery timing'],
  'transit-cargo-uganda-rwanda-drc-south-sudan': ['Mombasa to Kampala', 'Mombasa to Kigali', 'Mombasa to Juba and DRC', 'Transit bonds and destination-aware documentation', 'Border and corridor planning'],
  'jebel-ali-to-mombasa-transit-time': ['Typical Jebel Ali to Mombasa shipping days', 'Vessel schedule and routing factors', 'Sea time versus total delivery time', 'When UAE to Kenya sea freight is attractive', 'Planning customs and inland delivery after arrival'],
  'shipping-cost-from-china-to-kenya-1-cbm': ['What 1 CBM shipping cost means', 'LCL charges, volume and weight factors', 'When 1 CBM LCL is a good idea', 'Information needed before quoting', 'Landed-cost planning beyond freight'],
  'import-car-from-south-africa-to-kenya': ['South Africa to Kenya car import process', 'Why importers choose South Africa vehicles', 'Pre-shipment vehicle and document checks', 'RoRo or container shipping', 'Duties and landed cost before arrival'],
  'customs-bonded-warehouse-kenya': ['Customs bonded warehouse use cases', 'Duty-deferred storage', 'Bonded warehouses in Nairobi and Mombasa', 'Phased cargo release', 'Customs-controlled cargo handling']
}

const simplePageRows: Array<[string, string, string, string, string, string, string]> = [
  ['clearing-forwarding', 'Clearing & Forwarding in Mombasa | Customs Clearance | Kenya Tradex', 'Clearing and forwarding in Mombasa and Nairobi for customs clearance, transit cargo, import documents and cargo release.', '/images/clearing-forwarding-hero-1200.jpg', 'Clearing & Forwarding', 'Clearing and forwarding in Mombasa and Nairobi for import, export and transit cargo.', 'Coordinate freight movement, customs processing and final delivery through one practical logistics partner in Mombasa and Nairobi.'],
  ['air-freight', 'Air Freight Kenya | JKIA & Moi Airport Cargo Clearance', 'Air freight and airport cargo clearance in Kenya through JKIA Nairobi and Moi International Airport Mombasa for urgent imports.', '/images/air-freight-hero.jpg', 'Air Freight Kenya', 'Air freight from Nairobi and Mombasa with 24-48hr delivery worldwide.', 'Move urgent cargo with document readiness, customs support and airport release planning through JKIA Nairobi and Moi International Airport Mombasa.'],
  ['overland-transport', 'Overland Transport from Mombasa | East Africa Road Freight', 'Overland transport from Mombasa and Nairobi to Uganda, Rwanda, Burundi, DRC, South Sudan and Tanzania via regional corridors.', '/images/overland-transport-hero-1200.jpg', 'Overland Transport', 'Overland transport from Mombasa and Nairobi for regional cargo delivery across East Africa.', 'Plan cargo movement from Mombasa and Nairobi into Uganda, Rwanda, Burundi, DRC, South Sudan and Tanzania.'],
  ['warehousing', 'Warehousing in Mombasa & Nairobi | Cargo Storage | Kenya Tradex', 'Warehousing in Mombasa and Nairobi for cargo storage, inventory handling, cross-docking, pick and pack and onward distribution.', '/images/warehousing-hero.jpg', 'Warehousing', 'Warehousing in Mombasa and Nairobi for bonded storage, cargo handling and distribution support.', 'Coordinate storage, staging, pick-and-pack, cross-docking and distribution for cargo moving through Kenya.'],
  ['project-logistics', 'Project Logistics East Africa | Heavy Lift & Oversized Cargo', 'Project logistics in East Africa for heavy lift cargo, oversized machinery, mining equipment and complex site deliveries via Mombasa.', '/images/project-logistics-hero.jpg', 'Project Logistics', 'Project logistics in East Africa for heavy lift cargo, oversized equipment and complex site deliveries.', 'Support for project cargo, abnormal loads, permits, route planning and delivery coordination.'],
  ['vehicle-import-to-kenya', 'Vehicle & Car Import to Kenya | Used Car Shipping | Kenya Tradex', 'Vehicle and car import to Kenya from Japan, UAE, UK and South Africa with shipping, customs clearance and registration support.', '/images/vehicle-import-hero-1200.jpg', 'Vehicle Import to Kenya', 'Vehicle and car import to Kenya with shipping, customs clearance and registration support.', 'Plan car imports with document checks, duty estimates, customs clearance and delivery coordination.'],
  ['cross-border-consulting', 'Cross-Border Trade Consulting | EAC & AfCFTA Trade Advisory | Kenya Tradex', 'Cross-border trade consulting for East Africa, including EAC rules, AfCFTA planning, tariff classification and export documents.', '/images/cross-border-hero.jpg', 'Cross-Border Trade', 'Cross-Border Trade Consulting for East Africa & African Continental Free Trade Area', 'Get guidance on documentation, market entry, compliance, transit and cross-border trade planning.'],
  ['customs-consultancy', 'Customs Consultancy Kenya | Duty & Compliance Advisory | Kenya Tradex', 'Customs consultancy in Kenya for KRA compliance, tariff classification, duty planning, rules of origin and post-clearance support.', '/images/customs-hero.jpg', 'Customs Consultancy', 'Customs consultancy in Kenya for tariff classification, duty planning and KRA compliance.', 'Clarify HS codes, duty exposure, documents, agency requirements and compliance risks before cargo moves.'],
  ['mombasa-customs-clearance', 'Mombasa Customs Clearance Agent | Port Clearance Services | Kenya Tradex', 'Mombasa customs clearance support for import, export and transit cargo at the Port of Mombasa with document review and cargo release planning.', '/images/clearing-forwarding-hero-1200.jpg', 'Mombasa Customs Clearance', 'Mombasa customs clearance for import, export and transit cargo.', 'Prepare documents, coordinate agency requirements and plan cargo release through Mombasa.'],
  ['nairobi-icd-customs-clearance', 'Nairobi ICD Customs Clearance | Inland Container Depot Support', 'Nairobi ICD customs clearance support for container cargo, document review, inspection coordination, cargo release and delivery planning.', '/images/clearing-forwarding-hero-1200.jpg', 'Nairobi ICD Clearance', 'Nairobi ICD customs clearance for container cargo moving inland.', 'Coordinate ICD documentation, KRA requirements and delivery planning for Nairobi-bound cargo.'],
  ['jkia-air-cargo-clearance', 'JKIA Air Cargo Clearance | Nairobi Air Freight Customs | Kenya Tradex', 'JKIA air cargo clearance support in Nairobi for urgent imports, courier cargo, perishables, pharma, spare parts and customs release.', '/images/air-freight-hero.jpg', 'JKIA Air Cargo Clearance', 'JKIA air cargo clearance for urgent imports into Kenya.', 'Support for courier cargo, spare parts, perishables, pharma, samples and urgent imports through Nairobi.'],
  ['transit-cargo-uganda-rwanda-drc-south-sudan', 'Mombasa to Juba & Kigali Road Freight | Transit Cargo', 'Mombasa to Juba, Kigali, Kampala, DRC and South Sudan road freight with transit cargo, bond, customs and corridor planning from Kenya.', '/images/overland-transport-hero-1200.jpg', 'Transit Cargo', 'Transit cargo and road freight from Mombasa to Juba, Kigali, Kampala, DRC and South Sudan.', 'Move cargo through Kenya into landlocked markets with destination-aware documents and border coordination.'],
  ['jebel-ali-to-mombasa-transit-time', 'Jebel Ali to Mombasa Sea Transit Time Days | Kenya Tradex', 'Jebel Ali to Mombasa sea transit time days for UAE freight, including vessel timing, customs clearance and inland delivery planning.', '/images/dubai-shipping-hero.jpg', 'Jebel Ali to Mombasa', 'Jebel Ali to Mombasa sea transit time days and what affects total delivery.', 'Understand sailing windows, LCL vs FCL timing and post-arrival clearance considerations.'],
  ['shipping-cost-from-china-to-kenya-1-cbm', '1 CBM Shipping Cost China to Kenya | LCL Rates Guide', 'Estimate 1 CBM shipping cost from China to Kenya and compare LCL charges, transit time, customs clearance and landed cost factors.', '/images/china-shipping-hero-1200.jpg', '1 CBM China Shipping', 'Estimate 1 CBM shipping cost from China to Kenya and understand what really drives the landed price.', 'Compare LCL, air freight, volume weight and customs cost considerations for small shipments.'],
  ['import-car-from-south-africa-to-kenya', 'Import Car from South Africa to Kenya | Duty & Shipping Guide', 'Import a car from South Africa to Kenya with RoRo or container shipping, Mombasa customs clearance and delivery planning.', '/images/vehicle-import-hero-1200.jpg', 'South Africa Vehicle Import', 'Import a car from South Africa to Kenya with faster routing and end-to-end clearance support.', 'Plan vehicle documents, shipping, duty exposure, age rules and clearance in Kenya.'],
  ['customs-bonded-warehouse-kenya', 'Bonded Warehouses in Nairobi & Mombasa | Kenya Tradex', 'Bonded warehouse support in Nairobi and Mombasa for customs-controlled storage, duty-deferred handling and phased cargo release.', '/images/warehousing-hero.jpg', 'Bonded Warehouse Kenya', 'Customs bonded warehouse support in Kenya for importers who need bonded storage before final release.', 'Coordinate bonded storage, phased release and cargo handling in Mombasa or Nairobi.']
]

const simplePages: ServicePage[] = simplePageRows.map(([slug, title, description, heroImage, eyebrow, heading, lead]) => ({
  slug,
  title,
  description,
  canonical: `https://kenyatradex.africa/${slug}.html`,
  heroImage,
  eyebrow,
  heading,
  lead,
  sections: [
    { title: 'What Kenya Tradex supports', body: lead, items: legacyTopics[slug] || ['Document review and cargo readiness checks.', 'Freight, customs or storage coordination where applicable.', 'Direct WhatsApp and quote-form communication.', 'Regional delivery and transit planning where needed.'] },
    { title: 'How the process works', steps: ['Share cargo, route and timing details.', 'Kenya Tradex reviews the file and likely requirements.', 'The team coordinates the relevant freight, clearance or delivery steps.', 'You receive updates through direct contact channels.'] }
  ],
  form: { id: `${slug}-form`, pageName: `${eyebrow} Inquiry`, title: `Request ${eyebrow.toLowerCase()} support`, intro: 'Share your cargo details and Kenya Tradex will respond with the next practical steps.', submitLabel: 'Send quote request', successMessage: 'Request received. Kenya Tradex will respond shortly.', fields: [...baseFields, cargoMessage] }
}))

export const allServicePages: ServicePage[] = [...servicePages, ...simplePages]

export function getServicePage(slug?: string) {
  return allServicePages.find((page) => page.slug === slug)
}
