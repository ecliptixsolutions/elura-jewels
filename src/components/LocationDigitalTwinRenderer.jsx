import {
  BadgeCheck,
  Building2,
  Calendar,
  Circle,
  Gem,
  Gift,
  Headphones,
  Heart,
  HelpCircle,
  LayoutGrid,
  ListChecks,
  Mail,
  MapPin,
  MapPinned,
  MessageCircle,
  PackageCheck,
  Pencil,
  Quote,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Utensils,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { sortVisible } from '../data/locationDigitalTwin.js'

const backgroundClasses = {
  ink: 'bg-ink text-ivory',
  ivory: 'bg-ivory text-ink',
  linen: 'bg-linen text-ink',
  mist: 'bg-mist text-ink',
  white: 'bg-white text-ink',
}

const mutedClasses = {
  ink: 'text-ivory/72',
  ivory: 'text-muted',
  linen: 'text-muted',
  mist: 'text-muted',
  white: 'text-muted',
}

const icons = {
  BadgeCheck,
  Building2,
  Calendar,
  Circle,
  Gem,
  Gift,
  Headphones,
  Heart,
  HelpCircle,
  LayoutGrid,
  ListChecks,
  Mail,
  MapPin,
  MapPinned,
  MessageCircle,
  PackageCheck,
  Pencil,
  Quote,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Utensils,
}

const sectionClass = (background) =>
  backgroundClasses[background] || backgroundClasses.ivory

const mutedClass = (background) =>
  mutedClasses[background] || mutedClasses.ivory

function DynamicIcon({ name, className = 'h-5 w-5' }) {
  const Icon = icons[name] || Circle

  return <Icon className={className} />
}

function SmartLink({ to, children, className }) {
  if (!to) {
    return <span className={className}>{children}</span>
  }

  if (/^https?:|^mailto:|^tel:/i.test(to)) {
    return (
      <a href={to} target={to.startsWith('http') ? '_blank' : undefined} rel={to.startsWith('http') ? 'noopener noreferrer' : undefined} className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  )
}

function SectionIntro({ section }) {
  if (!section?.heading && !section?.subheading && !section?.description) {
    return null
  }

  return (
    <div className="mb-10 max-w-3xl">
      {section.subheading ? <p className="section-eyebrow">{section.subheading}</p> : null}
      {section.heading ? <h2 className="mt-3 text-4xl text-current sm:text-5xl">{section.heading}</h2> : null}
      {section.description ? <p className={`mt-4 text-base ${mutedClass(section.background)}`}>{section.description}</p> : null}
    </div>
  )
}

function ImageTile({ item, className = '' }) {
  if (!item?.image) {
    return null
  }

  return (
    <figure className={`group relative overflow-hidden rounded-[8px] bg-linen ${className}`}>
      <img
        src={item.image}
        alt={item.alt || item.caption || item.overlayText || ''}
        loading="lazy"
        decoding="async"
        className="h-full min-h-[18rem] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
      />
      {(item.badge || item.overlayText || item.caption) ? (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/72 via-black/28 to-transparent p-5 text-white">
          {item.badge ? <span className="inline-flex rounded-full bg-white/16 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em]">{item.badge}</span> : null}
          {item.overlayText ? <p className="mt-3 text-xl font-semibold">{item.overlayText}</p> : null}
          {item.caption ? <p className="mt-1 text-sm text-white/78">{item.caption}</p> : null}
        </figcaption>
      ) : null}
    </figure>
  )
}

function CardTile({ card }) {
  return (
    <SmartLink
      to={card.link}
      className="group flex h-full flex-col rounded-[8px] border border-black/8 bg-white/76 p-5 text-ink transition duration-300 hover:-translate-y-1 hover:border-gold/50"
    >
      {card.image ? (
        <img
          src={card.image}
          alt={card.title || ''}
          loading="lazy"
          decoding="async"
          className="mb-5 aspect-[4/3] w-full rounded-[8px] object-cover"
        />
      ) : null}
      <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-linen text-gold">
        <DynamicIcon name={card.icon} />
      </span>
      {card.title ? <h3 className="text-2xl">{card.title}</h3> : null}
      {card.description ? <p className="mt-3 text-sm text-muted">{card.description}</p> : null}
    </SmartLink>
  )
}

function HeroSection({ section }) {
  const images = sortVisible(section.images)
  const cards = sortVisible(section.cards)
  const primaryImage = images[0]

  return (
    <section id="location-overview" className={`section-spacing ${sectionClass(section.background)}`}>
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            {section.subheading ? <p className="section-eyebrow">{section.subheading}</p> : null}
            {section.heading ? <h1 className="mt-4 text-5xl text-current sm:text-6xl lg:text-7xl">{section.heading}</h1> : null}
            {section.description ? <p className={`mt-6 text-base sm:text-lg ${mutedClass(section.background)}`}>{section.description}</p> : null}
            {cards.length ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {cards.map((card) => (
                  <SmartLink key={`${card.title}-${card.sortOrder}`} to={card.link} className="btn-primary bg-white text-ink hover:text-ink">
                    {card.title}
                  </SmartLink>
                ))}
              </div>
            ) : null}
          </div>
          <ImageTile item={primaryImage} className="min-h-[28rem]" />
        </div>
      </div>
    </section>
  )
}

function GallerySection({ section, featured = false }) {
  const images = sortVisible(section.images)

  if (!images.length) return null

  return (
    <section className={`section-spacing ${sectionClass(section.background)}`}>
      <div className="section-shell">
        <SectionIntro section={section} />
        <div className={featured ? 'grid gap-5 md:grid-cols-3' : 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'}>
          {images.map((item) => (
            <ImageTile key={`${item.image}-${item.sortOrder}`} item={item} className={featured ? 'min-h-[22rem]' : 'min-h-[18rem]'} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CardsSection({ section, id, compact = false }) {
  const cards = sortVisible(section.cards)

  if (!cards.length) return null

  return (
    <section id={id} className={`section-spacing ${sectionClass(section.background)}`}>
      <div className="section-shell">
        <SectionIntro section={section} />
        <div className={compact ? 'flex flex-wrap gap-3' : 'grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3'}>
          {cards.map((card) =>
            compact ? (
              <SmartLink
                key={`${card.title}-${card.sortOrder}`}
                to={card.link}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-5 py-3 text-sm font-semibold text-ink transition hover:border-gold hover:text-gold"
              >
                <DynamicIcon name={card.icon} className="h-4 w-4" />
                {card.title}
              </SmartLink>
            ) : (
              <CardTile key={`${card.title}-${card.sortOrder}`} card={card} />
            ),
          )}
        </div>
      </div>
    </section>
  )
}

function FaqSection({ section }) {
  const cards = sortVisible(section.cards)

  if (!cards.length) return null

  return (
    <section id="location-faqs" className={`section-spacing ${sectionClass(section.background)}`}>
      <div className="section-shell">
        <SectionIntro section={section} />
        <div className="grid gap-4">
          {cards.map((card) => (
            <details key={`${card.title}-${card.sortOrder}`} className="rounded-[8px] border border-black/8 bg-white/75 p-5 text-ink">
              <summary className="cursor-pointer text-xl font-semibold">{card.title}</summary>
              {card.description ? <p className="mt-3 text-sm text-muted">{card.description}</p> : null}
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function MapSection({ section }) {
  const cards = sortVisible(section.cards)
  const primary = cards[0]

  return (
    <section className={`section-spacing ${sectionClass(section.background)}`}>
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
          <div>
            <SectionIntro section={section} />
            {cards.map((card) => (
              <CardTile key={`${card.title}-${card.sortOrder}`} card={card} />
            ))}
          </div>
          <SmartLink to={primary?.link} className="flex min-h-[24rem] items-center justify-center rounded-[8px] border border-black/8 bg-linen text-center text-ink">
            <div>
              <DynamicIcon name={primary?.icon || 'MapPinned'} className="mx-auto h-12 w-12 text-gold" />
              {primary?.title ? <h3 className="mt-5 text-3xl">{primary.title}</h3> : null}
              {primary?.description ? <p className="mt-2 text-sm text-muted">{primary.description}</p> : null}
            </div>
          </SmartLink>
        </div>
      </div>
    </section>
  )
}

function HeaderTwin({ header }) {
  if (header?.visibility === false) return null

  const cards = sortVisible(header.cards)

  return (
    <div className={`border-b border-black/8 ${sectionClass(header.background)}`}>
      <div className="section-shell flex flex-col gap-5 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          {header.subheading ? <p className="section-eyebrow">{header.subheading}</p> : null}
          {header.heading ? <p className="mt-1 font-serif text-2xl">{header.heading}</p> : null}
          {header.description ? <p className={`mt-1 text-sm ${mutedClass(header.background)}`}>{header.description}</p> : null}
        </div>
        {cards.length ? (
          <nav className="flex flex-wrap gap-3">
            {cards.map((card) => (
              <SmartLink key={`${card.title}-${card.sortOrder}`} to={card.link} className="line-link">
                {card.title}
              </SmartLink>
            ))}
          </nav>
        ) : null}
      </div>
    </div>
  )
}

function FooterTwin({ footer }) {
  if (footer?.visibility === false) return null

  const cards = sortVisible(footer.cards)

  return (
    <footer className={`section-spacing ${sectionClass(footer.background)}`}>
      <div className="section-shell">
        <SectionIntro section={footer} />
        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((card) => (
            <SmartLink key={`${card.title}-${card.sortOrder}`} to={card.link} className="flex items-start gap-3 rounded-[8px] bg-white/10 p-4">
              <DynamicIcon name={card.icon} className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <span>
                <span className="block text-sm font-semibold">{card.title}</span>
                <span className="mt-1 block text-sm text-current/70">{card.description}</span>
              </span>
            </SmartLink>
          ))}
        </div>
      </div>
    </footer>
  )
}

function renderSection(key, section) {
  if (!section || section.visibility === false) return null

  if (key === 'hero') return <HeroSection key={key} section={section} />
  if (key === 'heroGallery' || key === 'gallery') return <GallerySection key={key} section={section} featured={key === 'heroGallery'} />
  if (key === 'subAreaChips') return <CardsSection key={key} id="location-areas" section={section} compact />
  if (key === 'faqs') return <FaqSection key={key} section={section} />
  if (key === 'map') return <MapSection key={key} section={section} />
  if (key === 'propertyCards') return <CardsSection key={key} id="location-properties" section={section} />
  if (key === 'amenities') return <CardsSection key={key} id="location-amenities" section={section} />

  return <CardsSection key={key} section={section} />
}

function LocationDigitalTwinRenderer({ content }) {
  const sections = Object.entries(content?.sections || {})
    .filter(([, section]) => section?.visibility !== false)
    .sort(([, a], [, b]) => Number(a.order || 0) - Number(b.order || 0))

  return (
    <div className="bg-ivory text-ink">
      <HeaderTwin header={content?.header} />
      {sections.map(([key, section]) => renderSection(key, section))}
      <FooterTwin footer={content?.footer} />
    </div>
  )
}

export default LocationDigitalTwinRenderer
