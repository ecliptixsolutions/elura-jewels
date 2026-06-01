import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import SEO from '../components/SEO.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { collectionCards } from '../data/siteData.js'
import { getShopifyCollections } from '../lib/shopify.js'
import { pageSeo } from '../seo/seoConfig.js'
import {
  breadcrumbSchema,
  collectionSchema,
} from '../seo/structuredData.js'

function CollectionsPage() {
  const { homeFeaturedProducts } = useStore()
  const [collections, setCollections] = useState([])

  useEffect(() => {
    let isActive = true

    async function loadCollections() {
      try {
        const shopifyCollections = await getShopifyCollections()

        if (isActive) {
          setCollections(shopifyCollections)
        }
      } catch (error) {
        console.error('Failed to load Shopify collections', error)
      }
    }

    loadCollections()

    return () => {
      isActive = false
    }
  }, [])

  const visibleCollections = collections.length ? collections : collectionCards

  return (
    <div className="section-spacing">
      <SEO
        {...pageSeo.collections}
        canonicalPath="/collections"
        structuredData={[
          breadcrumbSchema([
            {
              name: 'Home',
              path: '/',
            },
            {
              name: 'Collections',
              path: '/collections',
            },
          ]),
          collectionSchema(
            'Luxury Jewellery Collections UK',
            pageSeo.collections.description,
            homeFeaturedProducts,
          ),
        ]}
      />
      <div className="section-shell">
        <SectionHeading
          eyebrow="Collections"
          title="Curated categories with a cleaner route into product discovery"
          description="Explore ELURA by Shopify collection, then move directly into product pages built for easier browsing and clearer detail."
          as="h1"
        />

        <div className="grid auto-rows-fr items-stretch gap-6 lg:grid-cols-2">
          {visibleCollections.map((card, index) => (
            <Link
              key={`${card.handle || card.href}-${index}`}
              to={card.handle ? `/collections/${card.handle}` : card.href}
              className={`group flex h-full flex-col overflow-hidden rounded-[8px] ${
                visibleCollections.length % 2 === 1 && index === visibleCollections.length - 1
                  ? 'lg:col-span-2 lg:mx-auto lg:max-w-[32rem]'
                  : ''
              }`}
            >
              <div className="aspect-[4/5] overflow-hidden rounded-[8px] bg-linen/60">
                <img
                  src={card.image || card.url}
                  alt={card.altText || `${card.title} luxury jewellery collection by ELURA Jewels`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  decoding="async"
                  width="720"
                  height="900"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                />
              </div>

              <div className="flex flex-1 flex-col px-1 py-5">
                <h2 className="text-3xl">{card.title}</h2>
                <p className="mt-3 text-sm text-muted">{card.description || card.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CollectionsPage
