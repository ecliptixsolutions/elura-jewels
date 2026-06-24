import { Bell, ChevronDown, Minus, PackageCheck, Plus, ShieldCheck, Sparkles, Truck, Undo2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import SEO from '../components/SEO.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { formatCurrency } from '../data/siteData.js'
import { useStore } from '../context/StoreContext.jsx'
import { createBackInStockCustomer } from '../lib/api.js'
import { subscribeCmsDoc } from '../lib/cms.js'
import { estimateDelivery } from '../lib/conversion.js'
import { mapShopifyProduct } from '../lib/productMapping.js'
import {
  getJudgeMeProductId,
  getJudgeMeShopDomain,
  getReviewsProvider,
  loadJudgeMeScript,
} from '../lib/reviews.js'
import { getShopifyProductRecommendations } from '../lib/shopify.js'
import { trackConversionEvent } from '../lib/analytics.js'
import {
  breadcrumbSchema,
  productSchema,
} from '../seo/structuredData.js'

function ProductPage() {
  const { slug } = useParams()
  const {
    addToCart,
    buyNow,
    conversionSettings,
    isProductsLoading,
    products,
    recentlyViewedIds,
    trackRecentlyViewedProduct,
  } = useStore()
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

  return (
    <ProductPageDetail
      key={product.slug}
      product={product}
      addToCart={addToCart}
      buyNow={buyNow}
      conversionSettings={conversionSettings}
      relatedProducts={relatedProducts}
      recentlyViewedProducts={recentlyViewedIds
        .map((id) => products.find((item) => item.id === id || item.shopifyProductId === id))
        .filter((item) => item && item.slug !== product.slug)
        .slice(0, 8)}
      trackRecentlyViewedProduct={trackRecentlyViewedProduct}
    />
  )
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

function ProductPageDetail({
  product,
  addToCart,
  buyNow,
  conversionSettings,
  recentlyViewedProducts,
  relatedProducts,
  trackRecentlyViewedProduct,
}) {
  const [selectedImage, setSelectedImage] = useState(product.images[0])
  const [failedImages, setFailedImages] = useState({})
  const [selectedVariantId, setSelectedVariantId] = useState(product.variantId)
  const [quantity, setQuantity] = useState(1)
  const [recommendedProducts, setRecommendedProducts] = useState([])
  const [careGuide, setCareGuide] = useState(careGuideFallback)
  const [backInStockEmail, setBackInStockEmail] = useState('')
  const [backInStockStatus, setBackInStockStatus] = useState('')
  const [backInStockError, setBackInStockError] = useState('')
  const [isBackInStockSubmitting, setIsBackInStockSubmitting] = useState(false)
  const selectedVariant =
    product.variants?.find((variant) => variant.id === selectedVariantId) ||
    product.variants?.find((variant) => variant.availableForSale) ||
    product.variants?.[0]
  const selectedPrice = Number.parseFloat(selectedVariant?.price?.amount ?? product.price)
  const selectedQuantityAvailable = Number.isFinite(Number(selectedVariant?.quantityAvailable))
    ? Number(selectedVariant.quantityAvailable)
    : product.quantityAvailable
  const selectedProduct = {
    ...product,
    variantId: selectedVariant?.id || product.variantId,
    price: Number.isNaN(selectedPrice) ? product.price : selectedPrice,
    currencyCode: selectedVariant?.price?.currencyCode || product.currencyCode,
    sku: selectedVariant?.sku || product.sku,
    quantityAvailable: selectedQuantityAvailable,
  }
  const isAvailable = product.availableForSale !== false && selectedVariant?.availableForSale !== false
  const lowStockThreshold = Number(conversionSettings.lowStockThreshold || 0)
  const showLowStock =
    isAvailable &&
    Number.isFinite(Number(selectedQuantityAvailable)) &&
    Number(selectedQuantityAvailable) > 0 &&
    Number(selectedQuantityAvailable) <= lowStockThreshold
  const deliveryEstimate = estimateDelivery('GB')
  const internationalEstimate = estimateDelivery('US')
  const displayRecommendations = recommendedProducts.length ? recommendedProducts : relatedProducts
  const matchingJewellery = displayRecommendations
    .filter((item) => item.category === product.category)
    .slice(0, 4)
  const productSeoTitle = `${product.name} | Luxury ${product.category} Jewellery UK`
  const productSeoDescription = `${product.description} Shop ${product.name} from ELURA Jewels with premium UK delivery, refined gifting presentation, and elegant luxury jewellery styling.`
  const sku =
    selectedProduct.sku ||
    `ELURA-${String(product.id).replace(/[^a-z0-9-]/gi, '').toUpperCase()}`
  const availability = isAvailable ? 'In stock' : 'Out of stock'
  const currency = selectedProduct.currencyCode || 'GBP'
  const visibleImages = product.images.filter((image) => image && !failedImages[image])
  const fallbackImage = visibleImages[0] || product.images.find(Boolean) || ''
  const currentImage = visibleImages.includes(selectedImage) ? selectedImage : fallbackImage

  useEffect(() => {
    setSelectedImage(product.images[0])
    setFailedImages({})
    setSelectedVariantId(product.variantId)
    setQuantity(1)
  }, [product])

  useEffect(() => {
    if (currentImage && currentImage !== selectedImage) {
      setSelectedImage(currentImage)
    }
  }, [currentImage, selectedImage])

  const markImageFailed = (image) => {
    setFailedImages((current) => ({
      ...current,
      [image]: true,
    }))
  }

  useEffect(() => {
    trackRecentlyViewedProduct(product.shopifyProductId || product.id)
    trackConversionEvent('product_view', {
      product_id: product.shopifyProductId || product.id,
      item_name: product.name,
      item_category: product.category,
      currency: product.currencyCode || 'GBP',
      value: product.price,
    })
  }, [product, trackRecentlyViewedProduct])

  useEffect(() => {
    let isActive = true

    async function loadRecommendations() {
      try {
        const recommendations = await getShopifyProductRecommendations(product.shopifyProductId)

        if (isActive) {
          setRecommendedProducts(
            recommendations
              .map(mapShopifyProduct)
              .filter((item) => item.slug !== product.slug)
              .slice(0, 8),
          )
        }
      } catch {
        if (isActive) {
          setRecommendedProducts([])
        }
      }
    }

    loadRecommendations()

    return () => {
      isActive = false
    }
  }, [product.shopifyProductId, product.slug])

  useEffect(() => {
    const unsubscribe = subscribeCmsDoc(
      'careGuide',
      careGuideFallback,
      setCareGuide,
    )

    return unsubscribe
  }, [])

  const handleAddToCart = () => addToCart(selectedProduct, quantity)
  const handleBuyNow = () => buyNow(selectedProduct, quantity)
  const handleBackInStockSubmit = async (event) => {
    event.preventDefault()
    setBackInStockStatus('')
    setBackInStockError('')
    setIsBackInStockSubmitting(true)

    try {
      await createBackInStockCustomer({
        email: backInStockEmail,
        productHandle: product.slug,
        productTitle: product.name,
        variantId: selectedProduct.variantId,
      })
      setBackInStockStatus('We will email you when this piece is available again.')
      setBackInStockEmail('')
    } catch (error) {
      setBackInStockError(error.message)
    } finally {
      setIsBackInStockSubmitting(false)
    }
  }

  return (
    <div className="section-spacing max-lg:pb-28">
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
          <section className="grid gap-4 lg:sticky lg:top-28 lg:grid-cols-[6.5rem_1fr] lg:self-start">
            <div className="order-2 flex gap-3 lg:order-1 lg:flex-col">
              {visibleImages.map((image, index) => (
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
                    onError={() => markImageFailed(image)}
                    className="h-24 w-20 rounded-[14px] object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="order-1 overflow-hidden rounded-[18px] bg-linen/60 lg:order-2">
              <div className="group relative overflow-hidden">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={`${product.name} luxury ${product.category.toLowerCase()} by ELURA Jewels`}
                    fetchPriority={currentImage === product.images[0] ? 'high' : 'auto'}
                    decoding="async"
                    width="920"
                    height="760"
                    onError={() => markImageFailed(currentImage)}
                    className="h-[24rem] w-full object-contain bg-linen/35 transition duration-700 group-hover:scale-105 sm:h-[32rem] sm:object-cover lg:h-[38rem]"
                  />
                ) : (
                  <div className="flex h-[24rem] items-center justify-center bg-linen/35 px-8 text-center text-sm text-muted sm:h-[32rem] lg:h-[38rem]">
                    Product image unavailable
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="lg:sticky lg:top-28">
            <p className="section-eyebrow">{product.category}</p>
            <h1 className="mt-4 text-4xl sm:text-5xl">{product.name}</h1>
            <p className="mt-4 text-2xl font-semibold text-ink">
              {formatCurrency(selectedProduct.price)}
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.24em] text-muted">
              SKU {sku} &middot; {availability} &middot; {currency}
            </p>
            {showLowStock ? (
              <p className="mt-4 inline-flex rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-gold">
                Only {selectedQuantityAvailable} left in stock
              </p>
            ) : null}
            <p className="mt-6 text-base text-muted sm:text-lg">{product.description}</p>

            <div className="mt-8 space-y-6 border-t border-black/8 pt-7">
              {product.variants?.length > 1 ? (
                <label className="block">
                  <span className="section-eyebrow">Variant</span>
                  <span className="relative mt-3 block">
                    <select
                      value={selectedVariant?.id || ''}
                      onChange={(event) => setSelectedVariantId(event.target.value)}
                      className="input-shell appearance-none pr-10"
                    >
                      {product.variants.map((variant) => (
                        <option key={variant.id} value={variant.id}>
                          {variant.title} - {formatCurrency(Number(variant.price?.amount || product.price))}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  </span>
                </label>
              ) : null}

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
                  onClick={handleAddToCart}
                  className="btn-primary"
                  disabled={!isAvailable}
                >
                  {isAvailable ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="btn-secondary"
                  disabled={!isAvailable}
                >
                  Buy Now
                </button>
              </div>
            </div>

            <TrustBadges />

            <div className="mt-8 grid gap-3 border-t border-black/8 pt-7 text-sm text-muted sm:grid-cols-2">
              <div className="rounded-[8px] bg-white/65 p-4">
                <p className="font-semibold text-ink">{deliveryEstimate.label}</p>
                <p className="mt-1">{conversionSettings.ukDeliveryLabel || deliveryEstimate.text}</p>
              </div>
              <div className="rounded-[8px] bg-white/65 p-4">
                <p className="font-semibold text-ink">{internationalEstimate.label}</p>
                <p className="mt-1">{conversionSettings.internationalDeliveryLabel || internationalEstimate.text}</p>
              </div>
            </div>

            {!isAvailable ? (
              <form
                onSubmit={handleBackInStockSubmit}
                className="mt-8 rounded-[8px] border border-black/8 bg-white/75 p-5"
              >
                <p className="section-eyebrow">Back In Stock</p>
                <p className="mt-3 text-sm text-muted">
                  Join the Shopify notification list for this piece.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    value={backInStockEmail}
                    onChange={(event) => setBackInStockEmail(event.target.value)}
                    className="input-shell"
                    placeholder="Email address"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isBackInStockSubmitting}
                    className="btn-secondary shrink-0"
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Notify Me
                  </button>
                </div>
                {backInStockStatus ? <p className="mt-3 text-sm text-emerald">{backInStockStatus}</p> : null}
                {backInStockError ? <p className="mt-3 text-sm text-red-600">{backInStockError}</p> : null}
              </form>
            ) : null}

            <div className="mt-8 border-t border-black/8 pt-7">
              <p className="section-eyebrow">Additional Product Info</p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {product.details.map((detail, index) => (
                  <li key={`${product.id}-detail-${index}`}>{detail}</li>
                ))}
              </ul>
            </div>

            <details className="mt-8 border-t border-black/8 pt-7">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-left">
                <span>
                  <span className="section-eyebrow">Care</span>
                  <span className="mt-2 block text-xl font-semibold text-ink">{careGuide.title}</span>
                </span>
                <Sparkles className="h-5 w-5 text-gold" />
              </summary>
              <p className="mt-4 text-sm text-muted">{careGuide.summary}</p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {(careGuide.steps || []).map((step, index) => (
                  <li key={`${step}-${index}`}>{step}</li>
                ))}
              </ul>
            </details>
          </section>
        </div>

        <ReviewsIntegrationSlot product={product} />

        <section className="mt-16">
          <SectionHeading
            eyebrow="Shopify Recommendations"
            title="Related products"
            description="Recommendations are requested from Shopify and fall back to matching collection pieces."
          />
          <div
  className="
    flex
    gap-3
    overflow-x-auto
    snap-x
    snap-mandatory
    scrollbar-hide
    pb-2

    xl:grid
    xl:grid-cols-4
    xl:gap-6
    xl:overflow-visible
  "
>
  {displayRecommendations.map((relatedProduct, index) => (
    <div
      key={`${relatedProduct.id}-${relatedProduct.slug || index}`}
      className="
        w-[55%]
        sm:w-[220px]
        flex-shrink-0
        snap-start

        xl:w-auto
      "
    >
      <ProductCard product={relatedProduct} />
    </div>
  ))}
</div>
        </section>

        {matchingJewellery.length ? (
          <section className="mt-16">
            <SectionHeading
              eyebrow="Matching Jewellery"
              title="Complete the set"
              description="Pieces from the same Shopify product family."
            />
            <ProductScroller products={matchingJewellery} />
          </section>
        ) : null}

        {recentlyViewedProducts.length ? (
          <section className="mt-16">
            <SectionHeading
              eyebrow="Recently Viewed"
              title="Your latest ELURA pieces"
              description="Stored locally on this device, most recent first."
            />
            <ProductScroller products={recentlyViewedProducts} />
          </section>
        ) : null}
      </div>

      {isAvailable ? (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/8 bg-ivory/95 px-4 py-3 shadow-[0_-12px_36px_rgba(27,24,19,0.12)] backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{product.name}</p>
              <p className="text-sm text-muted">{formatCurrency(selectedProduct.price)}</p>
            </div>
            <button type="button" onClick={handleAddToCart} className="btn-primary shrink-0 px-5">
              Add
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function TrustBadges() {
  const badges = [
    { label: 'Secure Shopify Checkout', icon: ShieldCheck },
    { label: 'Free UK Delivery', icon: Truck },
    { label: 'Easy Returns', icon: Undo2 },
    { label: 'Authentic Jewellery', icon: PackageCheck },
  ]

  return (
    <div className="mt-8 grid grid-cols-2 gap-3 border-t border-black/8 pt-7">
      {badges.map((badge) => {
        const BadgeIcon = badge.icon

        return (
          <div key={badge.label} className="rounded-[8px] bg-white/70 p-4">
            <BadgeIcon className="h-5 w-5 text-gold" />
            <p className="mt-3 text-sm font-semibold text-ink">{badge.label}</p>
          </div>
        )
      })}
    </div>
  )
}

function ProductScroller({ products }) {
  return (
    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 no-scrollbar md:grid md:grid-cols-4 md:overflow-visible">
      {products.map((product, index) => (
        <div key={`${product.id}-${product.slug || index}`} className="w-[64%] flex-none snap-start sm:w-[260px] md:w-auto">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}

function ReviewsIntegrationSlot({ product }) {
  const provider = getReviewsProvider()
  const shopifyProductId = product.shopifyProductId || product.id
  const judgeMeProductId = getJudgeMeProductId(shopifyProductId)

  useEffect(() => {
    if (provider === 'judgeme' || provider === 'judge.me') {
      loadJudgeMeScript()
    }
  }, [provider])

  if (provider === 'judgeme' || provider === 'judge.me') {
    return (
      <section className="mt-16 rounded-[8px] border border-black/8 bg-white/60 p-7">
        <div
          className="jdgm-widget jdgm-review-widget"
          data-id={judgeMeProductId}
          data-shop-domain={getJudgeMeShopDomain()}
          data-product-title={product.name}
          data-product-url={`/product/${product.slug}`}
        />
      </section>
    )
  }

  if (provider === 'loox') {
    return (
      <section className="mt-16 rounded-[8px] border border-black/8 bg-white/60 p-7">
        <div
          id="looxReviews"
          data-product-id={shopifyProductId}
          data-product-title={product.name}
        />
      </section>
    )
  }

  if (provider === 'shopify') {
    return (
      <section className="mt-16 rounded-[8px] border border-black/8 bg-white/60 p-7">
        <div
          id="shopify-product-reviews"
          data-id={shopifyProductId}
          data-product-title={product.name}
        />
      </section>
    )
  }

  return null
}

export default ProductPage
