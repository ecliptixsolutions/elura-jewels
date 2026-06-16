import { X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

const dismissedKey = 'elura-social-proof-dismissed'

function SocialProofNotification() {
  const { products, recentlyViewedIds } = useStore()
  const [isVisible, setIsVisible] = useState(false)
  const featuredProduct = useMemo(() => {
    const recentlyViewed = recentlyViewedIds
      .map((id) => products.find((product) => product.id === id || product.shopifyProductId === id))
      .filter(Boolean)

    return recentlyViewed[0] || products.find((product) => product.availableForSale !== false)
  }, [products, recentlyViewedIds])

  useEffect(() => {
    if (!featuredProduct || window.sessionStorage.getItem(dismissedKey)) {
      return undefined
    }

    const timerId = window.setTimeout(() => {
      setIsVisible(true)
      window.sessionStorage.setItem(dismissedKey, 'true')
    }, window.matchMedia('(max-width: 767px)').matches ? 45000 : 22000)

    return () => window.clearTimeout(timerId)
  }, [featuredProduct])

  if (!isVisible || !featuredProduct) {
    return null
  }

  return (
    <aside className="fixed bottom-24 left-4 right-20 z-40 rounded-[8px] border border-black/8 bg-ivory/95 p-3 shadow-[0_18px_50px_rgba(27,24,19,0.14)] backdrop-blur md:left-4 md:right-auto md:max-w-xs md:p-4">
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
        aria-label="Close social proof"
      >
        <X className="h-4 w-4" />
      </button>
      <p className="section-eyebrow">Trending Now</p>
      <Link to={`/product/${featuredProduct.slug}`} className="mt-3 flex gap-3">
        <img
          src={featuredProduct.images[0]}
          alt={featuredProduct.name}
          className="h-16 w-14 rounded-[8px] object-cover"
          loading="lazy"
        />
        <span>
          <span className="block text-sm font-semibold text-ink">{featuredProduct.name}</span>
          <span className="mt-1 block text-xs text-muted">
            Recently viewed and available from Shopify.
          </span>
        </span>
      </Link>
    </aside>
  )
}

export default SocialProofNotification
