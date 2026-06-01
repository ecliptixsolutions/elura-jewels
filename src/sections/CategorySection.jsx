import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import Reveal from '../components/Reveal.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { getShopifyCollections } from '../lib/shopifyCollections.js'
import { subscribeCmsDoc } from '../lib/cms.js'

const collectionsFallback = {
  enabled: true,
  sectionTitle: 'Explore Our Collections',
  sectionSubtitle: 'Discover luxury jewellery collections curated for every occasion.',
  maximumCollections: 6,
  displayStyle: 'editorial',
  items: [],
}

function CategorySection({ cards: fallbackCards = [] }) {
  const [shopifyCollections, setShopifyCollections] = useState([])
  const [settings, setSettings] = useState(collectionsFallback)

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

    async function loadCollections() {
      try {
        const collections = await getShopifyCollections()

        if (isActive) {
          setShopifyCollections(collections)
        }
      } catch {
        // Keep fallback collections when Shopify is unavailable.
      }
    }

    loadCollections()

    return () => {
      isActive = false
    }
  }, [])

  const cards = useMemo(() => {
    const cmsItems = settings.items ?? []
    const cmsByHandle = new Map(cmsItems.map((item) => [item.handle || item.key, item]))
    const source = shopifyCollections.length ? shopifyCollections : fallbackCards

    return source
      .map((collection, index) => {
        const cmsItem = cmsByHandle.get(collection.handle) ?? cmsItems[index] ?? {}

        return {
          ...collection,
          ...cmsItem,
          image: collection.image || cmsItem.url || cmsItem.image || '',
          handle: collection.handle || cmsItem.handle || cmsItem.key,
          title: collection.title || cmsItem.title,
        }
      })
      .filter((collection) => collection.image && collection.handle && collection.title)
      .slice(0, Number(settings.maximumCollections || 6))
  }, [fallbackCards, settings.items, settings.maximumCollections, shopifyCollections])

  if (!settings.enabled || !cards.length) return null

  const isCompact = settings.displayStyle === 'grid'

  return (
    <section className="section-spacing" id="home-collections">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Collections"
          title={settings.sectionTitle}
          description={settings.sectionSubtitle}
        />

        <div className={isCompact ? 'grid auto-rows-fr items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3' : 'grid auto-rows-fr items-stretch gap-5 lg:grid-cols-2'}>
          {cards.map((card, index) => (
            <Reveal key={card.id || card.handle} delay={index * 80} className="h-full">
              <Link
                to={`/collections/${card.handle}`}
                className="group flex h-full flex-col overflow-hidden rounded-[8px]"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-[8px] bg-linen/60 sm:aspect-[5/6] lg:aspect-[4/5]">
                  {card.type === 'video' ? (
                    <video
                      src={card.url || card.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <img
                      src={card.image || card.url}
                      alt={`${card.title} collection by ELURA Jewels`}
                      loading="lazy"
                      decoding="async"
                      width="880"
                      height="680"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col px-1 py-5">
                  <h3 className="text-2xl">{card.title}</h3>
                  {card.description || card.subtitle ? (
                    <p className="mt-2 text-sm text-muted">{card.description || card.subtitle}</p>
                  ) : null}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySection
