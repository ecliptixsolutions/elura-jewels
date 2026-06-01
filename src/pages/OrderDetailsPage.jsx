import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import SEO from '../components/SEO.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { getCustomerOrder } from '../lib/api.js'
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
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function AddressBlock({ title, address }) {
  return (
    <section>
      <p className="section-eyebrow">{title}</p>
      {address ? (
        <div className="mt-4 space-y-1 text-sm text-muted">
          <p className="font-semibold text-ink">{address.name}</p>
          <p>{address.address1}</p>
          {address.address2 ? <p>{address.address2}</p> : null}
          <p>{[address.city, address.province, address.zip].filter(Boolean).join(', ')}</p>
          <p>{address.country}</p>
          {address.phone ? <p>{address.phone}</p> : null}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">No address was saved for this order.</p>
      )}
    </section>
  )
}

function OrderDetailsPage() {
  const { orderId } = useParams()
  const { user } = useStore()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isActive = true

    async function loadOrder() {
      if (!user || !orderId) return

      setIsLoading(true)
      setError('')

      try {
        const payload = await getCustomerOrder(orderId)

        if (isActive) {
          setOrder(payload.order ?? null)
        }
      } catch (requestError) {
        if (isActive) {
          setError(requestError.message)
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadOrder()

    return () => {
      isActive = false
    }
  }, [orderId, user])

  if (!user) {
    return (
      <div className="section-spacing">
        <SEO {...pageSeo.profile} canonicalPath={`/profile/orders/${orderId || ''}`} />
        <div className="section-shell max-w-3xl text-center">
          <SectionHeading
            eyebrow="Order"
            title="Sign in to view this order"
            description="Order details are protected and only shown to the customer email on the Shopify order."
            align="center"
            as="h1"
          />
          <Link to="/login" className="btn-primary">
            Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="section-spacing">
      <SEO {...pageSeo.profile} canonicalPath={`/profile/orders/${orderId || ''}`} />
      <div className="section-shell">
        <Link to="/profile" className="line-link">
          Back to Profile
        </Link>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Order Details"
            title={order?.name || 'Loading order'}
            description="Real Shopify order, payment, fulfillment, refund, and address details."
            as="h1"
          />
          {order ? (
            <div className="text-left sm:text-right">
              <p className="text-sm text-muted">{formatDate(order.processedAt)}</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{formatMoney(order.total)}</p>
            </div>
          ) : null}
        </div>

        {isLoading ? <p className="mt-8 text-sm text-muted">Loading Shopify order...</p> : null}
        {error ? <p className="mt-8 text-sm text-red-600">{error}</p> : null}

        {order ? (
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <section>
              <p className="section-eyebrow">Items</p>
              <div className="mt-5 divide-y divide-black/8">
                {order.lineItems.map((item) => (
                  <div key={`${item.title}-${item.sku}`} className="flex justify-between gap-5 py-5">
                    <div className="flex gap-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.imageAlt}
                          className="h-20 w-16 rounded-[8px] object-cover"
                          loading="lazy"
                        />
                      ) : null}
                      <div>
                        <p className="font-semibold text-ink">{item.title}</p>
                        {item.variantTitle ? <p className="mt-1 text-sm text-muted">{item.variantTitle}</p> : null}
                        {item.sku ? <p className="mt-1 text-sm text-muted">SKU: {item.sku}</p> : null}
                        <p className="mt-1 text-sm text-muted">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-ink">{formatMoney(item.total)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3 border-t border-black/8 pt-6 text-sm">
                <div className="flex justify-between gap-5">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-semibold text-ink">{formatMoney(order.subtotal)}</span>
                </div>
                <div className="flex justify-between gap-5">
                  <span className="text-muted">Tax</span>
                  <span className="font-semibold text-ink">{formatMoney(order.tax)}</span>
                </div>
                <div className="flex justify-between gap-5 text-lg">
                  <span className="text-ink">Total</span>
                  <span className="font-semibold text-ink">{formatMoney(order.total)}</span>
                </div>
              </div>
            </section>

            <aside className="space-y-10">
              <section>
                <p className="section-eyebrow">Status</p>
                <div className="mt-4 space-y-2 text-sm text-muted">
                  <p>Payment: {order.financialStatus || '-'}</p>
                  <p>Fulfillment: {order.fulfillmentStatus || '-'}</p>
                </div>
              </section>

              <AddressBlock title="Shipping Address" address={order.shippingAddress} />
              <AddressBlock title="Billing Address" address={order.billingAddress} />

              <section>
                <p className="section-eyebrow">Fulfillment</p>
                {order.fulfillments.length ? (
                  <div className="mt-4 space-y-4 text-sm text-muted">
                    {order.fulfillments.map((fulfillment) => (
                      <div key={fulfillment.id || fulfillment.updatedAt}>
                        <p className="font-semibold text-ink">{fulfillment.status || '-'}</p>
                        <p>Updated: {formatDate(fulfillment.updatedAt)}</p>
                        {fulfillment.trackingInfo.map((tracking) => (
                          <p key={`${tracking.company}-${tracking.number}`}>
                            {tracking.url ? (
                              <a href={tracking.url} className="line-link" target="_blank" rel="noreferrer">
                                {tracking.company || 'Tracking'} {tracking.number}
                              </a>
                            ) : (
                              `${tracking.company || 'Tracking'} ${tracking.number || ''}`
                            )}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted">No fulfillment has been added yet.</p>
                )}
              </section>

              <section>
                <p className="section-eyebrow">Refunds</p>
                {order.refunds.length ? (
                  <div className="mt-4 space-y-3 text-sm text-muted">
                    {order.refunds.map((refund) => (
                      <p key={refund.id}>
                        {formatDate(refund.createdAt)}: {formatMoney(refund.totalRefunded)}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted">No refunds recorded for this order.</p>
                )}
              </section>

              <section>
                <p className="section-eyebrow">Timeline</p>
                <div className="mt-4 space-y-3 text-sm text-muted">
                  {order.timeline.map((event) => (
                    <p key={`${event.label}-${event.at}`}>
                      {event.label}: {formatDate(event.at)}
                    </p>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default OrderDetailsPage
