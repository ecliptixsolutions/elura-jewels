import { Minus, Plus, Star } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import SEO from '../components/SEO.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { formatCurrency } from '../data/siteData.js'
import { useStore } from '../context/StoreContext.jsx'
import {
  breadcrumbSchema,
  productSchema,
} from '../seo/structuredData.js'

function ProductPage() {
  const { slug } = useParams()
  const { addToCart, products, isProductsLoading } = useStore()
  const product = products.find((item) => item.slug === slug)

  if (!product && isProductsLoading) {
    return (
      <div className="section-spacing">
        <SEO
          title="Loading Luxury Jewellery Product"
          description="Fetching the latest ELURA Jewels luxury jewellery product details."
          canonicalPath={`/product/${slug}`}
          robots="noindex,follow"
        />
        <div className="section-shell">
          <SectionHeading
            eyebrow="Product"
            title="Loading product"
            description="Fetching the latest product details from ELURA."
            as="h1"
          />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="section-spacing">
        <SEO
          title="Luxury Jewellery Product Not Found"
          description="This ELURA Jewels product is not available. Return to the shop to browse luxury jewellery in the UK."
          canonicalPath="/shop"
          robots="noindex,follow"
        />
        <div className="section-shell">
          <SectionHeading
            eyebrow="Product"
            title="This product could not be found"
            description="Please return to the shop and continue browsing the collection."
            as="h1"
          />
          <Link to="/shop" className="btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  const relatedProducts = products
    .filter((item) => item.category === product.category && item.slug !== product.slug)
    .slice(0, 4)

  return <ProductPageDetail key={product.slug} product={product} addToCart={addToCart} relatedProducts={relatedProducts} />
}

function ProductPageDetail({ product, addToCart, relatedProducts }) {
  const [selectedImage, setSelectedImage] = useState(product.images[0])
  const [quantity, setQuantity] = useState(1)
  const reviewCount = product.reviews?.length ?? 0
  const averageRating = reviewCount
    ? (
        product.reviews.reduce((total, review) => total + Number(review.rating || 0), 0) /
        reviewCount
      ).toFixed(1)
    : null
  const productSeoTitle = `${product.name} | Luxury ${product.category} Jewellery UK`
  const productSeoDescription = `${product.description} Shop ${product.name} from ELURA Jewels with premium UK delivery, refined gifting presentation, and elegant luxury jewellery styling.`
  const sku =
    product.sku ||
    `ELURA-${String(product.id).replace(/[^a-z0-9-]/gi, '').toUpperCase()}`
  const availability = product.availableForSale === false ? 'Out of stock' : 'In stock'
  const currency = product.currencyCode || 'GBP'

  return (
    <div className="section-spacing">
      <SEO
        title={productSeoTitle}
        description={productSeoDescription}
        keywords={[
          product.name,
          `luxury ${product.category.toLowerCase()} uk`,
          'luxury jewellery uk',
          'designer jewellery uk',
          'premium jewellery uk',
          'gold jewellery london',
          'bridal jewellery uk',
        ]}
        image={product.images[0]}
        type="product"
        canonicalPath={`/product/${product.slug}`}
        preloadImages={[product.images[0]]}
        structuredData={[
          productSchema(product),
          breadcrumbSchema([
            {
              name: 'Home',
              path: '/',
            },
            {
              name: 'Shop',
              path: '/shop',
            },
            {
              name: product.name,
              path: `/product/${product.slug}`,
            },
          ]),
        ]}
      />
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="grid gap-4 lg:grid-cols-[6.5rem_1fr]">
            <div className="order-2 flex gap-3 lg:order-1 lg:flex-col">
              {product.images.map((image, index) => (
                <button
                  key={`${product.id}-image-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`overflow-hidden rounded-[14px] transition ${
                    image === selectedImage
                      ? 'ring-1 ring-gold'
                      : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} luxury ${product.category.toLowerCase()} detail ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="h-24 w-20 rounded-[14px] object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="order-1 overflow-hidden rounded-[18px] bg-linen/60 lg:order-2">
              <div className="group relative overflow-hidden">
                <img
                  src={selectedImage}
                  alt={`${product.name} luxury ${product.category.toLowerCase()} by ELURA Jewels`}
                  fetchPriority={selectedImage === product.images[0] ? 'high' : 'auto'}
                  decoding="async"
                  width="920"
                  height="760"
                  className="h-[24rem] w-full object-contain bg-linen/35 transition duration-700 group-hover:scale-105 sm:h-[32rem] sm:object-cover lg:h-[38rem]"
                />
              </div>
            </div>
          </section>

          <section className="lg:sticky lg:top-28">
            <p className="section-eyebrow">{product.category}</p>
            <h1 className="mt-4 text-4xl sm:text-5xl">{product.name}</h1>
            <p className="mt-4 text-2xl font-semibold text-ink">
              {formatCurrency(product.price)}
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.24em] text-muted">
              SKU {sku} &middot; {availability} &middot; {currency}
            </p>
            {averageRating ? (
              <p className="mt-3 text-sm text-muted">
                Rated {averageRating}/5 from {reviewCount} customer review
                {reviewCount === 1 ? '' : 's'}.
              </p>
            ) : null}
            <p className="mt-6 text-base text-muted sm:text-lg">{product.description}</p>

            <div className="mt-8 space-y-6 border-t border-black/8 pt-7">
              <div>
                <p className="section-eyebrow">Material Details</p>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {product.materials.map((material, index) => (
                    <li key={`${product.id}-material-${index}`}>{material}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex w-fit items-center rounded-full border border-black/10 bg-white/70">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    className="inline-flex h-11 w-11 items-center justify-center"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="inline-flex min-w-12 items-center justify-center text-sm">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => current + 1)}
                    className="inline-flex h-11 w-11 items-center justify-center"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(product, quantity)}
                  className="btn-primary"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={() => addToCart(product, quantity)}
                  className="btn-secondary"
                >
                  Buy Now
                </button>
              </div>
            </div>

            <div className="mt-8 border-t border-black/8 pt-7">
              <p className="section-eyebrow">Additional Product Info</p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {product.details.map((detail, index) => (
                  <li key={`${product.id}-detail-${index}`}>{detail}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <section className="mt-16">
          <SectionHeading
            eyebrow="Customer Reviews"
            title="What customers are saying"
            description="Recent feedback from ELURA customers."
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {product.reviews.map((review) => (
              <article
                key={`${review.name}-${review.date}`}
                className="rounded-[18px] bg-white/55 p-7"
              >
                <div className="flex items-center gap-1 text-gold">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-base text-ink">{review.content}</p>
                <div className="mt-5 text-sm text-muted">
                  {review.name} - {review.date}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading
            eyebrow="Related Products"
            title="You may also like"
            description="More from the ELURA collection in a similar style."
          />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default ProductPage
