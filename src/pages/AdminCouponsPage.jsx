import { useEffect, useState } from 'react'

import { getShopifyDiscounts } from '../lib/api.js'

function AdminCouponsPage() {
  const [discounts, setDiscounts] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    async function loadDiscounts() {
      try {
        const payload = await getShopifyDiscounts()

        if (isActive) {
          setDiscounts(payload.discounts ?? [])
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError.message)
        }
      } finally {
        if (isActive) setLoading(false)
      }
    }

    loadDiscounts()

    return () => {
      isActive = false
    }
  }, [])

  return (
    <div className="section-spacing">
      <div className="section-shell">
        <p className="section-eyebrow">Coupons</p>
        <h1 className="mt-3 text-5xl">Shopify Discounts</h1>
        <p className="mt-4 max-w-3xl text-muted">
          Active coupon codes are managed in Shopify Discounts and displayed dynamically in the cart drawer.
        </p>

        <a
          href="https://elura-jewels-2.myshopify.com/admin/discounts"
          target="_blank"
          rel="noreferrer"
          className="btn-primary mt-8"
        >
          Open Shopify Discounts
        </a>

        {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}
        {loading ? <p className="mt-6 text-sm text-muted">Loading Shopify discounts...</p> : null}

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {discounts.map((discount) => (
            <article key={discount.id} className="rounded-[8px] border border-black/8 bg-white p-6">
              <p className="section-eyebrow">{discount.code}</p>
              <h2 className="mt-3 text-2xl">{discount.title}</h2>
              <p className="mt-3 text-sm text-muted">{discount.summary}</p>
            </article>
          ))}
          {!loading && !error && !discounts.length ? <p className="text-sm text-muted">No active Shopify discounts found.</p> : null}
        </div>
      </div>
    </div>
  )
}

export default AdminCouponsPage
