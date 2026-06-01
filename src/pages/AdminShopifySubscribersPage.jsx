import { useEffect, useState } from 'react'

import { getShopifySubscribers } from '../lib/api.js'

function AdminShopifySubscribersPage() {
  const [subscribers, setSubscribers] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadSubscribers() {
      try {
        const payload = await getShopifySubscribers({ search, filter: 'subscribed' })

        if (isActive) {
          setSubscribers(payload.subscribers ?? [])
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError.message)
        }
      }
    }

    const timerId = window.setTimeout(loadSubscribers, 250)

    return () => {
      isActive = false
      window.clearTimeout(timerId)
    }
  }, [search])

  return (
    <div className="section-spacing">
      <div className="section-shell">
        <p className="section-eyebrow">Marketing</p>
        <h1 className="mt-3 text-5xl">Subscribers</h1>
        <p className="mt-4 max-w-3xl text-muted">
          Subscriber status is read from Shopify customer marketing consent.
        </p>

        <div className="mt-10 rounded-[8px] border border-black/8 bg-white p-5">
          <input value={search} onChange={(event) => setSearch(event.target.value)} className="search-shell shadow-none" placeholder="Search subscribers" />
        </div>

        {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

        <div className="mt-8 overflow-x-auto rounded-[8px] border border-black/8 bg-white">
          <table className="min-w-[680px] w-full text-left text-sm">
            <thead className="bg-linen/50 text-xs uppercase tracking-[0.2em] text-muted">
              <tr>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Subscription Date</th>
                <th className="px-5 py-4">Marketing Consent</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="border-t border-black/8">
                  <td className="px-5 py-4 font-semibold">{subscriber.email}</td>
                  <td className="px-5 py-4 text-muted">
                    {subscriber.subscriptionDate ? new Date(subscriber.subscriptionDate).toLocaleDateString('en-GB') : '-'}
                  </td>
                  <td className="px-5 py-4">{subscriber.marketingConsentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminShopifySubscribersPage
