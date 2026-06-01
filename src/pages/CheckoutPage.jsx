import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import SEO from '../components/SEO.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { pageSeo } from '../seo/seoConfig.js'

function CheckoutPage() {
  const { cartItems, checkout } = useStore()
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    async function redirectToShopifyCheckout() {
      if (!cartItems.length) {
        return
      }

      try {
        await checkout()
      } catch (checkoutError) {
        if (isActive) {
          setError(checkoutError.message)
        }
      }
    }

    redirectToShopifyCheckout()

    return () => {
      isActive = false
    }
  }, [cartItems.length, checkout])

  return (
    <div className="section-spacing">
      <SEO {...pageSeo.checkout} canonicalPath="/checkout" robots="noindex,follow" />
      <div className="section-shell max-w-3xl text-center">
        {cartItems.length ? (
          <>
            <SectionHeading
              eyebrow="Checkout"
              title="Opening secure Shopify checkout"
              description="Your cart is being prepared for Shopify's hosted checkout."
              align="center"
              as="h1"
            />
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-gold" />
            {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}
          </>
        ) : (
          <>
            <SectionHeading
              eyebrow="Checkout"
              title="Your cart is empty"
              description="Add a piece to your bag before starting checkout."
              align="center"
              as="h1"
            />
            <Link to="/shop" className="btn-primary">
              Return to Shop
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default CheckoutPage
