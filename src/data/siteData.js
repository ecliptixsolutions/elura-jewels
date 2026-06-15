import bannerRockRing from '../assets/photos/banner-rock-ring.jpg'
import braceletOne from '../assets/photos/bracelet-1.jpg'
import braceletTwo from '../assets/photos/bracelet-2.jpg'
import braceletDisplay from '../assets/photos/bracelet-display.jpg'
import categoryDisplay from '../assets/photos/category-display.jpg'
import chokerSet from '../assets/photos/choker.jpeg'
import chokerAngle from '../assets/photos/choker-angle.jpeg'
import chokerClose from '../assets/photos/choker-close.jpeg'
import earringsOne from '../assets/photos/earrings-1.jpg'
import earringsTwo from '../assets/photos/earrings-2.jpg'
import emeraldSet from '../assets/photos/emerald.jpeg'
import heroLuxuryBangles from '../assets/optimized/hero-luxury-bangles-v2.webp'
import heroLuxuryEarrings from '../assets/optimized/hero-luxury-earrings-v2.webp'
import heroLuxuryNecklace from '../assets/optimized/hero-luxury-necklace-v2.webp'
import heroLuxuryRings from '../assets/optimized/hero-luxury-rings-v2.webp'
import heroModel from '../assets/photos/hero-model.jpg'
import heroNecklace from '../assets/photos/hero-necklace.jpg'
import heroPearl from '../assets/photos/hero-pearl.jpg'
import heroStudio from '../assets/photos/hero-studio.jpg'
import necklaceOne from '../assets/photos/necklace-1.jpg'
import necklaceTwo from '../assets/photos/necklace-2.jpg'
import ringOne from '../assets/photos/ring-1.jpg'
import ringTwo from '../assets/photos/ring-2.jpg'
import rubySet from '../assets/photos/ruby.jpeg'


export const formatCurrency = (price) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(price)

export const navigationItems = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
]

export const heroSlides = [
  {
    id: 'slide-1',
    label: 'ELURA Collection',
    image: heroLuxuryNecklace,
    mobileObjectPosition: '72% center',
    desktopObjectPosition: 'center center',
    heading: 'Modern & Contemporary Jewellery',
    subtext: 'Crafted with precision and softened by a quieter, luxury finish.',
    ctaLabel: 'Shop Collection',
    ctaHref: '/shop',
  },
  {
    id: 'slide-2',
    label: 'Bridal Collection',
    image: heroLuxuryRings,
    mobileObjectPosition: '66% center',
    desktopObjectPosition: 'center center',
    heading: 'Bridal pieces with polished, enduring detail',
    subtext: 'Signature rings and luminous settings designed for modern ceremonies and lasting wear.',
    ctaLabel: 'Explore Bridal Styles',
    ctaHref: '/collections',
  },
  {
    id: 'slide-3',
    label: 'Everyday Luxury',
    image: heroLuxuryEarrings,
    mobileObjectPosition: '62% center',
    desktopObjectPosition: 'center center',
    heading: 'Everyday Luxury',
    subtext: 'Fine earrings and pendants made to move easily from weekday dressing into evening occasions.',
    ctaLabel: 'View Earrings',
    ctaHref: '/shop?category=Earrings',
  },
  {
    id: 'slide-4',
    label: 'Signature Pieces',
    image: heroLuxuryBangles,
    mobileObjectPosition: '58% center',
    desktopObjectPosition: 'center center',
    heading: 'Signature bangles with clean, sculptural shine',
    subtext: 'Contemporary gold forms with refined emerald accents and an editorial sense of restraint.',
    ctaLabel: 'Shop Bangles',
    ctaHref: '/shop?category=Bangles',
  },
]

export const collectionCards = [
  {
    title: 'Necklace & Sets',
    subtitle: 'Statement silhouettes and layered gold finishes.',
    category: 'Necklaces',
    href: '/shop?category=Necklaces',
    image: categoryDisplay,
    featured: true,
  },
  {
    title: 'Earrings',
    subtitle: 'Polished pairs for subtle sparkle and occasion dressing.',
    category: 'Earrings',
    href: '/shop?category=Earrings',
    image: earringsOne,
  },
  {
    title: 'Rings',
    subtitle: 'Clean settings with luminous stones and sculptural bands.',
    category: 'Rings',
    href: '/shop?category=Rings',
    image: ringTwo,
  },
  {
    title: 'Bangles',
    subtitle: 'Sculptural gold forms finished with a clean, modern shine.',
    category: 'Bangles',
    href: '/shop?category=Bangles',
    image: braceletDisplay,
  },
  {
    title: 'Bracelets',
    subtitle: 'Refined chain silhouettes designed for light layering and daily wear.',
    category: 'Bracelets',
    href: '/shop?category=Bracelets',
    image: braceletOne,
  },
]

export const productFilters = ['All', 'Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Bangles']

export const products = [
  {
    id: 9,
    slug: 'emerald-necklace-set',
    name: 'Emerald Necklace Set',
    category: 'Necklaces',
    price: 145,
    description:
      'A polished emerald-toned necklace set designed to bring a richer ceremonial finish to evening dressing and occasion wear.',
    materials: [
      'Gold-tone alloy setting',
      'Emerald-toned stonework',
      'Matching earrings included',
    ],
    details: [
      'Presented as a coordinated jewellery set',
      'Designed for wedding events and festive styling',
      'Store in a dry pouch after wear',
    ],
    images: [emeraldSet, emeraldSet, emeraldSet],
    reviews: [
      {
        name: 'Sana R.',
        rating: 5,
        date: '14 Apr 2026',
        content: 'The emerald colour is striking and the set feels beautifully balanced in person.',
      },
    ],
  },
  {
    id: 10,
    slug: 'royal-ruby-bridal-set',
    name: 'Royal Ruby Bridal Set',
    category: 'Necklaces',
    price: 225,
    description:
      'A bridal jewellery set with ruby-toned stones and warm gold detailing, created for statement ceremonial styling.',
    materials: [
      'Gold-tone bridal setting',
      'Ruby-toned crystal stones',
      'Matching drop earrings included',
    ],
    details: [
      'Crafted for bridal and reception looks',
      'Structured profile with rich colour depth',
      'Keep away from fragrance and moisture',
    ],
    images: [rubySet, rubySet, rubySet],
    reviews: [
      {
        name: 'Priya M.',
        rating: 5,
        date: '09 Apr 2026',
        content: 'A beautiful bridal set with a strong ruby tone and a very polished finish.',
      },
    ],
  },
  {
    id: 11,
    slug: 'heritage-choker-set',
    name: 'Heritage Choker Set',
    category: 'Necklaces',
    price: 179,
    description:
      'A heritage-inspired choker set with a close neckline fit, designed for richer traditional styling with a premium finish.',
    materials: [
      'Gold-tone choker structure',
      'Statement stone detailing',
      'Matching earrings included',
    ],
    details: [
      'Sits neatly at the neckline for occasion wear',
      'Ideal for bridal, festive, and formal styling',
      'Wipe clean with a soft cloth after use',
    ],
    images: [
  chokerSet,
  chokerAngle,
  chokerClose,
],
    reviews: [
      {
        name: 'Aisha K.',
        rating: 4,
        date: '17 Apr 2026',
        content: 'The choker shape looks elegant on and the detailing gives it a more heritage feel.',
      },
    ],
  },
  {
    id: 1,
    slug: 'aurelia-emerald-collar',
    name: 'Aurelia Emerald Collar',
    category: 'Necklaces',
    price: 329,
    description:
      'A structured collar necklace with a clean drape, warm gold tone, and emerald focal detail designed for day-to-evening wear.',
    materials: [
      '18ct gold-plated sterling silver',
      'Emerald-toned crystal centre',
      'High-shine anti-tarnish finish',
    ],
    details: [
      'Adjustable chain with secure clasp fastening',
      'Presented in an ELURA gift box',
      'Suitable for occasion dressing and elevated everyday styling',
    ],
    images: [necklaceOne, necklaceTwo, heroNecklace],
    reviews: [
      {
        name: 'Charlotte M.',
        rating: 5,
        date: '12 Feb 2026',
        content: 'Elegant without feeling overdone. The finish is beautiful and it sits perfectly at the collarbone.',
      },
      {
        name: 'Isla R.',
        rating: 5,
        date: '29 Jan 2026',
        content: 'Bought for a black-tie dinner and now wear it with knitwear as well. It feels genuinely versatile.',
      },
    ],
  },
  {
    id: 2,
    slug: 'seraphine-drop-earrings',
    name: 'Seraphine Drop Earrings',
    category: 'Earrings',
    price: 265,
    description:
      'Refined drop earrings with a polished gold frame and emerald-led sparkle, balancing softness with a statement silhouette.',
    materials: [
      'Gold-plated sterling silver',
      'Emerald and clear crystal detailing',
      'Lightweight post fastening',
    ],
    details: [
      'Comfortable for extended wear',
      'Designed to frame the face without feeling heavy',
      'Wipe clean with a soft jewellery cloth',
    ],
    images: [earringsOne, earringsTwo, heroPearl],
    reviews: [
      {
        name: 'Ava H.',
        rating: 5,
        date: '03 Mar 2026',
        content: 'The tone of the gold is gorgeous and the emerald detail makes them feel more expensive than the price.',
      },
      {
        name: 'Nadia P.',
        rating: 4,
        date: '17 Jan 2026',
        content: 'Beautiful pair, especially for evenings. Nicely balanced and easy to style.',
      },
    ],
  },
  {
    id: 3,
    slug: 'oria-solitaire-ring',
    name: 'Oria Solitaire Ring',
    category: 'Rings',
    price: 349,
    description:
      'A minimal solitaire ring finished with a crisp stone setting and softly rounded band for a timeless, polished look.',
    materials: [
      'Gold-plated sterling silver band',
      'Clear central stone',
      'Mirror-polish finish',
    ],
    details: [
      'Available in standard UK ring sizes',
      'Designed for stacking or standalone wear',
      'Delivered in protective presentation packaging',
    ],
    images: [ringOne, ringTwo, bannerRockRing],
    reviews: [
      {
        name: 'Sophie L.',
        rating: 5,
        date: '21 Feb 2026',
        content: 'A lovely clean design. It looks premium and works beautifully with my existing rings.',
      },
      {
        name: 'Eleanor W.',
        rating: 5,
        date: '08 Feb 2026',
        content: 'Exactly the elegant, understated style I was looking for.',
      },
    ],
  },
  {
    id: 4,
    slug: 'velora-sculpted-bangle',
    name: 'Velora Sculpted Bangle',
    category: 'Bangles',
    price: 289,
    description:
      'A sculpted gold bangle with clean lines and a subtle luxury finish, designed to feel modern, polished, and easy to wear.',
    materials: [
      '18ct gold-plated metal',
      'Sculpted cuff profile',
      'High-polish surface finish',
    ],
    details: [
      'Sits comfortably for everyday styling',
      'Pairs well with slimmer bracelets and layered rings',
      'Keep dry and store in the original pouch',
    ],
    images: [braceletOne, braceletTwo, braceletDisplay],
    reviews: [
      {
        name: 'Freya D.',
        rating: 5,
        date: '11 Mar 2026',
        content: 'Minimal, wearable and beautifully made. I love how clean the shape feels.',
      },
      {
        name: 'Maya K.',
        rating: 4,
        date: '26 Jan 2026',
        content: "Easy to style and doesn't overpower other pieces. A really useful bracelet.",
      },
    ],
  },
  {
    id: 5,
    slug: 'celestine-pendant-necklace',
    name: 'Celestine Pendant Necklace',
    category: 'Necklaces',
    price: 219,
    description:
      'A pendant-led necklace with a clean profile and rich gold finish, designed to bring a softer statement to daily dressing.',
    materials: [
      'Gold-plated sterling silver chain',
      'Polished pendant setting',
      'Adjustable fastening',
    ],
    details: [
      'Layers neatly with shorter chains',
      'Designed for gifting and everyday wear',
      'Packaged in ELURA signature boxing',
    ],
    images: [necklaceTwo, necklaceOne, heroModel],
    reviews: [
      {
        name: 'Georgia T.',
        rating: 5,
        date: '15 Feb 2026',
        content: "Simple, elegant and far more polished in person. I've worn it nearly every day.",
      },
    ],
  },
  {
    id: 6,
    slug: 'liora-emerald-studs',
    name: 'Liora Emerald Studs',
    category: 'Earrings',
    price: 189,
    description:
      'Compact studs with emerald sparkle and a refined gold frame, ideal for a clean everyday jewellery wardrobe.',
    materials: [
      'Gold-plated sterling silver',
      'Emerald-toned stone setting',
      'Butterfly back fastening',
    ],
    details: [
      'Small and easy to style',
      'Elegant enough for gifting',
      'Protect from fragrance and moisture',
    ],
    images: [earringsTwo, earringsOne, heroStudio],
    reviews: [
      {
        name: 'Lucy N.',
        rating: 5,
        date: '19 Mar 2026',
        content: 'The size is perfect and the colour is lovely. They feel elevated without being flashy.',
      },
    ],
  },
  {
    id: 7,
    slug: 'noemi-diamond-ring',
    name: 'Noemi Diamond Ring',
    category: 'Rings',
    price: 379,
    description:
      'A polished gold ring finished with a bright stone setting, offering a refined and modern take on occasion jewellery.',
    materials: [
      'Gold-plated sterling silver',
      'Brilliant-cut clear stone',
      'Smooth interior band',
    ],
    details: [
      'Comfort-fit interior',
      'Suitable for gifting and formal dressing',
      'Store flat to protect the finish',
    ],
    images: [ringTwo, bannerRockRing, ringOne],
    reviews: [
      {
        name: 'Emily C.',
        rating: 5,
        date: '07 Mar 2026',
        content: 'The ring feels very premium and the presentation was excellent. Beautiful everyday statement piece.',
      },
    ],
  },
  {
    id: 8,
    slug: 'amaris-chain-bracelet',
    name: 'Amaris Chain Bracelet',
    category: 'Bracelets',
    price: 225,
    description:
      'A fine chain bracelet with polished detailing and a warm gold finish designed to stack cleanly or wear alone.',
    materials: [
      '18ct gold-plated chain',
      'Secure lobster clasp',
      'Fine-link construction',
    ],
    details: [
      'Lightweight and easy for daily wear',
      'Elegant paired with a cuff or watch',
      'Presented in a signature ELURA pouch',
    ],
    images: [braceletDisplay, braceletOne, braceletTwo],
    reviews: [
      {
        name: 'Amelia S.',
        rating: 4,
        date: '28 Feb 2026',
        content: 'Lovely bracelet with a delicate finish. A really good layering piece.',
      },
    ],
  },
]

export const homeFeaturedProducts = [
  products[0],
  products[1],
  products[2],
  products[8],
]

export const brandStory = {
  image: categoryDisplay,
  eyebrow: 'About ELURA',
  title: 'A considered jewellery house for modern wardrobes',
  body: [
    'ELURA creates clean, elevated pieces that feel timeless rather than trend-led. Each design is chosen to move comfortably between everyday dressing, event styling, and gifting moments.',
    'The collection focuses on balanced proportions, luminous finishes, and versatile forms that hold their own without feeling overstated.',
  ],
  features: [
    'Designed for elegant day-to-evening wear',
    'Premium finishes and gift-ready presentation',
    'Focused edits across necklaces, rings, earrings, bangles, and bracelets',
  ],
  buttonText: 'Learn More',
  buttonLink: '/about',
}

export const testimonials = [
  {
    id: 1,
    quote:
      'The quality feels premium and the styling is very polished. It has that clean luxury feel I was hoping for.',
    name: 'Olivia B.',
    title: 'London',
  },
  {
    id: 2,
    quote:
      'Beautiful packaging, elegant finish, and a really easy online experience. Everything felt considered.',
    name: 'Hannah W.',
    title: 'Manchester',
  },
  {
    id: 3,
    quote:
      'The jewellery looks refined rather than overly trend-led, which is exactly why I keep coming back.',
    name: 'Isobel T.',
    title: 'Edinburgh',
  },
]

export const promoBanners = [
  {
    id: 'promo-1',
    label: 'Signature Edit',
    image: bannerRockRing,
    heading: 'Discover Timeless Pieces',
    subtext: 'Crafted for modern elegance and everyday luxury',
    ctaLabel: 'Shop Now',
    ctaHref: '/shop',
  },
  {
    id: 'promo-2',
    label: 'Bridal Selection',
    image: heroPearl,
    heading: 'Jewellery for bridal moments and evening dressing',
    subtext: 'Refined silhouettes with luminous detail and an elevated finish.',
    ctaLabel: 'Explore Collection',
    ctaHref: '/collections',
  },
  {
    id: 'promo-3',
    label: 'Everyday Luxury',
    image: braceletDisplay,
    heading: 'Pieces to wear often and keep close',
    subtext: 'A clean, versatile edit of bangles, rings, earrings, and necklaces.',
    ctaLabel: 'Shop Bangles',
    ctaHref: '/shop?category=Bangles',
  },
]

export const aboutPageContent = {
  intro:
    'ELURA is a modern jewellery brand focused on refined design, balanced detailing, and pieces that feel luxurious without excess.',
  blocks: [
    {
      title: 'Our Story',
      text: 'We believe luxury jewellery should feel effortless to wear and easy to return to. ELURA is shaped around a curated wardrobe of enduring pieces rather than seasonal noise.',
      image: heroPearl,
    },
    {
      title: 'Craftsmanship',
      text: 'Every design is selected for clean proportion, polished finish, and visual clarity. The result is jewellery that feels elevated and quietly confident.',
      image: necklaceOne,
    },
    {
      title: 'Sustainability',
      text: 'We favour considered collections, versatile design, and presentation that encourages longevity over disposability.',
      image: braceletOne,
    },
  ],
}

export const faqItems = [
  {
    question: 'Do you ship across the UK?',
    answer: 'Yes. ELURA offers UK-wide delivery with tracked shipping options shown at checkout.',
  },
  {
    question: 'Can I return an item if it is not right?',
    answer: 'Yes. Eligible items can be returned within the stated return window, provided they are unworn and in original packaging.',
  },
  {
    question: 'Are ELURA pieces suitable for gifting?',
    answer: 'Every order is presented in ELURA packaging, making the collection well suited to gifting.',
  },
  {
    question: 'How should I care for my jewellery?',
    answer: 'Store pieces dry, avoid direct contact with perfume and lotions, and clean gently with a soft jewellery cloth.',
  },
]

export const footerGroups = {
  SHOP: [
    { label: 'Necklaces', href: '/shop?category=Necklaces' },
    { label: 'Earrings', href: '/shop?category=Earrings' },
    { label: 'Rings', href: '/shop?category=Rings' },
    { label: 'Bracelets', href: '/shop?category=Bracelets' },
    { label: 'Bangles', href: '/shop?category=Bangles' },
  ],
  ABOUT: [{ label: 'About', href: '/about' }],
  'CUSTOMER CARE': [
    { label: 'Shipping & Returns', href: '/faq' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
  ],
}

export const contactDetails = {
  email: 'info.elurajewels@gmail.com',
  phone: '+44 7440482483',
  location: 'West London, UK',
}
