export const brandName = 'ELURA Jewels'
export const defaultDomain = 'https://www.elurajewels.com'
export const ukDomain = 'https://www.elurajewels.co.uk'
export const supportEmail = 'info.elurajewels@gmail.com'
export const supportPhone = '+44 7440 482483'

export const seoKeywords = [
  'luxury jewellery uk',
  'luxury jewellery london',
  'premium jewellery uk',
  'gold jewellery london',
  'bridal jewellery uk',
  'engagement rings uk',
  'luxury necklaces uk',
  'designer jewellery uk',
  'premium earrings london',
  'handcrafted jewellery uk',
  'luxury accessories',
  'wedding jewellery',
  'diamond jewellery',
  'fine jewellery',
  'artisan jewellery',
  'elegant jewellery collections',
]

export const defaultSeo = {
  title: 'Luxury Jewellery UK | Designer Gold Jewellery London',
  description:
    'Shop ELURA Jewels for luxury jewellery in the UK, including refined gold jewellery, bridal jewellery, premium earrings, necklaces, rings, bangles, and elegant handcrafted collections.',
  keywords: seoKeywords,
  image: '/og-elura-jewels.jpg',
  type: 'website',
}

export const verificationMeta = {
  google: import.meta.env.VITE_GOOGLE_SITE_VERIFICATION,
  bing: import.meta.env.VITE_BING_SITE_VERIFICATION,
  pinterest: import.meta.env.VITE_PINTEREST_SITE_VERIFICATION,
  facebook: import.meta.env.VITE_FACEBOOK_DOMAIN_VERIFICATION,
}

export const markets = {
  default: {
    lang: 'en',
    hrefLang: 'x-default',
    origin: defaultDomain,
  },
  uk: {
    lang: 'en-GB',
    hrefLang: 'en-GB',
    origin: ukDomain,
  },
}

export const getCurrentOrigin = () => {
  if (typeof window === 'undefined') {
    return import.meta.env.VITE_PUBLIC_SITE_URL || defaultDomain
  }

  const hostname = window.location.hostname

  if (hostname.includes('elurajewels.co.uk')) {
    return ukDomain
  }

  if (hostname.includes('elurajewels.com')) {
    return defaultDomain
  }

  return import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin
}

export const cleanPath = (path = '/') => {
  const [pathname] = path.split('#')
  const normalizedPath = pathname || '/'

  if (normalizedPath === '/') {
    return '/'
  }

  return normalizedPath.endsWith('/')
    ? normalizedPath.slice(0, -1)
    : normalizedPath
}

export const toAbsoluteUrl = (value, origin = getCurrentOrigin()) => {
  if (!value) {
    return undefined
  }

  try {
    return new URL(value, origin).toString()
  } catch {
    return `${origin}${value.startsWith('/') ? value : `/${value}`}`
  }
}

export const canonicalForPath = (path = '/', origin = getCurrentOrigin()) =>
  toAbsoluteUrl(cleanPath(path), origin)

export const alternateLinksForPath = (path = '/') => {
  const clean = cleanPath(path)

  return [
    {
      hrefLang: markets.uk.hrefLang,
      href: canonicalForPath(clean, ukDomain),
    },
    {
      hrefLang: markets.default.hrefLang,
      href: canonicalForPath(clean, defaultDomain),
    },
  ]
}

export const pageSeo = {
  home: {
    title: 'Luxury Jewellery UK | ELURA Jewels London',
    description:
      'Discover ELURA Jewels, a UK luxury jewellery house for premium gold jewellery, bridal pieces, designer necklaces, earrings, rings, bangles, and handcrafted elegance.',
    keywords: [
      'luxury jewellery uk',
      'luxury jewellery london',
      'designer jewellery uk',
      'premium jewellery uk',
      'gold jewellery london',
      'bridal jewellery uk',
    ],
  },
  shop: {
    title: 'Shop Luxury Jewellery UK | Gold Rings, Necklaces & Earrings',
    description:
      'Shop premium jewellery in the UK from ELURA Jewels, including luxury necklaces, gold rings, premium earrings, bracelets, bangles, and bridal jewellery for elegant occasions.',
    keywords: [
      'shop luxury jewellery uk',
      'premium jewellery uk',
      'gold jewellery london',
      'luxury necklaces uk',
      'premium earrings london',
      'bridal jewellery uk',
    ],
  },
  collections: {
    title: 'Luxury Jewellery Collections UK | Bridal, Gold & Designer Pieces',
    description:
      'Explore ELURA jewellery collections curated for UK luxury shoppers, from bridal jewellery and designer gold necklaces to premium earrings, rings, bangles, and bracelets.',
    keywords: [
      'luxury jewellery collections uk',
      'bridal jewellery uk',
      'designer jewellery uk',
      'handcrafted jewellery uk',
      'elegant jewellery collections',
    ],
  },
  about: {
    title: 'About ELURA Jewels | UK Luxury Jewellery Brand',
    description:
      'Learn about ELURA Jewels, a modern UK luxury jewellery brand focused on refined design, premium finishes, gifting, bridal moments, and elegant everyday jewellery.',
    keywords: [
      'uk luxury jewellery brand',
      'luxury jewellery london',
      'fine jewellery uk',
      'artisan jewellery',
      'handcrafted jewellery uk',
    ],
  },
  contact: {
    title: 'Contact ELURA Jewels | Luxury Jewellery London Support',
    description:
      'Contact ELURA Jewels in West London for luxury jewellery support, product guidance, delivery questions, returns, gifting advice, and UK customer care.',
    keywords: [
      'luxury jewellery london contact',
      'gold jewellery london',
      'premium jewellery uk support',
      'designer jewellery uk',
    ],
  },
  faq: {
    title: 'Luxury Jewellery FAQs UK | Delivery, Returns & Jewellery Care',
    description:
      'Find answers about ELURA Jewels UK delivery, returns, gifting, jewellery care, bridal styling, premium finishes, and caring for luxury gold jewellery.',
    keywords: [
      'luxury jewellery uk faq',
      'jewellery care uk',
      'bridal jewellery uk',
      'gold jewellery london',
    ],
  },
  privacy: {
    title: 'Privacy Policy | ELURA Jewels UK',
    description:
      'Read the ELURA Jewels privacy policy for UK customers, including how we protect personal data, order details, account information, and secure checkout data.',
  },
  terms: {
    title: 'Terms and Conditions | ELURA Jewels UK',
    description:
      'Review the ELURA Jewels terms and conditions for UK luxury jewellery orders, pricing, delivery, returns, secure payments, and customer responsibilities.',
  },
  refunds: {
    title: 'Refund Policy | ELURA Jewels UK',
    description:
      'Read the ELURA Jewels UK refund policy for luxury jewellery purchases, including eligibility, timeframes, return conditions, exchanges, and support details.',
  },
  shipping: {
    title: 'Shipping and Returns | ELURA Jewels UK',
    description:
      'Review ELURA Jewels shipping and returns for UK luxury jewellery orders, delivery times, tracking, return requests, damaged items, and customer support.',
  },
  wishlist: {
    title: 'Wishlist | Saved Luxury Jewellery | ELURA Jewels',
    description:
      'View saved ELURA Jewels pieces, including luxury necklaces, premium earrings, rings, bangles, bracelets, and bridal jewellery favourites.',
    robots: 'noindex,follow',
  },
  profile: {
    title: 'Account Profile | ELURA Jewels',
    description:
      'Manage your ELURA Jewels account, saved luxury jewellery, order history, and customer details.',
    robots: 'noindex,nofollow',
  },
  checkout: {
    title: 'Secure Checkout | ELURA Jewels',
    description:
      'Complete your ELURA Jewels order securely for luxury jewellery delivery in the UK.',
    robots: 'noindex,nofollow',
  },
  login: {
    title: 'Login | ELURA Jewels Account',
    description:
      'Login to your ELURA Jewels account to manage orders, saved luxury jewellery, and profile details.',
    robots: 'noindex,nofollow',
  },
  signup: {
    title: 'Create Account | ELURA Jewels',
    description:
      'Create an ELURA Jewels account to save luxury jewellery favourites, manage orders, and access customer support.',
    robots: 'noindex,nofollow',
  },
  notFound: {
    title: 'Page Not Found | ELURA Jewels',
    description:
      'The page you are looking for is not available. Continue shopping luxury jewellery at ELURA Jewels.',
    robots: 'noindex,follow',
  },
}
