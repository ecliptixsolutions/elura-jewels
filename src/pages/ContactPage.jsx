import { Mail, MapPin } from 'lucide-react'
import { useState } from 'react'
import SEO from '../components/SEO.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { contactDetails } from '../data/siteData.js'
import { pageSeo } from '../seo/seoConfig.js'
import {
  breadcrumbSchema,
  jewelryStoreSchema,
} from '../seo/structuredData.js'

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <div className="section-spacing">
      <SEO
        {...pageSeo.contact}
        canonicalPath="/contact"
        structuredData={[
          jewelryStoreSchema('/contact'),
          breadcrumbSchema([
            {
              name: 'Home',
              path: '/',
            },
            {
              name: 'Contact',
              path: '/contact',
            },
          ]),
        ]}
      />
      <div className="section-shell">
        <div className="grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Get in touch with ELURA"
              description="For product questions, returns, delivery updates, or general support, send us a message and we'll reply by email."
              as="h1"
            />

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4 border-b border-black/8 pb-6">
                <Mail className="mt-1 h-4 w-4 text-gold" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
                    Email
                  </p>
                  <p className="mt-2 text-base">{contactDetails.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 border-b border-black/8 pb-6">
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
    alt="WhatsApp"
    loading="lazy"
    decoding="async"
    width="16"
    height="16"
    className="mt-1 h-4 w-4"
  />

  <div>
    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
      Whatsapp
    </p>

    <a
      href="https://wa.me/447440482483"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex min-h-11 items-center whitespace-nowrap text-base transition hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
    >
      +44 7440482483
    </a>
  </div>
</div>
              <div className="flex items-start gap-4 pb-2">
                <MapPin className="mt-1 h-4 w-4 text-gold" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
                    Location
                  </p>
                  <p className="mt-2 text-base">{contactDetails.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:pt-10">
            <form
              className="space-y-7"
              onSubmit={async (event) => {
                event.preventDefault()
                setIsSubmitting(true)
                setSubmitted(false)

                try {
                  const response = await fetch('http://localhost:5000/send-email', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                  })

                  const data = await response.json()

                  if (!response.ok) {
                    throw new Error(data.error || 'Unable to send message right now.')
                  }

                  setSubmitted(true)
                  setFormData({
                    name: '',
                    email: '',
                    message: '',
                  })
                } catch (error) {
                  console.error('Failed to send contact form', error)
                  window.alert(error.message || 'Unable to send message right now.')
                } finally {
                  setIsSubmitting(false)
                }
              }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-3 block text-xs font-medium uppercase tracking-[0.24em] text-muted"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, name: event.target.value }))
                    }
                    className="input-shell"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-3 block text-xs font-medium uppercase tracking-[0.24em] text-muted"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, email: event.target.value }))
                    }
                    className="input-shell"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-3 block text-xs font-medium uppercase tracking-[0.24em] text-muted"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="7"
                  value={formData.message}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, message: event.target.value }))
                  }
                  className="input-shell resize-none"
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                Send Message
              </button>

              {submitted && (
                <p className="text-sm text-muted">
                  Thanks. Your message has been sent successfully.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
