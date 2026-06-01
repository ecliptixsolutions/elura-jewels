/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import {
  homeFeaturedProducts as fallbackHomeFeaturedProducts,
  products as fallbackProducts,
} from '../data/siteData.js'
import { auth, db, googleProvider, hasFirebaseConfig } from '../lib/firebase.js'
import { getCustomerOrders } from '../lib/api.js'
import { createShopifyCart, getShopifyProducts } from '../lib/shopify.js'
import { subscribeCmsDoc } from '../lib/cms.js'
import { trackConversionEvent } from '../lib/analytics.js'
import {
  getRecentlyViewedIds,
  saveAbandonedCartState,
  saveRecentlyViewedProduct,
} from '../lib/conversion.js'

const StoreContext = createContext(null)

const normalizeValue = (value) => value?.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') ?? ''

const inferCategory = (fallbackProduct, handle, title) => {
  if (fallbackProduct?.category) {
    return fallbackProduct.category
  }

  const subject = `${handle} ${title}`.toLowerCase()

  if (subject.includes('bangle')) {
    return 'Bangles'
  }

  if (subject.includes('bracelet')) {
    return 'Bracelets'
  }

  if (subject.includes('earring') || subject.includes('stud')) {
    return 'Earrings'
  }

  if (subject.includes('ring')) {
    return 'Rings'
  }

  return 'Necklaces'
}

const buildImages = (shopifyImages = [], fallbackImages = []) => {
  const images = [...shopifyImages, ...fallbackImages].filter(Boolean)

  while (images.length < 3) {
    images.push(images[images.length - 1] ?? '')
  }

  return images.slice(0, 3)
}

const mapShopifyProduct = (node) => {
  const fallbackProduct = fallbackProducts.find(
    (item) =>
      item.slug === node.handle ||
      normalizeValue(item.name) === normalizeValue(node.title),
  )
  const shopifyImages =
    node.images?.edges?.map((edge) => edge.node?.url).filter(Boolean) ?? []
  const variants = node.variants?.edges?.map((edge) => edge.node).filter(Boolean) ?? []
  const variant = variants.find((item) => item.availableForSale) ?? variants[0]
  const amount = variant?.price?.amount
  const price = Number.parseFloat(amount ?? fallbackProduct?.price ?? 0)
  const quantityAvailable = variants
    .map((item) => item.quantityAvailable)
    .find((value) => Number.isFinite(Number(value)))

  return {
    id: fallbackProduct?.id ?? node.id,
    shopifyProductId: node.id,
    slug: node.handle ?? fallbackProduct?.slug ?? normalizeValue(node.title),
    name: node.title ?? fallbackProduct?.name ?? 'ELURA Product',
    category: node.productType || inferCategory(fallbackProduct, node.handle ?? '', node.title ?? ''),
    price: Number.isNaN(price) ? 0 : price,
    currencyCode: variant?.price?.currencyCode ?? 'GBP',
    variantId: variant?.id ?? '',
    variants,
    sku: variant?.sku || fallbackProduct?.sku || '',
    quantityAvailable: Number.isFinite(Number(quantityAvailable)) ? Number(quantityAvailable) : null,
    availableForSale: node.availableForSale ?? variant?.availableForSale ?? true,
    description:
      node.description ||
      fallbackProduct?.description ||
      'Selected from the ELURA collection with premium finishing and refined detail.',
    materials: fallbackProduct?.materials ?? ['Material details available on request'],
    details: fallbackProduct?.details ?? ['Presented in ELURA packaging'],
    images: buildImages(shopifyImages, fallbackProduct?.images),
    reviews: fallbackProduct?.reviews ?? [],
  }
}

const readStoredValue = (key, fallback) => {
  const value = window.localStorage.getItem(key)

  if (!value) {
    return fallback
  }

  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

const pendingCheckoutKey = 'elura-pending-checkout'
const lastCheckoutKey = 'elura-last-checkout'
const cartOptionsKey = 'elura-cart-options'
const cartStorageKeys = [
  'elura-cart',
  'elura-cart-cache',
  'elura-cart-state',
  'elura-persisted-cart',
]

const conversionFallback = {
  freeShippingThreshold: 250,
  giftWrapEnabled: true,
  giftWrapPrice: 5,
  giftWrapVariantId: import.meta.env.VITE_GIFT_WRAP_VARIANT_ID || '',
  lowStockThreshold: 5,
  ukDeliveryLabel: '2-4 working days',
  internationalDeliveryLabel: '5-10 working days',
}

const initialCartOptions = {
  giftWrap: false,
  giftMessage: '',
  recoveryEmail: '',
}

const writeStorageValue = (storage, key, value) => {
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage failures so checkout can continue.
  }
}

const removeStorageValue = (storage, key) => {
  try {
    storage.removeItem(key)
  } catch {
    // Ignore storage failures so cleanup does not break the UI.
  }
}

const readStorageValue = (storage, key, fallback = null) => {
  try {
    const value = storage.getItem(key)

    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const normalizeCartItem = (product, quantity = 1) => ({
  ...product,
  quantity,
})

const mergeCartItem = (items, product, quantity = 1) => {
  const existing = items.find((item) => item.id === product.id)

  if (existing) {
    return items.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item,
    )
  }

  return [...items, normalizeCartItem(product, quantity)]
}

const ensureFirebaseReady = () => {
  if (!auth || !db || !hasFirebaseConfig) {
    throw new Error('Firebase configuration is missing. Add your VITE_FIREBASE_* values.')
  }
}

const mapFirebaseUser = (firebaseUser) => {
  if (!firebaseUser) {
    return null
  }

  const displayName = firebaseUser.displayName?.trim()

  return {
    uid: firebaseUser.uid,
    name: displayName || firebaseUser.email?.split('@')[0] || 'ELURA Customer',
    email: firebaseUser.email ?? '',
    memberSince: new Date(
      firebaseUser.metadata.creationTime ?? Date.now(),
    ).getFullYear().toString(),
    loyaltyId: `ELURA-${firebaseUser.uid.slice(0, 8).toUpperCase()}`,
  }
}

const syncUserProfile = async (firebaseUser, nameOverride) => {
  ensureFirebaseReady()

  const userRef = doc(db, 'users', firebaseUser.uid)
  const existingUser = await getDoc(userRef)
  const nextName = nameOverride?.trim() || firebaseUser.displayName || ''

  if (!existingUser.exists()) {
    await setDoc(userRef, {
      uid: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      name: nextName,
      createdAt: serverTimestamp(),
    })
    return
  }

  await setDoc(
    userRef,
    {
      uid: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      name: nextName,
    },
    { merge: true },
  )
}

const syncUserProfileSafely = async (firebaseUser, nameOverride) => {
  try {
    await syncUserProfile(firebaseUser, nameOverride)
  } catch (error) {
    console.error('Failed to sync Firebase user profile', error)
  }
}

function StoreProvider({ children }) {
  const [products, setProducts] = useState(fallbackProducts)
  const [isProductsLoading, setIsProductsLoading] = useState(true)
  const [cartItems, setCartItems] = useState(() => readStoredValue('elura-cart', []))
  const [wishlistIds, setWishlistIds] = useState(() =>
    readStoredValue('elura-wishlist', []),
  )
  const [recentlyViewedIds, setRecentlyViewedIds] = useState(() => getRecentlyViewedIds())
  const [user, setUser] = useState(() => readStoredValue('elura-user', null))
  const [cartOptions, setCartOptions] = useState(() => readStoredValue(cartOptionsKey, initialCartOptions))
  const [conversionSettings, setConversionSettings] = useState(conversionFallback)
  const [isAuthReady, setIsAuthReady] = useState(!hasFirebaseConfig)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  useEffect(() => {
    window.localStorage.setItem('elura-cart', JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    window.localStorage.setItem('elura-wishlist', JSON.stringify(wishlistIds))
  }, [wishlistIds])

  useEffect(() => {
    window.localStorage.setItem(cartOptionsKey, JSON.stringify(cartOptions))
  }, [cartOptions])

  useEffect(() => {
    saveAbandonedCartState({
      cartItems,
      email: cartOptions.recoveryEmail || user?.email || '',
      subtotal: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    })
  }, [cartItems, cartOptions.recoveryEmail, user?.email])

  useEffect(() => {
    const unsubscribe = subscribeCmsDoc(
      'conversion',
      conversionFallback,
      setConversionSettings,
    )

    return unsubscribe
  }, [])

  useEffect(() => {
    const onRecentlyViewedUpdated = () => {
      setRecentlyViewedIds(getRecentlyViewedIds())
    }

    window.addEventListener('elura-recently-viewed-updated', onRecentlyViewedUpdated)

    return () => {
      window.removeEventListener('elura-recently-viewed-updated', onRecentlyViewedUpdated)
    }
  }, [])

  useEffect(() => {
    if (user) {
      window.localStorage.setItem('elura-user', JSON.stringify(user))
      return
    }

    window.localStorage.removeItem('elura-user')
  }, [user])

  useEffect(() => {
    let isActive = true

    const loadProducts = async () => {
      try {
        const shopifyProducts = await getShopifyProducts()

        if (isActive && shopifyProducts.length > 0) {
          setProducts(shopifyProducts.map(mapShopifyProduct))
        }
      } catch (error) {
        console.error('Failed to load Shopify products', error)
      } finally {
        if (isActive) {
          setIsProductsLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    if (!auth || !hasFirebaseConfig) {
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(mapFirebaseUser(firebaseUser))
      setIsAuthReady(true)
    })

    return unsubscribe
  }, [])

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const cartSubtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )
  const giftWrapPrice = Number(conversionSettings.giftWrapPrice || 0)
  const cartTotal = cartSubtotal + (cartOptions.giftWrap ? giftWrapPrice : 0)

  const wishlistProducts = products.filter((product) => wishlistIds.includes(product.id))
  const homeFeaturedProducts = fallbackHomeFeaturedProducts
    .map((featuredProduct) => products.find((product) => product.slug === featuredProduct.slug))
    .filter(Boolean)

  while (homeFeaturedProducts.length < 4 && homeFeaturedProducts.length < products.length) {
    const nextProduct = products[homeFeaturedProducts.length]

    if (nextProduct && !homeFeaturedProducts.some((product) => product.id === nextProduct.id)) {
      homeFeaturedProducts.push(nextProduct)
    }
  }

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  const addToCart = (product, quantity = 1, options = {}) => {
    const { openDrawer = true } = options

    setCartItems((current) => mergeCartItem(current, product, quantity))
    trackConversionEvent('add_to_cart', {
      product_id: product.shopifyProductId || product.id,
      item_name: product.name,
      value: product.price * quantity,
      currency: product.currencyCode || 'GBP',
      quantity,
    })

    if (openDrawer) {
      openCart()
    }
  }

  const updateCartOptions = useCallback((nextOptions) => {
    setCartOptions((current) => ({
      ...current,
      ...nextOptions,
      giftMessage:
        typeof nextOptions.giftMessage === 'string'
          ? nextOptions.giftMessage.slice(0, 250)
          : current.giftMessage,
    }))
  }, [])

  const trackRecentlyViewedProduct = useCallback((productId) => {
    setRecentlyViewedIds(saveRecentlyViewedProduct(productId))
  }, [])

  const updateCartQuantity = (productId, nextQuantity) => {
    if (nextQuantity <= 0) {
      setCartItems((current) => current.filter((item) => item.id !== productId))
      return
    }

    setCartItems((current) =>
      current.map((item) =>
        item.id === productId ? { ...item, quantity: nextQuantity } : item,
      ),
    )
  }

  const removeFromCart = (productId) => {
    setCartItems((current) => current.filter((item) => item.id !== productId))
  }

  const clearCart = () => setCartItems([])

  const clearAllCartSources = useCallback(() => {
    setCartItems([])

    cartStorageKeys.forEach((key) => {
      removeStorageValue(window.localStorage, key)
      removeStorageValue(window.sessionStorage, key)
    })
    removeStorageValue(window.localStorage, pendingCheckoutKey)
    removeStorageValue(window.sessionStorage, pendingCheckoutKey)
    removeStorageValue(window.localStorage, lastCheckoutKey)
    removeStorageValue(window.sessionStorage, lastCheckoutKey)

    window.dispatchEvent(new CustomEvent('elura-cart-cleared'))
  }, [])

  const redirectToLoginForCheckout = useCallback((checkoutState) => {
    writeStorageValue(window.sessionStorage, pendingCheckoutKey, checkoutState)
    writeStorageValue(window.localStorage, pendingCheckoutKey, checkoutState)
    window.location.assign('/login?redirectTo=/checkout&checkout=1')
  }, [])

  const checkout = useCallback(async ({
    action = 'checkout',
    discountCodes = [],
    items,
  } = {}) => {
    const checkoutItems = items?.length ? items : cartItems
    const checkoutState = {
      action,
      cartItems: checkoutItems,
      createdAt: new Date().toISOString(),
      returnTo: '/checkout',
    }

    setCheckoutError('')

    if (!checkoutItems.length) {
      throw new Error('Your cart is empty.')
    }

    const firebaseEmail = auth?.currentUser?.email || ''
    const recoveryEmail = cartOptions.recoveryEmail || firebaseEmail

    saveAbandonedCartState({
      cartItems: checkoutItems,
      email: recoveryEmail,
      subtotal: cartSubtotal,
    })
    trackConversionEvent('begin_checkout', {
      value: cartTotal,
      currency: checkoutItems[0]?.currencyCode || 'GBP',
      item_count: checkoutItems.reduce((total, item) => total + item.quantity, 0),
      has_gift_wrap: Boolean(cartOptions.giftWrap),
    })

    if (!firebaseEmail) {
      redirectToLoginForCheckout(checkoutState)
      return null
    }

    const checkoutLines = [...checkoutItems]
    const giftWrapVariantId =
      conversionSettings.giftWrapVariantId ||
      import.meta.env.VITE_GIFT_WRAP_VARIANT_ID ||
      ''

    if (cartOptions.giftWrap && giftWrapVariantId) {
      checkoutLines.push({
        id: 'elura-gift-wrap',
        merchandiseId: giftWrapVariantId,
        quantity: 1,
        attributes: [
          {
            key: 'Gift wrap',
            value: 'Yes',
          },
        ],
      })
    }

    const checkoutCart = await createShopifyCart({
      items: checkoutLines,
      email: firebaseEmail,
      discountCodes,
      prefillBuyerEmail: true,
      attributes: [
        {
          key: 'Gift wrap requested',
          value: cartOptions.giftWrap ? 'Yes' : 'No',
        },
        {
          key: 'Gift wrap charge configured',
          value: cartOptions.giftWrap ? String(giftWrapPrice) : '0',
        },
      ],
      note: cartOptions.giftMessage?.trim()
        ? `Gift message: ${cartOptions.giftMessage.trim()}`
        : '',
    })

    const lastCheckout = {
      action,
      buyerEmail: firebaseEmail,
      cartId: checkoutCart.id,
      checkoutUrl: checkoutCart.checkoutUrl,
      cartItems: checkoutItems,
      createdAt: checkoutState.createdAt,
      status: 'redirected-to-shopify',
    }

    writeStorageValue(window.localStorage, lastCheckoutKey, lastCheckout)
    writeStorageValue(window.sessionStorage, lastCheckoutKey, lastCheckout)
    removeStorageValue(window.localStorage, pendingCheckoutKey)
    removeStorageValue(window.sessionStorage, pendingCheckoutKey)

    window.location.assign(checkoutCart.checkoutUrl)

    return checkoutCart
  }, [cartItems, cartOptions, cartSubtotal, cartTotal, conversionSettings.giftWrapVariantId, giftWrapPrice, redirectToLoginForCheckout])

  const buyNow = useCallback(async (product, quantity = 1) => {
    const nextCart = mergeCartItem(cartItems, product, quantity)

    setCartItems(nextCart)
    closeCart()

    return checkout({
      action: 'buy-now',
      items: nextCart,
    })
  }, [cartItems, checkout, closeCart])

  const finalizeReturnedCheckout = useCallback(async () => {
    if (!user?.email) return

    const pendingCheckout =
      readStorageValue(window.localStorage, lastCheckoutKey) ||
      readStorageValue(window.sessionStorage, lastCheckoutKey)

    if (!pendingCheckout?.createdAt || pendingCheckout.status === 'completed') {
      return
    }

    try {
      const payload = await getCustomerOrders()
      const checkoutStartedAt = new Date(pendingCheckout.createdAt).getTime() - 5 * 60_000
      const matchingOrder = payload.orders?.find((order) => {
        const processedAt = new Date(order.processedAt || 0).getTime()

        return processedAt >= checkoutStartedAt
      })

      if (!matchingOrder) {
        return
      }

      trackConversionEvent('purchase', {
        order_id: matchingOrder.orderId,
        value: pendingCheckout.cartItems?.reduce(
          (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
          0,
        ) || 0,
        currency: 'GBP',
      })
      clearAllCartSources()
      writeStorageValue(window.sessionStorage, 'elura-last-completed-order', {
        orderId: matchingOrder.orderId,
        orderName: matchingOrder.name,
        completedAt: new Date().toISOString(),
      })
      window.dispatchEvent(new CustomEvent('elura-orders-refresh'))
    } catch (error) {
      setCheckoutError(error.message || 'Unable to refresh checkout status.')
    }
  }, [clearAllCartSources, user?.email])

  useEffect(() => {
    finalizeReturnedCheckout()

    const onPageShow = () => finalizeReturnedCheckout()
    const onFocus = () => finalizeReturnedCheckout()

    window.addEventListener('pageshow', onPageShow)
    window.addEventListener('focus', onFocus)

    return () => {
      window.removeEventListener('pageshow', onPageShow)
      window.removeEventListener('focus', onFocus)
    }
  }, [finalizeReturnedCheckout])

  const toggleWishlist = (productId) => {
    setWishlistIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    )
    trackConversionEvent('wishlist', {
      product_id: productId,
    })
  }

  const login = async ({ email, password }) => {
    ensureFirebaseReady()

    const credential = await signInWithEmailAndPassword(auth, email, password)
    await syncUserProfileSafely(credential.user)
    const nextUser = mapFirebaseUser(credential.user)
    setUser(nextUser)
    return nextUser
  }

  const signup = async ({ name, email, password }) => {
    ensureFirebaseReady()

    const credential = await createUserWithEmailAndPassword(auth, email, password)

    if (name?.trim()) {
      await updateProfile(credential.user, {
        displayName: name.trim(),
      })
    }

    await syncUserProfileSafely(credential.user, name)
    const nextUser = mapFirebaseUser({
      ...credential.user,
      displayName: name?.trim() || credential.user.displayName,
    })
    setUser(nextUser)
    return nextUser
  }

  const googleLogin = async () => {
    ensureFirebaseReady()

    const credential = await signInWithPopup(auth, googleProvider)
    await syncUserProfileSafely(credential.user)
    const nextUser = mapFirebaseUser(credential.user)
    setUser(nextUser)
    return nextUser
  }

  const forgotPassword = async (email) => {
    ensureFirebaseReady()
    await sendPasswordResetEmail(auth, email)
  }

  const logout = async () => {
    if (!auth || !hasFirebaseConfig) {
      setUser(null)
      return
    }

    await signOut(auth)
    setUser(null)
  }

  return (
    <StoreContext.Provider
      value={{
        products,
        homeFeaturedProducts,
        isProductsLoading,
        isAuthReady,
        cartItems,
        cartCount,
        cartSubtotal,
        cartTotal,
        cartOptions,
        conversionSettings,
        isCartOpen,
        wishlistIds,
        wishlistProducts,
        user,
        openCart,
        closeCart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        updateCartOptions,
        checkout,
        checkoutError,
        buyNow,
        toggleWishlist,
        login,
        signup,
        googleLogin,
        forgotPassword,
        logout,
        recentlyViewedIds,
        trackRecentlyViewedProduct,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

const useStore = () => {
  const context = useContext(StoreContext)

  if (!context) {
    throw new Error('useStore must be used inside StoreProvider')
  }

  return context
}

export { StoreProvider, useStore }
