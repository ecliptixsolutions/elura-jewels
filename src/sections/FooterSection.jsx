import { Link } from 'react-router-dom'
import { Mail, MessageCircleMore, MapPin } from 'lucide-react'
import logoImage from '../assets/brand/elura-logo.svg'
import { contactDetails } from '../data/siteData.js'

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
  return (
    <footer className="border-t border-black/8 bg-white/45">
      <div className="section-shell py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img
                src={logoImage}
                alt="ELURA Jewels"
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
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
  href={`tel:${contactDetails.phone.replace(/\s+/g, '')}`}
  className="flex items-center gap-3 whitespace-nowrap link-animated footer-link"
>
  <MessageCircleMore className="mt-1 h-4 w-4 text-gold" />
  <span className="whitespace-nowrap">{contactDetails.phone}</span>
</a>

    <div className="flex items-center gap-3 whitespace-nowrap">
  <MapPin className="h-4 w-4 shrink-0 text-gold" />
  <span className="whitespace-nowrap">
    {contactDetails.location}
  </span>
</div>

  </div>
</div>
          </div>
        </div>

        <div className="mt-14 grid gap-3 border-t border-black/8 pt-6 text-[11px] uppercase leading-6 tracking-[0.12em] text-muted sm:grid-cols-2 sm:items-center sm:tracking-[0.18em]">
          <p className="break-words text-center sm:justify-self-start sm:text-left">
            Designed &amp; Developed by Ecliptix Solutions
          </p>
          <p className="break-words text-center sm:justify-self-end sm:text-right">
            &copy; 2026 ELURA Jewels. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default FooterSection
