import braceletDisplay from '../assets/photos/bracelet-display.jpg'
import categoryDisplay from '../assets/photos/category-display.jpg'
import earringsOne from '../assets/photos/earrings-1.jpg'
import emeraldSet from '../assets/photos/emerald.jpeg'
import heroStudio from '../assets/photos/hero-studio.jpg'
import necklaceOne from '../assets/photos/necklace-1.jpg'
import ringOne from '../assets/photos/ring-1.jpg'

const imageFields = {
  image: '',
  alt: '',
  caption: '',
  overlayText: '',
  badge: '',
  sortOrder: 0,
  visibility: true,
}

const cardFields = {
  title: '',
  description: '',
  icon: '',
  image: '',
  link: '',
  visibility: true,
  sortOrder: 0,
}

const sectionFields = {
  heading: '',
  subheading: '',
  description: '',
  background: '',
  visibility: true,
  order: 0,
}

const createImage = (values = {}) => ({
  ...imageFields,
  ...values,
})

const createCard = (values = {}) => ({
  ...cardFields,
  ...values,
})

const createSection = (values = {}) => ({
  ...sectionFields,
  images: [],
  cards: [],
  ...values,
})

const defaultLocationDigitalTwin = {
  header: createSection({
    heading: 'ELURA London Location Guide',
    subheading: 'Digital Twin CMS',
    description: 'A location-led storefront layer for premium jewellery discovery.',
    background: 'ivory',
    order: 0,
    cards: [
      createCard({ title: 'Overview', link: '#location-overview', sortOrder: 1 }),
      createCard({ title: 'Properties', link: '#location-properties', sortOrder: 2 }),
      createCard({ title: 'Amenities', link: '#location-amenities', sortOrder: 3 }),
      createCard({ title: 'FAQs', link: '#location-faqs', sortOrder: 4 }),
    ],
  }),
  sections: {
    hero: createSection({
      heading: 'West London Jewellery, Styled Around Your Moment',
      subheading: 'Location Engine',
      description: 'Explore ELURA pieces through a local luxury lens, from bridal appointments to considered gifting.',
      background: 'ink',
      order: 1,
      images: [
        createImage({
          image: heroStudio,
          alt: 'Luxury jewellery styling studio in West London',
          caption: 'West London styling appointments',
          overlayText: 'Local luxury, refined online',
          badge: 'Featured',
          sortOrder: 1,
        }),
      ],
      cards: [
        createCard({ title: 'Book a styling call', description: 'Personal guidance for bridal, gifts, and event styling.', icon: 'Calendar', link: '/contact', sortOrder: 1 }),
        createCard({ title: 'Shop local favourites', description: 'A focused edit selected for London occasions.', icon: 'Gem', link: '/shop', sortOrder: 2 }),
      ],
    }),
    heroGallery: createSection({
      heading: 'Hero Gallery',
      subheading: 'Visual Story',
      description: 'Images used to express the local page above the fold.',
      background: 'linen',
      order: 2,
      images: [
        createImage({ image: emeraldSet, alt: 'Emerald necklace set by ELURA Jewels', caption: 'Emerald edit', overlayText: 'Statement necklaces', badge: 'Necklaces', sortOrder: 1 }),
        createImage({ image: ringOne, alt: 'Luxury ring by ELURA Jewels', caption: 'Ring edit', overlayText: 'Ceremony ready', badge: 'Rings', sortOrder: 2 }),
        createImage({ image: earringsOne, alt: 'Luxury earrings by ELURA Jewels', caption: 'Earring edit', overlayText: 'Evening polish', badge: 'Earrings', sortOrder: 3 }),
      ],
    }),
    counters: createSection({
      heading: 'Local Confidence Signals',
      subheading: 'Counters',
      description: 'Proof points that help visitors orient quickly.',
      background: 'white',
      order: 3,
      cards: [
        createCard({ title: '2-4 days', description: 'Typical UK delivery estimate', icon: 'Truck', sortOrder: 1 }),
        createCard({ title: '5 edits', description: 'Core jewellery categories', icon: 'LayoutGrid', sortOrder: 2 }),
        createCard({ title: 'Secure', description: 'Shopify hosted checkout', icon: 'ShieldCheck', sortOrder: 3 }),
      ],
    }),
    trustStrip: createSection({
      heading: 'Why Shop ELURA Locally',
      subheading: 'Trust Strip',
      description: 'Short reassurance messages for the location experience.',
      background: 'ivory',
      order: 4,
      cards: [
        createCard({ title: 'Tracked UK delivery', description: 'Every parcel is prepared with care and tracking support.', icon: 'PackageCheck', sortOrder: 1 }),
        createCard({ title: 'Gift-ready presentation', description: 'Packaging suited to bridal, celebrations, and keepsakes.', icon: 'Gift', sortOrder: 2 }),
        createCard({ title: 'Customer support', description: 'Guidance before and after purchase.', icon: 'Headphones', sortOrder: 3 }),
      ],
    }),
    propertyCards: createSection({
      heading: 'Location Shopping Paths',
      subheading: 'Property Cards',
      description: 'Editable cards for location-led product discovery.',
      background: 'white',
      order: 5,
      cards: [
        createCard({ title: 'Bridal styling', description: 'Rings, sets, and polished accents for ceremony moments.', icon: 'Sparkles', image: ringOne, link: '/shop?category=Rings', sortOrder: 1 }),
        createCard({ title: 'Gifting edit', description: 'Necklaces and bracelets for meaningful, refined gifts.', icon: 'Gift', image: necklaceOne, link: '/shop?category=Necklaces', sortOrder: 2 }),
        createCard({ title: 'Everyday luxury', description: 'Clean pieces for work, dinner, and weekend dressing.', icon: 'Gem', image: braceletDisplay, link: '/shop', sortOrder: 3 }),
      ],
    }),
    subAreaChips: createSection({
      heading: 'Nearby Areas',
      subheading: 'Sub Area Chips',
      description: 'Editable micro-location chips.',
      background: 'linen',
      order: 6,
      cards: [
        createCard({ title: 'West London', description: 'Primary service area', icon: 'MapPin', link: '/contact', sortOrder: 1 }),
        createCard({ title: 'Central London', description: 'Occasion and event styling', icon: 'MapPin', link: '/contact', sortOrder: 2 }),
        createCard({ title: 'UK-wide', description: 'Tracked delivery coverage', icon: 'MapPin', link: '/shipping&returns', sortOrder: 3 }),
      ],
    }),
    amenities: createSection({
      heading: 'Shopping Amenities',
      subheading: 'Amenities',
      description: 'Editable amenities that support buying confidence.',
      background: 'white',
      order: 7,
      cards: [
        createCard({ title: 'Secure checkout', description: 'Protected Shopify checkout flow.', icon: 'ShieldCheck', sortOrder: 1 }),
        createCard({ title: 'Wishlist', description: 'Save favourite pieces before purchasing.', icon: 'Heart', sortOrder: 2 }),
        createCard({ title: 'Product guidance', description: 'Contact support for fit, styling, and gifting help.', icon: 'MessageCircle', sortOrder: 3 }),
      ],
    }),
    benefits: createSection({
      heading: 'Benefits',
      subheading: 'Why It Works',
      description: 'Editable benefit cards for conversion support.',
      background: 'ivory',
      order: 8,
      cards: [
        createCard({ title: 'Curated edits', description: 'Visitors can move from local intent into focused categories.', icon: 'ListChecks', sortOrder: 1 }),
        createCard({ title: 'Premium presentation', description: 'Every visible promise can be kept aligned with operations.', icon: 'BadgeCheck', sortOrder: 2 }),
        createCard({ title: 'CMS controlled', description: 'Admin content updates do not require a code deploy.', icon: 'Pencil', sortOrder: 3 }),
      ],
    }),
    landmarks: createSection({
      heading: 'Landmarks And Occasions',
      subheading: 'Landmarks',
      description: 'Editable references for local relevance.',
      background: 'white',
      order: 9,
      cards: [
        createCard({ title: 'Wedding venues', description: 'Jewellery edits for ceremonies and receptions.', icon: 'Building2', sortOrder: 1 }),
        createCard({ title: 'Celebration dinners', description: 'Elegant finishing pieces for evenings out.', icon: 'Utensils', sortOrder: 2 }),
        createCard({ title: 'Gift moments', description: 'Birthdays, anniversaries, and keepsakes.', icon: 'Gift', sortOrder: 3 }),
      ],
    }),
    gallery: createSection({
      heading: 'Location Gallery',
      subheading: 'Gallery',
      description: 'Editable image gallery for the digital twin.',
      background: 'linen',
      order: 10,
      images: [
        createImage({ image: categoryDisplay, alt: 'ELURA jewellery category display', caption: 'Category display', overlayText: 'Explore edits', badge: 'Gallery', sortOrder: 1 }),
        createImage({ image: necklaceOne, alt: 'ELURA necklace detail', caption: 'Necklace detail', overlayText: 'Layered shine', badge: 'Necklaces', sortOrder: 2 }),
        createImage({ image: braceletDisplay, alt: 'ELURA bracelet display', caption: 'Bracelet display', overlayText: 'Daily polish', badge: 'Bracelets', sortOrder: 3 }),
      ],
    }),
    testimonials: createSection({
      heading: 'Customer Notes',
      subheading: 'Testimonials',
      description: 'Editable testimonial placeholders for approved customer content.',
      background: 'white',
      order: 11,
      cards: [
        createCard({ title: 'A considered gift', description: 'The piece felt refined and arrived beautifully presented.', icon: 'Quote', sortOrder: 1 }),
        createCard({ title: 'Easy to choose', description: 'The edit made it simple to find something elegant.', icon: 'Quote', sortOrder: 2 }),
      ],
    }),
    faqs: createSection({
      heading: 'Location FAQs',
      subheading: 'FAQs',
      description: 'Editable questions and answers for local shoppers.',
      background: 'ivory',
      order: 12,
      cards: [
        createCard({ title: 'Do you deliver across the UK?', description: 'Yes. UK delivery options are shown during checkout.', icon: 'HelpCircle', sortOrder: 1 }),
        createCard({ title: 'Can I ask for styling help?', description: 'Yes. Contact support for jewellery guidance before ordering.', icon: 'HelpCircle', sortOrder: 2 }),
        createCard({ title: 'Are pieces gift-ready?', description: 'Orders are prepared with ELURA presentation in mind.', icon: 'HelpCircle', sortOrder: 3 }),
      ],
    }),
    map: createSection({
      heading: 'West London Service Area',
      subheading: 'Map',
      description: 'Editable map and location context.',
      background: 'white',
      order: 13,
      cards: [
        createCard({ title: 'ELURA Jewels', description: 'West London, UK', icon: 'MapPinned', link: 'https://maps.google.com/?q=West+London+UK', sortOrder: 1 }),
      ],
    }),
    cta: createSection({
      heading: 'Find Your ELURA Piece',
      subheading: 'CTA',
      description: 'Editable final conversion section.',
      background: 'ink',
      order: 14,
      cards: [
        createCard({ title: 'Shop the collection', description: 'Browse the current ELURA edit.', icon: 'ShoppingBag', link: '/shop', sortOrder: 1 }),
        createCard({ title: 'Contact support', description: 'Ask about styling, gifting, or delivery.', icon: 'Mail', link: '/contact', sortOrder: 2 }),
      ],
    }),
  },
  footer: createSection({
    heading: 'ELURA Jewels',
    subheading: 'Footer',
    description: 'Modern and contemporary jewellery shaped for everyday luxury and occasion dressing.',
    background: 'ink',
    order: 99,
    cards: [
      createCard({ title: 'Email', description: 'info.elurajewels@gmail.com', icon: 'Mail', link: 'mailto:info.elurajewels@gmail.com', sortOrder: 1 }),
      createCard({ title: 'WhatsApp', description: '+44 7440482483', icon: 'MessageCircle', link: 'https://wa.me/447440482483', sortOrder: 2 }),
      createCard({ title: 'Location', description: 'West London, UK', icon: 'MapPin', link: '/contact', sortOrder: 3 }),
    ],
  }),
}

const emptyLocationDigitalTwin = {
  header: createSection({
    visibility: false,
  }),
  sections: {},
  footer: createSection({
    visibility: false,
  }),
}

const sortVisible = (items = []) =>
  [...items]
    .filter((item) => item?.visibility !== false)
    .sort((a, b) => Number(a.sortOrder ?? a.order ?? 0) - Number(b.sortOrder ?? b.order ?? 0))

const locationSectionKeys = Object.keys(defaultLocationDigitalTwin.sections)

export {
  cardFields,
  createCard,
  createImage,
  createSection,
  defaultLocationDigitalTwin,
  emptyLocationDigitalTwin,
  imageFields,
  locationSectionKeys,
  sectionFields,
  sortVisible,
}
