import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import ProductCard from '../components/ProductCard.jsx'
import SEO from '../components/SEO.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { getShopifyCollectionByHandle } from '../lib/shopify.js'
import { mapShopifyProduct } from '../lib/productMapping.js'

function CollectionPage() {
  const { handle } = useParams()
  const [collection, setCollection] = useState(null)
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadCollection() {
      setIsLoading(true)
      setError('')

      try {
        const shopifyCollection = await getShopifyCollectionByHandle(handle)

        if (!isActive) return

        if (!shopifyCollection) {
          setCollection(null)
          setProducts([])
          return
        }

        setCollection(shopifyCollection)
        setProducts(
          shopifyCollection.products?.edges?.map((edge) => mapShopifyProduct(edge.node)) ?? [],
        )
      } catch (loadError) {
        if (isActive) {
          setError(loadError.message)
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadCollection()

    return () => {
      isActive = false
    }
  }, [handle])

  if (isLoading) {
    return (
      <div className="section-spacing">
        <SEO title="Loading Collection" description="Loading ELURA collection." canonicalPath={`/collections/${handle}`} robots="noindex,follow" />
        <div className="section-shell">
          <SectionHeading eyebrow="Collection" title="Loading collection" description="Fetching the latest Shopify collection." as="h1" />
        </div>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="section-spacing">
        <SEO title="Collection Not Found" description="This ELURA collection could not be found." canonicalPath="/collections" robots="noindex,follow" />
        <div className="section-shell">
          <SectionHeading eyebrow="Collection" title="This collection could not be found" description={error || 'Please return to all collections.'} as="h1" />
          <Link to="/collections" className="btn-primary">
            View Collections
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="section-spacing">
      <SEO
        title={`${collection.title} | ELURA Jewels`}
        description={collection.description || `Shop ${collection.title} by ELURA Jewels.`}
        image={collection.image?.url}
        canonicalPath={`/collections/${collection.handle}`}
      />
      <div className="section-shell">
        <SectionHeading
          eyebrow="Collection"
          title={collection.title}
          description={collection.description || 'Explore the latest pieces in this Shopify collection.'}
          as="h1"
        />

        {collection.image?.url ? (
          <img
            src={collection.image.url}
            alt={collection.image.altText || `${collection.title} collection`}
            className="mb-12 h-[22rem] w-full rounded-[8px] object-cover"
            width="1400"
            height="520"
          />
        ) : null}

        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {!products.length ? (
          <div className="py-16 text-center text-muted">
            No products are currently assigned to this Shopify collection.
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default CollectionPage
