import { Link, Navigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import SEO from '../components/SEO.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { pageSeo } from '../seo/seoConfig.js'

function WishlistPage() {
  const { user, wishlistProducts } = useStore()

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          redirectTo: '/wishlist',
          notice: 'Please login to add items to wishlist',
        }}
      />
    )
  }

  return (
    <div className="section-spacing">
      <SEO {...pageSeo.wishlist} canonicalPath="/wishlist" />
      <div className="section-shell">
        <SectionHeading
          eyebrow="Wishlist"
          title="Saved pieces"
          description="Keep track of favourite ELURA pieces and return when you are ready."
          as="h1"
        />

        {wishlistProducts.length === 0 ? (
          <div className="mx-auto max-w-2xl border-t border-black/8 pt-10 text-center">
            <p className="text-lg text-muted">Your wishlist is currently empty.</p>
            <Link to="/shop" className="btn-primary mt-6">
              Browse the Collection
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage
