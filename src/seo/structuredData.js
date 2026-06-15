import {
  brandName,
  canonicalForPath,
  defaultDomain,
  supportEmail,
  supportPhone,
  toAbsoluteUrl,
  ukDomain,
} from './seoConfig.js'

const sameAs = [
  'https://www.elurajewels.com/',
  'https://www.elurajewels.co.uk/',
]

export const organizationSchema = (path = '/') => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${defaultDomain}/#organization`,
  name: brandName,
  url: canonicalForPath('/', defaultDomain),
  logo: canonicalForPath('/favicon-elura.svg', defaultDomain),
  email: supportEmail,
  telephone: supportPhone,
  sameAs,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: supportPhone,
      email: supportEmail,
      areaServed: 'GB',
      availableLanguage: ['English'],
    },
  ],
  mainEntityOfPage: canonicalForPath(path),
})

export const jewelryStoreSchema = (path = '/') => ({
  '@context': 'https://schema.org',
  '@type': ['JewelryStore', 'LocalBusiness'],
  '@id': `${ukDomain}/#jewelry-store`,
  name: brandName,
  url: canonicalForPath(path, ukDomain),
  image: canonicalForPath('/favicon-elura.svg', ukDomain),
  telephone: supportPhone,
  email: supportEmail,
  priceRange: 'GBP 100-400',
  currenciesAccepted: 'GBP',
  paymentAccepted: 'Card, Shopify Payments',
  areaServed: [
    {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    {
      '@type': 'City',
      name: 'London',
    },
    {
      '@type': 'City',
      name: 'Manchester',
    },
    {
      '@type': 'City',
      name: 'Birmingham',
    },
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'West London',
    addressCountry: 'GB',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 51.5072,
    longitude: -0.1276,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
      ],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  sameAs,
})

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${defaultDomain}/#website`,
  name: brandName,
  url: canonicalForPath('/', defaultDomain),
  publisher: {
    '@id': `${defaultDomain}/#organization`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${defaultDomain}/shop?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
})

export const breadcrumbSchema = (items = []) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: canonicalForPath(item.path),
  })),
})

export const faqSchema = (items = []) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
})

export const productSchema = (product) => {
  const url = canonicalForPath(`/product/${product.slug}`)
  const sku =
    product.sku ||
    `ELURA-${String(product.id).replace(/[^a-z0-9-]/gi, '').toUpperCase()}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    sku,
    mpn: sku,
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    category: `Luxury ${product.category}`,
    description: product.description,
    image: product.images.map((image) => toAbsoluteUrl(image)).filter(Boolean),
    material: product.materials?.join(', '),
    url,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: product.currencyCode || 'GBP',
      price: product.price,
      availability: product.availableForSale === false
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@id': `${defaultDomain}/#organization`,
      },
      areaServed: 'GB',
    },
  }
}

export const collectionSchema = (name, description, products = []) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name,
  description,
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: canonicalForPath(`/product/${product.slug}`),
      name: product.name,
    })),
  },
})
