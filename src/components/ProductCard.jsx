import { Heart } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { formatCurrency } from '../data/siteData.js'
import { useStore } from '../context/StoreContext.jsx'

function ProductCard({ product }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, wishlistIds, toggleWishlist } = useStore()
  const isWishlisted = wishlistIds.includes(product.id)

  return (
    <article className="group">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-[16px] bg-linen/70">
          <img
            src={product.images[0]}
            alt={`${product.name} luxury ${product.category.toLowerCase()} by ELURA Jewels`}
            loading="lazy"
            decoding="async"
            width="480"
            height="600"
            className="aspect-[4/5] w-full object-cover transition-[transform,opacity] duration-300 md:duration-700 md:group-hover:scale-[1.04] md:group-hover:opacity-0"
          />
          <img
            src={product.images[1]}
            alt={`${product.name} alternate luxury jewellery view`}
            loading="lazy"
            decoding="async"
            width="480"
            height="600"
            className="pointer-events-none absolute inset-0 aspect-[4/5] h-full w-full object-cover opacity-0 transition-[transform,opacity] duration-300 md:duration-700 md:group-hover:scale-[1.04] md:group-hover:opacity-100"
          />
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault()

              if (!user) {
                navigate('/login', {
                  state: {
                    redirectTo: `${location.pathname}${location.search}`,
                    notice: 'Please login to add items to wishlist',
                  },
                })
                return
              }

              toggleWishlist(product.id)
            }}
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center text-white drop-shadow-[0_6px_12px_rgba(0,0,0,0.28)] transition duration-300 hover:scale-110 hover:text-gold"
            aria-label="Toggle wishlist"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current text-gold' : ''}`} />
          </button>
        </div>

        <div className="flex items-start justify-between gap-4 px-1 py-5">
          <h3 className="product-name-animated max-w-[15rem] text-lg font-medium leading-snug text-ink">
            {product.name}
          </h3>
          <p className="pt-0.5 text-sm font-semibold text-ink">{formatCurrency(product.price)}</p>
        </div>
      </Link>
    </article>
  )
}

export default ProductCard
