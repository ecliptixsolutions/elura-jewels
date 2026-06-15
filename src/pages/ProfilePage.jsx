import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import SEO from '../components/SEO.jsx'
import ProductCard from '../components/ProductCard.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { getCustomerOrders } from '../lib/api.js'
import { pageSeo } from '../seo/seoConfig.js'

function formatMoney(money) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: money?.currencyCode || 'GBP',
    maximumFractionDigits: 2,
  }).format(Number(money?.amount || 0))
}

function formatDate(value) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function ProfilePage() {
  const { products, recentlyViewedIds, user, wishlistProducts, logout } = useStore()
  const [orders, setOrders] = useState([])
  const [ordersPageInfo, setOrdersPageInfo] = useState({
    hasNextPage: false,
    endCursor: null,
  })
  const [ordersError, setOrdersError] = useState('')
  const [isOrdersLoading, setIsOrdersLoading] = useState(false)

  useEffect(() => {
    let isActive = true

    async function loadOrders() {
      if (!user) return

      setIsOrdersLoading(true)
      setOrdersError('')

      try {
        const payload = await getCustomerOrders()

        if (isActive) {
          setOrders(payload.orders ?? [])
          setOrdersPageInfo(payload.pageInfo ?? {
            hasNextPage: false,
            endCursor: null,
          })
        }
      } catch (error) {
        if (isActive) {
          setOrdersError(error.message)
        }
      } finally {
        if (isActive) {
          setIsOrdersLoading(false)
        }
      }
    }

    loadOrders()

    const refreshOrders = () => {
      loadOrders()
    }

    window.addEventListener('elura-orders-refresh', refreshOrders)

    return () => {
      isActive = false
      window.removeEventListener('elura-orders-refresh', refreshOrders)
    }
  }, [user])

  async function loadMoreOrders() {
    if (!ordersPageInfo.endCursor) return

    setIsOrdersLoading(true)
    setOrdersError('')

    try {
      const payload = await getCustomerOrders({ after: ordersPageInfo.endCursor })

      setOrders((currentOrders) => [...currentOrders, ...(payload.orders ?? [])])
      setOrdersPageInfo(payload.pageInfo ?? {
        hasNextPage: false,
        endCursor: null,
      })
    } catch (error) {
      setOrdersError(error.message)
    } finally {
      setIsOrdersLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="section-spacing">
        <SEO {...pageSeo.profile} canonicalPath="/profile" />
        <div className="section-shell max-w-3xl text-center">
          <SectionHeading
            eyebrow="Profile"
            title="Sign in to view your account"
            description="Access order history, saved pieces, and your account details."
            align="center"
            as="h1"
          />
          <div className="flex justify-center gap-3">
            <Link to="/login" className="btn-primary">
              Login
            </Link>
            <Link to="/signup" className="btn-secondary">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const recentlyViewedProducts = recentlyViewedIds
    .map((id) => products.find((product) => product.id === id || product.shopifyProductId === id))
    .filter(Boolean)
    .slice(0, 8)

  return (
    <div className="section-spacing">
      <SEO {...pageSeo.profile} canonicalPath="/profile" />
      <div className="section-shell">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Profile"
            title={`Welcome, ${user.name}`}
            description="Manage account details, review Shopify orders, and revisit favourite pieces."
            as="h1"
          />
          <button type="button" onClick={logout} className="line-link self-start">
            Log Out
          </button>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.84fr_1.16fr] lg:gap-16">
          <section>
            <p className="section-eyebrow">Profile Information</p>
            <div className="mt-6 space-y-5 text-sm text-muted">
              <div className="border-b border-black/8 pb-5">
                <p className="font-semibold text-ink">Email</p>
                <p className="mt-1">{user.email}</p>
              </div>
              <div className="border-b border-black/8 pb-5">
                <p className="font-semibold text-ink">Member Since</p>
                <p className="mt-1">{user.memberSince}</p>
              </div>
              <div className="pb-1">
                <p className="font-semibold text-ink">Account ID</p>
                <p className="mt-1">{user.loyaltyId}</p>
              </div>
            </div>

            <div className="mt-10 border-t border-black/8 pt-7">
              <p className="section-eyebrow">Saved Addresses</p>
              <p className="mt-2 text-sm text-muted">
                Shipping and billing addresses are managed securely in Shopify checkout and shown on order details.
              </p>
            </div>

            <div className="mt-10 border-t border-black/8 pt-7">
              <p className="section-eyebrow">Newsletter Preferences</p>
              <p className="mt-2 text-sm text-muted">
                Newsletter consent is managed in Shopify Customers and Shopify Email.
              </p>
            </div>

            <div className="mt-10 border-t border-black/8 pt-7">
              <p className="section-eyebrow">Wishlist</p>
              <p className="mt-2 text-sm text-muted">
                {wishlistProducts.length} saved piece{wishlistProducts.length === 1 ? '' : 's'}
              </p>
              <Link to="/wishlist" className="line-link mt-5 inline-flex">
                View Wishlist
              </Link>
            </div>

            <div className="mt-10 border-t border-black/8 pt-7">
              <p className="section-eyebrow">Recently Viewed</p>
              <p className="mt-2 text-sm text-muted">
                {recentlyViewedProducts.length} recently viewed piece{recentlyViewedProducts.length === 1 ? '' : 's'}
              </p>
            </div>
          </section>

          <section>
            <p className="section-eyebrow">Order History</p>
            {isOrdersLoading ? <p className="mt-5 text-sm text-muted">Loading Shopify orders...</p> : null}
            {ordersError ? <p className="mt-5 text-sm text-red-600">{ordersError}</p> : null}

            <div className="mt-5 space-y-4">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="border-b border-black/8 pb-6 pt-2 last:border-b-0"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
                        {order.name}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {order.lineItems
                          .filter((item) => item.image)
                          .slice(0, 3)
                          .map((item) => (
                            <img
                              key={`${order.id}-${item.title}`}
                              src={item.image}
                              alt={item.imageAlt}
                              className="h-16 w-14 rounded-[8px] object-cover"
                              loading="lazy"
                            />
                          ))}
                      </div>
                      <h3 className="mt-3 text-xl">
                        {order.lineItems.map((item) => `${item.title} x ${item.quantity}`).join(', ')}
                      </h3>
                      <p className="mt-2 text-sm text-muted">{formatDate(order.processedAt)}</p>
                      <p className="mt-2 text-sm text-muted">
                        Payment: {order.financialStatus || '-'} / Fulfillment: {order.fulfillmentStatus || '-'}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-semibold text-ink">
                        {formatMoney(order.total)}
                      </p>
                      {order.orderId ? (
                        <Link to={`/profile/orders/${order.orderId}`} className="line-link mt-4">
                          View Details
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {!isOrdersLoading && !ordersError && orders.length === 0 ? (
              <p className="mt-5 text-sm text-muted">
                No Shopify orders are linked to this account email yet.
              </p>
            ) : null}

            {ordersPageInfo.hasNextPage ? (
              <button
                type="button"
                onClick={loadMoreOrders}
                className="btn-secondary mt-6"
                disabled={isOrdersLoading}
              >
                {isOrdersLoading ? 'Loading...' : 'Load More Orders'}
              </button>
            ) : null}
          </section>
        </div>

        {recentlyViewedProducts.length ? (
          <section className="mt-16">
            <SectionHeading
              eyebrow="Recently Viewed"
              title="Revisit your latest pieces"
              description="Stored locally on this device, most recent first."
            />
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 no-scrollbar md:grid md:grid-cols-4 md:overflow-visible">
              {recentlyViewedProducts.map((product, index) => (
                <div key={`${product.id}-${product.slug || index}`} className="w-[64%] flex-none snap-start sm:w-[260px] md:w-auto">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}

export default ProfilePage
