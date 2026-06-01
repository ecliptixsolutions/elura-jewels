import { useEffect, useState } from 'react'

import { saveCmsDoc, subscribeCmsDoc } from '../lib/cms.js'

const newsletterFallback = {
  enabled: true,
  heading: 'Get 10% Off Your First Order',
  description: 'Join the ELURA Privilege Club',
  offer: '',
  delaySeconds: 10,
}

function AdminNewsletterPage() {
  const [settings, setSettings] = useState(newsletterFallback)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeCmsDoc(
      'newsletter',
      newsletterFallback,
      setSettings,
    )

    return unsubscribe
  }, [])

  const updateSetting = (field, value) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const saveNewsletter = async () => {
    setLoading(true)

    try {
      await saveCmsDoc('newsletter', {
        enabled: Boolean(settings.enabled),
        heading: settings.heading.trim(),
        description: settings.description.trim(),
        offer: settings.offer.trim(),
        delaySeconds: Number(settings.delaySeconds || 10),
      })
      window.alert('Newsletter popup settings saved.')
    } catch (error) {
      window.alert(error.message || 'Failed to save newsletter settings.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section-spacing">
      <div className="section-shell max-w-4xl">
        <p className="section-eyebrow">Marketing</p>
        <h1 className="mt-3 text-5xl">Newsletter Popup</h1>
        <p className="mt-4 text-muted">
          Newsletter submissions create Shopify customers with marketing consent and the newsletter tag.
        </p>

        <div className="mt-12 rounded-[8px] border border-black/8 bg-white p-8">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={Boolean(settings.enabled)}
              onChange={(event) => updateSetting('enabled', event.target.checked)}
            />
            <span className="text-sm font-medium">Enable newsletter popup</span>
          </label>

          <div className="mt-8 grid gap-6">
            <input value={settings.heading} onChange={(event) => updateSetting('heading', event.target.value)} className="input-shell" placeholder="Heading" />
            <textarea value={settings.description} onChange={(event) => updateSetting('description', event.target.value)} className="input-shell min-h-24 resize-none" placeholder="Description" />
            <input value={settings.offer} onChange={(event) => updateSetting('offer', event.target.value)} className="input-shell" placeholder="Offer text" />
            <label className="text-sm text-muted">
              Delay time in seconds
              <input type="number" min="1" value={settings.delaySeconds} onChange={(event) => updateSetting('delaySeconds', event.target.value)} className="input-shell mt-2" />
            </label>
          </div>

          <button type="button" onClick={saveNewsletter} disabled={loading} className="btn-primary mt-8">
            {loading ? 'Saving...' : 'Save Newsletter Popup'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminNewsletterPage
