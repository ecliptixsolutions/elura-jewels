import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getMarketingOverview } from '../lib/api.js'

function AdminMarketingPage() {
  const [overview, setOverview] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadOverview() {
      try {
        const payload = await getMarketingOverview()

        if (isActive) {
          setOverview(payload)
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError.message)
        }
      }
    }

    loadOverview()

    return () => {
      isActive = false
    }
  }, [])

  const totals = overview?.totals ?? {
    customers: 0,
    subscribers: 0,
    marketingConsent: 0,
  }
  const urls = overview?.shopifyAdminUrls ?? {}

  return (
    <div className="section-spacing">
      <div className="section-shell">
        <p className="section-eyebrow">Marketing</p>
        <h1 className="mt-3 text-5xl">Shopify Email Marketing</h1>
        <p className="mt-4 max-w-3xl text-muted">
          ELURA uses Shopify Customers and Shopify Email as the marketing platform. This dashboard mirrors Shopify customer and consent data.
        </p>

        {error ? <p className="mt-6 rounded-[8px] bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ['Total Customers', totals.customers],
            ['Total Subscribers', totals.subscribers],
            ['Marketing Consent', totals.marketingConsent],
          ].map(([label, value]) => (
            <article key={label} className="rounded-[8px] border border-black/8 bg-white p-6">
              <p className="text-sm text-muted">{label}</p>
              <p className="mt-3 text-4xl font-semibold text-ink">{value}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {urls.customers ? <a href={urls.customers} target="_blank" rel="noreferrer" className="btn-secondary">Open Shopify Customers</a> : null}
          {urls.email ? <a href={urls.email} target="_blank" rel="noreferrer" className="btn-secondary">Open Shopify Email</a> : null}
          {urls.discounts ? <a href={urls.discounts} target="_blank" rel="noreferrer" className="btn-secondary">Open Shopify Discounts</a> : null}
          <Link to="/admin/marketing/newsletter" className="btn-primary">Newsletter Popup</Link>
        </div>

        <div className="mt-12 grid gap-8 xl:grid-cols-2">
          <section className="rounded-[8px] border border-black/8 bg-white p-8">
            <h2 className="text-3xl">Recent Subscribers</h2>
            <div className="mt-6 space-y-4">
              {overview?.recentSubscribers?.map((customer) => (
                <div key={customer.id} className="border-b border-black/8 pb-4">
                  <p className="font-semibold">{customer.email}</p>
                  <p className="text-sm text-muted">{customer.marketingConsentStatus}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[8px] border border-black/8 bg-white p-8">
            <h2 className="text-3xl">Latest Customer Signups</h2>
            <div className="mt-6 space-y-4">
              {overview?.latestCustomerSignups?.map((customer) => (
                <div key={customer.id} className="border-b border-black/8 pb-4">
                  <p className="font-semibold">{customer.name || customer.email}</p>
                  <p className="text-sm text-muted">{customer.email}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AdminMarketingPage
