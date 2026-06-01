import { useEffect, useState } from 'react'

import { saveCmsDoc, subscribeCmsDoc } from '../lib/cms.js'

const announcementFallback = {
  enabled: false,
  message: '',
  backgroundColor: '#1B1813',
  textColor: '#F8F6F2',
  linkUrl: '',
}

const cartDrawerFallback = {
  freeDeliveryMessage: '',
  secureCheckoutMessage: '',
  easyReturnsMessage: '',
}

const conversionFallback = {
  freeShippingThreshold: 250,
  giftWrapEnabled: true,
  giftWrapPrice: 5,
  giftWrapVariantId: '',
  lowStockThreshold: 5,
  ukDeliveryLabel: '2-4 working days',
  internationalDeliveryLabel: '5-10 working days',
}

const careGuideFallback = {
  title: 'Jewellery Care Guide',
  summary: 'Care guidance is managed from ELURA CMS.',
  steps: [
    'Store each piece separately in its pouch.',
    'Avoid perfume, lotions, and water contact.',
    'Polish gently with a soft jewellery cloth.',
  ],
}

function AdminSettingsPage() {
  const [announcement, setAnnouncement] = useState(announcementFallback)
  const [cartDrawer, setCartDrawer] = useState(cartDrawerFallback)
  const [conversion, setConversion] = useState(conversionFallback)
  const [careGuide, setCareGuide] = useState(careGuideFallback)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsubscribeAnnouncement = subscribeCmsDoc(
      'announcement',
      announcementFallback,
      setAnnouncement,
    )
    const unsubscribeCart = subscribeCmsDoc(
      'cartDrawer',
      cartDrawerFallback,
      setCartDrawer,
    )
    const unsubscribeConversion = subscribeCmsDoc(
      'conversion',
      conversionFallback,
      setConversion,
    )
    const unsubscribeCareGuide = subscribeCmsDoc(
      'careGuide',
      careGuideFallback,
      setCareGuide,
    )

    return () => {
      unsubscribeAnnouncement()
      unsubscribeCart()
      unsubscribeConversion()
      unsubscribeCareGuide()
    }
  }, [])

  const saveSettings = async () => {
    setLoading(true)

    try {
      await Promise.all([
        saveCmsDoc('announcement', announcement),
        saveCmsDoc('cartDrawer', cartDrawer),
        saveCmsDoc('conversion', conversion),
        saveCmsDoc('careGuide', careGuide),
      ])
      window.alert('Homepage settings saved successfully.')
    } catch (error) {
      window.alert(error.message || 'Failed to save settings.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section-spacing">
      <div className="section-shell">
        <p className="section-eyebrow">Homepage CMS</p>
        <h1 className="mt-3 text-5xl">Announcement and Conversion Settings</h1>

        <div className="mt-12 grid gap-8 xl:grid-cols-2">
          <section className="rounded-[8px] border border-black/8 bg-white p-8">
            <h2 className="text-3xl">Announcement Bar</h2>
            <label className="mt-6 flex items-center gap-3">
              <input
                type="checkbox"
                checked={Boolean(announcement.enabled)}
                onChange={(event) => setAnnouncement((current) => ({ ...current, enabled: event.target.checked }))}
              />
              <span className="text-sm font-medium">Enable announcement bar</span>
            </label>
            <div className="mt-6 grid gap-5">
              <input value={announcement.message} onChange={(event) => setAnnouncement((current) => ({ ...current, message: event.target.value }))} className="input-shell" placeholder="Message" />
              <input value={announcement.linkUrl} onChange={(event) => setAnnouncement((current) => ({ ...current, linkUrl: event.target.value }))} className="input-shell" placeholder="Link URL" />
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm text-muted">
                  Background color
                  <input type="color" value={announcement.backgroundColor} onChange={(event) => setAnnouncement((current) => ({ ...current, backgroundColor: event.target.value }))} className="mt-3 h-12 w-full" />
                </label>
                <label className="text-sm text-muted">
                  Text color
                  <input type="color" value={announcement.textColor} onChange={(event) => setAnnouncement((current) => ({ ...current, textColor: event.target.value }))} className="mt-3 h-12 w-full" />
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-[8px] border border-black/8 bg-white p-8">
            <h2 className="text-3xl">Cart Drawer Messages</h2>
            <div className="mt-6 grid gap-5">
              <input value={cartDrawer.freeDeliveryMessage} onChange={(event) => setCartDrawer((current) => ({ ...current, freeDeliveryMessage: event.target.value }))} className="input-shell" placeholder="Free delivery message" />
              <input value={cartDrawer.secureCheckoutMessage} onChange={(event) => setCartDrawer((current) => ({ ...current, secureCheckoutMessage: event.target.value }))} className="input-shell" placeholder="Secure checkout message" />
              <input value={cartDrawer.easyReturnsMessage} onChange={(event) => setCartDrawer((current) => ({ ...current, easyReturnsMessage: event.target.value }))} className="input-shell" placeholder="Easy returns message" />
            </div>
          </section>

          <section className="rounded-[8px] border border-black/8 bg-white p-8">
            <h2 className="text-3xl">Conversion Settings</h2>
            <div className="mt-6 grid gap-5">
              <label className="flex items-center gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={Boolean(conversion.giftWrapEnabled)}
                  onChange={(event) => setConversion((current) => ({ ...current, giftWrapEnabled: event.target.checked }))}
                />
                Enable gift wrapping
              </label>
              <input type="number" min="0" value={conversion.freeShippingThreshold} onChange={(event) => setConversion((current) => ({ ...current, freeShippingThreshold: Number(event.target.value) }))} className="input-shell" placeholder="Free shipping threshold" />
              <input type="number" min="0" step="0.01" value={conversion.giftWrapPrice} onChange={(event) => setConversion((current) => ({ ...current, giftWrapPrice: Number(event.target.value) }))} className="input-shell" placeholder="Gift wrap price" />
              <input value={conversion.giftWrapVariantId} onChange={(event) => setConversion((current) => ({ ...current, giftWrapVariantId: event.target.value }))} className="input-shell" placeholder="Shopify gift wrap variant ID" />
              <input type="number" min="1" value={conversion.lowStockThreshold} onChange={(event) => setConversion((current) => ({ ...current, lowStockThreshold: Number(event.target.value) }))} className="input-shell" placeholder="Low stock threshold" />
              <input value={conversion.ukDeliveryLabel} onChange={(event) => setConversion((current) => ({ ...current, ukDeliveryLabel: event.target.value }))} className="input-shell" placeholder="UK delivery estimate" />
              <input value={conversion.internationalDeliveryLabel} onChange={(event) => setConversion((current) => ({ ...current, internationalDeliveryLabel: event.target.value }))} className="input-shell" placeholder="International delivery estimate" />
            </div>
          </section>

          <section className="rounded-[8px] border border-black/8 bg-white p-8 xl:col-span-2">
            <h2 className="text-3xl">Jewellery Care Guide</h2>
            <div className="mt-6 grid gap-5">
              <input value={careGuide.title} onChange={(event) => setCareGuide((current) => ({ ...current, title: event.target.value }))} className="input-shell" placeholder="Care guide title" />
              <textarea value={careGuide.summary} onChange={(event) => setCareGuide((current) => ({ ...current, summary: event.target.value }))} className="input-shell min-h-24 resize-y" placeholder="Care guide summary" />
              <textarea
                value={(careGuide.steps || []).join('\n')}
                onChange={(event) => setCareGuide((current) => ({
                  ...current,
                  steps: event.target.value.split('\n').map((item) => item.trim()).filter(Boolean),
                }))}
                className="input-shell min-h-36 resize-y"
                placeholder="One care step per line"
              />
            </div>
          </section>
        </div>

        <button type="button" onClick={saveSettings} disabled={loading} className="btn-primary mt-8">
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}

export default AdminSettingsPage
