import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin } from 'lucide-react'
import logoImage from '../assets/brand/elura-logo.svg'
import { contactDetails } from '../data/siteData.js'
import { SocialPlatformIcon } from '../components/SocialPlatformIcon.jsx'
import { subscribeCmsDoc } from '../lib/cms.js'
import { hasSupportedSocialIcon } from '../lib/socialPlatforms.js'

const shopLinks = [
  { label: 'Necklaces', href: '/shop?category=Necklaces' },
  { label: 'Earrings', href: '/shop?category=Earrings' },
  { label: 'Rings', href: '/shop?category=Rings' },
  { label: 'Bracelets', href: '/shop?category=Bracelets' },
  { label: 'Bangles', href: '/shop?category=Bangles' },
]

const quickLinks = [
  { label: 'About', href: '/about' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Shipping & Returns', href: '/shipping&returns' },
  { label: 'FAQs', href: '/faq' },
]

function FooterSection() {
  const [socialMedia, setSocialMedia] = useState({ items: [] })

  useEffect(() => {
    const unsubscribe = subscribeCmsDoc(
      'socialMedia',
      { items: [] },
      setSocialMedia,
    )

    return unsubscribe
  }, [])

  const socialLinks = useMemo(
    () =>
      (socialMedia.items || [])
        .filter((item) => item.enabled !== false && item.platform && item.url && hasSupportedSocialIcon(item.platform))
        .sort((a, b) => Number(a.order || 0) - Number(b.order || 0)),
    [socialMedia.items],
  )

  const hasSocialLinks = socialLinks.length > 0

  return (
    <footer className="border-t border-black/8 bg-white/45">
      <div className="section-shell py-16 pb-28 sm:py-20">
        <div className="grid gap-10 md:max-[1199px]:grid-cols-2 min-[1200px]:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img
                src={logoImage}
                alt="ELURA Jewels"
                loading="lazy"
                decoding="async"
                width="160"
                height="80"
                className="footer-logo h-14 w-auto object-contain bg-transparent sm:h-16"
              />
              <span className="font-serif text-[19px] uppercase tracking-[0.12em] text-gold sm:text-[21px]">
                ELURA
              </span>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted sm:text-base">
              Modern and contemporary jewellery with a clean, premium feel shaped for
              everyday luxury and occasion dressing.
            </p>
            {hasSocialLinks ? (
              <div className="mt-5 hidden flex-wrap gap-3 min-[1200px]:flex">
                {socialLinks.map((item) => (
                  <a
                    key={`desktop-${item.id || item.platform}`}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`ELURA on ${item.platform}`}
                    className="footer-social-icon inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/70 text-ink transition duration-[250ms] ease-out hover:-translate-y-[3px] hover:scale-[1.08] hover:border-gold hover:text-gold hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 active:scale-105"
                  >
                    <SocialPlatformIcon platform={item.platform} className="footer-social-svg" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid gap-8 md:grid-cols-2 md:max-[1199px]:contents min-[1200px]:grid-cols-3">
            <div>
              <p className="section-eyebrow">SHOP</p>
              <div className="mt-4 flex flex-col gap-2 text-sm text-muted">
                {shopLinks.map((link) => (
                  <Link key={`SHOP-${link.label}`} to={link.href} className="link-animated footer-link">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="section-eyebrow">QUICK LINKS</p>
              <div className="mt-4 flex flex-col gap-2 text-sm text-muted">
                {quickLinks.map((link) => (
                  <Link
                    key={`QUICK-LINKS-${link.label}`}
                    to={link.href}
                    className="link-animated footer-link"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
  <p className="section-eyebrow">CONTACT</p>

  <div className="mt-4 flex flex-col gap-4 text-sm text-muted">
    
    <a
      href={`mailto:${contactDetails.email}`}
      className="flex items-start gap-3 link-animated footer-link"
    >
      <Mail className="mt-0.5 h-4 w-4 text-gold" />
      <span>{contactDetails.email}</span>
    </a>

    <a
  href="https://wa.me/447440482483"
  target="_blank"
  rel="noopener noreferrer"
  className="group flex items-center gap-3 whitespace-nowrap transition hover:text-gold"
>
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
    alt="WhatsApp"
    loading="lazy"
    decoding="async"
    width="20"
    height="20"
    className="h-5 w-5"
  />

  <span className="relative">
  +44 7440482483

  <span className="absolute bottom-[-2px] left-0 h-[1px] w-0 bg-gold transition-all duration-300 group-hover:w-full" />
</span>
</a>
    <div className="flex items-center gap-3 whitespace-nowrap">
  <MapPin className="h-4 w-4 shrink-0 text-gold" />
  <span className="whitespace-nowrap">
    {contactDetails.location}
  </span>
</div>

  </div>
</div>
            {hasSocialLinks ? (
              <div className="md:max-[1199px]:col-span-2 min-[1200px]:hidden">
                <p className="section-eyebrow text-left">SOCIAL</p>
                <div className="mt-4 flex flex-wrap items-start justify-start gap-3">
                  {socialLinks.map((item) => (
                    <a
                      key={item.id || item.platform}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`ELURA on ${item.platform}`}
                      className="footer-social-icon inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/70 text-ink transition duration-300 ease-out hover:-translate-y-[3px] hover:scale-[1.08] hover:border-gold hover:text-gold hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 active:scale-105"
                    >
                      <SocialPlatformIcon platform={item.platform} className="footer-social-svg" />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-14 grid gap-3 border-t border-black/8 pt-6 text-center text-[11px] uppercase leading-6 tracking-[0.12em] text-muted md:grid-cols-2 md:items-center md:tracking-[0.18em]">
          <a
  href="https://ecliptixsolutions.com/"
  target="_blank"
  rel="noopener noreferrer"
  className="link-animated footer-link break-words text-center transition hover:text-gold md:justify-self-start md:text-left"
>
  Designed &amp; Developed by Ecliptix Solutions
</a>
          <p className="break-words text-center sm:justify-self-end sm:text-right">
            &copy; 2026 ELURA Jewels. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default FooterSection
