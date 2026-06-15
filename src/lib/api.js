import { auth } from './firebase.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

async function apiRequest(path, options = {}) {
  const {
    fallbackError = 'Something went wrong. Please try again.',
    requireAuth = false,
    ...fetchOptions
  } = options
  const headers = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  }

  if (requireAuth) {
    const token = await auth?.currentUser?.getIdToken()

    if (!token) {
      throw new Error('Please sign in to continue.')
    }

    headers.Authorization = `Bearer ${token}`
  }

  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      headers,
    })
  } catch {
    throw new Error(fallbackError)
  }

  const contentType = response.headers.get('content-type') || ''

  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error('The server returned an invalid response. Please check the API deployment.')
  }

  const payload = await response.json().catch(() => {
    throw new Error('The server returned invalid JSON. Please try again.')
  })

  if (!response.ok) {
    throw new Error(payload.error || fallbackError)
  }

  return payload
}

const getShopifyDiscounts = () => apiRequest('/api/shopify?resource=discounts')

const createNewsletterCustomer = ({ email, turnstileToken = '', website = '' }) =>
  apiRequest('/api/shopify?resource=newsletter', {
    method: 'POST',
    fallbackError: 'We could not activate your offer right now. Please try again in a moment.',
    body: JSON.stringify({
      email,
      turnstileToken,
      website,
    }),
  })

const createBackInStockCustomer = ({
  email,
  productHandle,
  productTitle,
  variantId = '',
  turnstileToken = '',
  website = '',
}) =>
  apiRequest('/api/shopify?resource=back-in-stock', {
    method: 'POST',
    fallbackError: 'We could not save your back in stock request right now.',
    body: JSON.stringify({
      email,
      productHandle,
      productTitle,
      variantId,
      turnstileToken,
      website,
    }),
  })

const getShopifyCustomers = (params = {}) => {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      query.set(key, value)
    }
  })

  const suffix = query.toString() ? `?${query}` : ''

  const separator = suffix ? `&${suffix.slice(1)}` : ''

  return apiRequest(`/api/shopify?resource=customers${separator}`, {
    requireAuth: true,
  })
}

const getShopifySubscribers = (params = {}) => {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      query.set(key, value)
    }
  })

  const suffix = query.toString() ? `?${query}` : ''

  const separator = suffix ? `&${suffix.slice(1)}` : ''

  return apiRequest(`/api/shopify?resource=subscribers${separator}`, {
    requireAuth: true,
  })
}

const getMarketingOverview = () =>
  apiRequest('/api/shopify?resource=marketing-overview', {
    requireAuth: true,
  })

const getCustomerOrders = ({ after = '' } = {}) => {
  const query = new URLSearchParams({
    resource: 'customer-orders',
  })

  if (after) {
    query.set('after', after)
  }

  return apiRequest(`/api/shopify?${query.toString()}`, {
    requireAuth: true,
  })
}

const getCustomerOrder = (orderId) =>
  apiRequest(`/api/shopify?resource=customer-order&id=${encodeURIComponent(orderId)}`, {
    requireAuth: true,
  })

export {
  createBackInStockCustomer,
  createNewsletterCustomer,
  getCustomerOrder,
  getCustomerOrders,
  getMarketingOverview,
  getShopifyCustomers,
  getShopifyDiscounts,
  getShopifySubscribers,
}
