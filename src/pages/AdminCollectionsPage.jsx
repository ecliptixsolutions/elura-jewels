import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { saveCmsDoc, subscribeCmsDoc } from '../lib/cms.js'
import { getShopifyCollections } from '../lib/shopify.js'

const collectionsFallback = {
  enabled: true,
  sectionTitle: 'Explore Our Collections',
  sectionSubtitle: 'Discover luxury jewellery collections curated for every occasion.',
  maximumCollections: 6,
  displayStyle: 'editorial',
  items: [],
}

function AdminCollectionsPage() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState(collectionsFallback)
  const [shopifyCollections, setShopifyCollections] = useState([])
  const [shopifyError, setShopifyError] = useState('')

  useEffect(() => {
    const unsubscribe = subscribeCmsDoc(
      'collections',
      collectionsFallback,
      setSettings,
    )

    return unsubscribe
  }, [])

  useEffect(() => {
    let isActive = true

    async function loadShopifyCollections() {
      try {
        const collections = await getShopifyCollections()

        if (isActive) {
          setShopifyCollections(collections)
        }
      } catch (error) {
        if (isActive) {
          setShopifyError(error.message)
        }
      }
    }

    loadShopifyCollections()

    return () => {
      isActive = false
    }
  }, [])

  const updateSetting = (field, value) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const saveCollections = async () => {
    setLoading(true)

    try {
      await saveCmsDoc('collections', {
        enabled: Boolean(settings.enabled),
        sectionTitle: settings.sectionTitle.trim(),
        sectionSubtitle: settings.sectionSubtitle.trim(),
        maximumCollections: Number(settings.maximumCollections || 6),
        displayStyle: settings.displayStyle,
        items: shopifyCollections.map((collection) => ({
          id: collection.id,
          handle: collection.handle,
          title: collection.title,
        })),
      })

      window.alert('Collections CMS settings saved successfully.')
    } catch (error) {
      window.alert(error.message || 'Failed to save collections settings.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section-spacing">
      <div className="section-shell">
        <p className="section-eyebrow">Collections CMS</p>
        <h1 className="mt-3 text-5xl">Homepage Collections</h1>
        <p className="mt-4 max-w-3xl text-muted">
          Collections are synced from Shopify. This page controls how the homepage collection section is presented.
        </p>

        <div className="mt-12 grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[8px] border border-black/8 bg-white p-8">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={Boolean(settings.enabled)}
                onChange={(event) => updateSetting('enabled', event.target.checked)}
              />
              <span className="text-sm font-medium">Enable homepage collections section</span>
            </label>

            <div className="mt-8 grid gap-6">
              <input
                value={settings.sectionTitle}
                onChange={(event) => updateSetting('sectionTitle', event.target.value)}
                className="input-shell"
                placeholder="Section title"
              />
              <textarea
                value={settings.sectionSubtitle}
                onChange={(event) => updateSetting('sectionSubtitle', event.target.value)}
                className="input-shell min-h-24 resize-none"
                placeholder="Section subtitle"
              />
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="text-sm text-muted">
                  Maximum collections
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={settings.maximumCollections}
                    onChange={(event) => updateSetting('maximumCollections', event.target.value)}
                    className="input-shell mt-2"
                  />
                </label>
                <label className="text-sm text-muted">
                  Display style
                  <select
                    value={settings.displayStyle}
                    onChange={(event) => updateSetting('displayStyle', event.target.value)}
                    className="input-shell mt-2"
                  >
                    <option value="editorial">Editorial</option>
                    <option value="grid">Grid</option>
                  </select>
                </label>
              </div>
            </div>

            <button type="button" onClick={saveCollections} disabled={loading} className="btn-primary mt-8">
              {loading ? 'Saving...' : 'Save Collections CMS'}
            </button>
          </div>

          <div className="rounded-[8px] border border-black/8 bg-white p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-eyebrow">Shopify Sync</p>
                <h2 className="mt-3 text-3xl">Synced Collections</h2>
              </div>
              <Link to="/collections" className="line-link">
                View Page
              </Link>
            </div>

            {shopifyError ? <p className="mt-6 text-sm text-red-600">{shopifyError}</p> : null}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {shopifyCollections.map((collection) => (
                <article key={collection.id} className="rounded-[8px] border border-black/8 p-4">
                  {collection.image ? (
                    <img
                      src={collection.image}
                      alt={collection.altText || collection.title}
                      className="h-36 w-full rounded-[8px] object-cover"
                    />
                  ) : null}
                  <h3 className="mt-4 text-xl">{collection.title}</h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">{collection.handle}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminCollectionsPage
