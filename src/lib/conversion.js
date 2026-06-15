const recentlyViewedKey = 'elura-recently-viewed-products'
const abandonedCartKey = 'elura-abandoned-cart-prep'

const readJson = (key, fallback) => {
  try {
    return JSON.parse(window.localStorage.getItem(key) || '') || fallback
  } catch {
    return fallback
  }
}

const writeJson = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage failures should not block conversion flows.
  }
}

const getRecentlyViewedIds = () => {
  const seen = new Set()

  return readJson(recentlyViewedKey, []).filter((id) => {
    const key = String(id)

    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

const saveRecentlyViewedProduct = (productId) => {
  if (!productId) {
    return []
  }

  const next = [
    productId,
    ...getRecentlyViewedIds().filter((id) => String(id) !== String(productId)),
  ].slice(0, 8)

  writeJson(recentlyViewedKey, next)
  window.dispatchEvent(new CustomEvent('elura-recently-viewed-updated'))

  return next
}

const estimateDelivery = (countryCode = 'GB') => {
  const isUk = ['GB', 'UK'].includes(String(countryCode).toUpperCase())
  const startOffset = isUk ? 2 : 5
  const endOffset = isUk ? 4 : 10
  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
  })
  const getDate = (offset) => {
    const date = new Date()

    date.setDate(date.getDate() + offset)
    return formatter.format(date)
  }

  return {
    label: isUk ? 'UK delivery estimate' : 'International delivery estimate',
    text: `${getDate(startOffset)} - ${getDate(endOffset)}`,
  }
}

const saveAbandonedCartState = ({ cartItems, email = '', subtotal = 0 }) => {
  if (!cartItems?.length) {
    return
  }

  writeJson(abandonedCartKey, {
    email,
    subtotal,
    cartItems: cartItems.map((item) => ({
      id: item.id,
      shopifyProductId: item.shopifyProductId,
      variantId: item.variantId,
      slug: item.slug,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    updatedAt: new Date().toISOString(),
  })
}

export {
  estimateDelivery,
  getRecentlyViewedIds,
  saveAbandonedCartState,
  saveRecentlyViewedProduct,
}
