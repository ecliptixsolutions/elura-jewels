import { useEffect, useMemo, useState } from 'react'

import { getShopifyCustomers } from '../lib/api.js'
import { formatCurrency } from '../data/siteData.js'

function AdminShopifyCustomersPage() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [sortKey, setSortKey] = useState('created')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadCustomers() {
      try {
        const payload = await getShopifyCustomers({ search, filter })

        if (isActive) {
          setCustomers(payload.customers ?? [])
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError.message)
        }
      }
    }

    const timerId = window.setTimeout(loadCustomers, 250)

    return () => {
      isActive = false
      window.clearTimeout(timerId)
    }
  }, [filter, search])

  const sortedCustomers = useMemo(() => {
    const nextCustomers = [...customers]

    if (sortKey === 'spend') {
      return nextCustomers.sort((a, b) => b.totalSpend - a.totalSpend)
    }

    if (sortKey === 'orders') {
      return nextCustomers.sort((a, b) => b.ordersCount - a.ordersCount)
    }

    return nextCustomers.sort((a, b) => new Date(b.customerSince) - new Date(a.customerSince))
  }, [customers, sortKey])

  return (
    <div className="section-spacing">
      <div className="section-shell">
        <p className="section-eyebrow">Marketing</p>
        <h1 className="mt-3 text-5xl">Customers</h1>

        <div className="mt-10 flex flex-col gap-4 rounded-[8px] border border-black/8 bg-white p-5 lg:flex-row">
          <input value={search} onChange={(event) => setSearch(event.target.value)} className="search-shell shadow-none" placeholder="Search customers" />
          <select value={filter} onChange={(event) => setFilter(event.target.value)} className="input-shell lg:max-w-56">
            <option value="">All customers</option>
            <option value="subscribed">Subscribed</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>
          <select value={sortKey} onChange={(event) => setSortKey(event.target.value)} className="input-shell lg:max-w-56">
            <option value="created">Newest</option>
            <option value="orders">Orders count</option>
            <option value="spend">Total spend</option>
          </select>
        </div>

        {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

        <div className="mt-8 overflow-x-auto rounded-[8px] border border-black/8 bg-white">
          <table className="min-w-[920px] w-full text-left text-sm">
            <thead className="bg-linen/50 text-xs uppercase tracking-[0.2em] text-muted">
              <tr>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Customer Since</th>
                <th className="px-5 py-4">Orders</th>
                <th className="px-5 py-4">Spend</th>
                <th className="px-5 py-4">Consent</th>
              </tr>
            </thead>
            <tbody>
              {sortedCustomers.map((customer) => (
                <tr key={customer.id} className="border-t border-black/8">
                  <td className="px-5 py-4">
                    <button type="button" onClick={() => setSelectedCustomer(customer)} className="text-left font-semibold text-ink">
                      {customer.name || customer.email}
                      <span className="block text-sm font-normal text-muted">{customer.email}</span>
                    </button>
                  </td>
                  <td className="px-5 py-4 text-muted">{customer.phone || '-'}</td>
                  <td className="px-5 py-4 text-muted">{customer.customerSince ? new Date(customer.customerSince).toLocaleDateString('en-GB') : '-'}</td>
                  <td className="px-5 py-4">{customer.ordersCount}</td>
                  <td className="px-5 py-4">{formatCurrency(customer.totalSpend)}</td>
                  <td className="px-5 py-4">{customer.marketingConsentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedCustomer ? (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/35 px-5" onClick={() => setSelectedCustomer(null)}>
            <article className="w-full max-w-xl rounded-[8px] bg-white p-8" onClick={(event) => event.stopPropagation()}>
              <p className="section-eyebrow">Customer Profile</p>
              <h2 className="mt-3 text-3xl">{selectedCustomer.name || selectedCustomer.email}</h2>
              <div className="mt-6 grid gap-3 text-sm text-muted">
                <p>Email: {selectedCustomer.email}</p>
                <p>Phone: {selectedCustomer.phone || '-'}</p>
                <p>Orders: {selectedCustomer.ordersCount}</p>
                <p>Total spend: {formatCurrency(selectedCustomer.totalSpend)}</p>
                <p>Marketing consent: {selectedCustomer.marketingConsentStatus}</p>
                <p>Tags: {selectedCustomer.tags?.join(', ') || '-'}</p>
              </div>
              <button type="button" onClick={() => setSelectedCustomer(null)} className="btn-primary mt-8">
                Close
              </button>
            </article>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default AdminShopifyCustomersPage
