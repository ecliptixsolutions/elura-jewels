import { Loader2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { createNewsletterCustomer } from '../lib/api.js'
import { subscribeCmsDoc } from '../lib/cms.js'
import { trackConversionEvent } from '../lib/analytics.js'

const newsletterFallback = {
  enabled: true,
  heading: 'Get 10% Off Your First Order',
  description: 'Join the ELURA Privilege Club',
  offer: '',
  delaySeconds: 10,
}
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || ''

function NewsletterPopup() {
  const location = useLocation()
  const [settings, setSettings] = useState(newsletterFallback)
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [website, setWebsite] = useState('')

  useEffect(() => {
    if (!isVisible || !TURNSTILE_SITE_KEY || document.querySelector('script[data-turnstile]')) {
      return undefined
    }

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    script.dataset.turnstile = 'true'
    document.head.appendChild(script)

    return undefined
  }, [isVisible])

  useEffect(() => {
    window.eluraTurnstileCallback = (token) => {
      setTurnstileToken(token)
    }

    return () => {
      delete window.eluraTurnstileCallback
    }
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeCmsDoc(
      'newsletter',
      newsletterFallback,
      setSettings,
    )

    return unsubscribe
  }, [])

  useEffect(() => {
    const blockedRoutes = ['/checkout', '/login', '/signup', '/profile', '/admin', '/admin-login']
    const isBlockedRoute = blockedRoutes.some((path) => location.pathname.startsWith(path))

    if (isBlockedRoute || !settings.enabled || window.localStorage.getItem('elura_popup_seen')) {
      return undefined
    }

    let minimumDelayPassed = false
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    const configuredDelay = Number(settings.delaySeconds || 10) * 1000
    const minimumDelay = isMobile
      ? Math.max(configuredDelay, 45000)
      : Math.max(configuredDelay, 12000)

    const show = () => {
      if (minimumDelayPassed && !window.localStorage.getItem('elura_popup_seen')) {
        setIsVisible(true)
      }
    }

    const timerId = window.setTimeout(() => {
      minimumDelayPassed = true

      if (!isMobile) {
        show()
      }
    }, minimumDelay)

    const onScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight

      if (scrollableHeight > 0 && window.scrollY / scrollableHeight >= (isMobile ? 0.72 : 0.58)) {
        show()
      }
    }
    const onMouseLeave = (event) => {
      if (event.clientY <= 0) {
        show()
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)

    return () => {
      window.clearTimeout(timerId)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [location.pathname, settings.delaySeconds, settings.enabled])

  useEffect(() => {
    if (!isVisible) {
      return undefined
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closePopup()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isVisible])

  const closePopup = () => {
    window.localStorage.setItem('elura_popup_seen', 'true')
    setIsVisible(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setStatus('')
    setIsSubmitting(true)

    try {
      await createNewsletterCustomer({
        email,
        turnstileToken,
        website,
      })
      setStatus('Thank you. Your ELURA subscription is active.')
      trackConversionEvent('newsletter_signup', {
        email_domain: email.split('@')[1] || '',
      })
      window.localStorage.setItem('elura_popup_seen', 'true')
      window.setTimeout(() => setIsVisible(false), 1400)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/35 px-4 pb-4 backdrop-blur-[2px] sm:items-center sm:px-5 sm:pb-0">
      <div className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-[14px] bg-ivory p-6 shadow-[0_28px_90px_rgba(27,24,19,0.22)] sm:rounded-[8px] sm:p-9">
        <button
          type="button"
          onClick={closePopup}
          className="icon-button absolute right-4 top-4"
          aria-label="Close newsletter popup"
        >
          <X className="h-4 w-4" />
        </button>

        <p className="section-eyebrow">ELURA</p>
        <h2 className="mt-4 text-3xl leading-tight sm:text-4xl">{settings.heading}</h2>
        <p className="mt-4 text-sm text-muted sm:text-base">{settings.description}</p>
        {settings.offer ? <p className="mt-3 text-sm font-semibold text-gold">{settings.offer}</p> : null}

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="input-shell"
            placeholder="Email address"
            required
          />
          <input
            type="text"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            className="hidden"
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
          />

          {TURNSTILE_SITE_KEY ? (
            <div
              className="cf-turnstile"
              data-sitekey={TURNSTILE_SITE_KEY}
              data-callback="eluraTurnstileCallback"
            />
          ) : null}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Claiming Offer
              </>
            ) : (
              'Claim Offer'
            )}
          </button>
        </form>

        {status ? <p className="mt-4 text-sm text-emerald">{status}</p> : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  )
}

export default NewsletterPopup
