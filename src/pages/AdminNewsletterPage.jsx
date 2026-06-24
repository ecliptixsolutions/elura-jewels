import { useEffect, useState } from 'react'

import useUnsavedChanges from '../hooks/useUnsavedChanges.js'
import { saveCmsDoc, subscribeCmsDoc } from '../lib/cms.js'

const newsletterFallback = {
  enabled: true,
  heading: 'Get 10% Off Your First Order',
  description: 'Join the ELURA Privilege Club',
  offer: '',
  imageUrl: '',
  delaySeconds: 10,
}

function AdminNewsletterPage() {
  const [settings, setSettings] = useState(newsletterFallback)
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState('')

  useUnsavedChanges(dirty)

  useEffect(() => {
    const unsubscribe = subscribeCmsDoc(
      'newsletter',
      newsletterFallback,
      setSettings,
    )

    return unsubscribe
  }, [])

  const updateSetting = (field, value) => {
    setDirty(true)
    setSettings((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const saveNewsletter = async () => {
    if (!settings.heading.trim() || Number(settings.delaySeconds) < 1) {
      setError('Newsletter heading is required and delay must be at least one second.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await saveCmsDoc('newsletter', {
        enabled: Boolean(settings.enabled),
        heading: settings.heading.trim(),
        description: settings.description.trim(),
        offer: settings.offer.trim(),
        imageUrl: settings.imageUrl?.trim() || '',
        delaySeconds: Number(settings.delaySeconds || 10),
      })
      setDirty(false)
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
        {error ? <p className="mt-6 rounded-[8px] bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}

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
            <input value={settings.imageUrl || ''} onChange={(event) => updateSetting('imageUrl', event.target.value)} className="input-shell" placeholder="Popup image URL (optional)" />
            <label className="text-sm text-muted">
              Delay time in seconds
              <input type="number" min="1" value={settings.delaySeconds} onChange={(event) => updateSetting('delaySeconds', event.target.value)} className="input-shell mt-2" />
            </label>
          </div>

          <button type="button" onClick={saveNewsletter} disabled={loading || !dirty} className="btn-primary mt-8">
            {loading ? 'Saving...' : dirty ? 'Save Newsletter Popup' : 'Saved'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminNewsletterPage
