/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
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
  accountOrders,
  homeFeaturedProducts as fallbackHomeFeaturedProducts,
  products as fallbackProducts,
} from '../data/siteData.js'
import { auth, db, googleProvider, hasFirebaseConfig } from '../lib/firebase.js'
import { getShopifyProducts } from '../lib/shopify.js'

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
  const variant = node.variants?.edges?.[0]?.node
  const amount = variant?.price?.amount
  const price = Number.parseFloat(amount ?? fallbackProduct?.price ?? 0)

  return {
    id: fallbackProduct?.id ?? node.id,
    slug: node.handle ?? fallbackProduct?.slug ?? normalizeValue(node.title),
    name: node.title ?? fallbackProduct?.name ?? 'ELURA Product',
    category: node.productType || inferCategory(fallbackProduct, node.handle ?? '', node.title ?? ''),
    price: Number.isNaN(price) ? 0 : price,
    currencyCode: variant?.price?.currencyCode ?? 'GBP',
    sku: variant?.sku || fallbackProduct?.sku || '',
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
  const [user, setUser] = useState(() => readStoredValue('elura-user', null))
  const [isAuthReady, setIsAuthReady] = useState(!hasFirebaseConfig)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    window.localStorage.setItem('elura-cart', JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    window.localStorage.setItem('elura-wishlist', JSON.stringify(wishlistIds))
  }, [wishlistIds])

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

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  const addToCart = (product, quantity = 1, options = {}) => {
    const { openDrawer = true } = options

    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id)

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }

      return [...current, { ...product, quantity }]
    })

    if (openDrawer) {
      openCart()
    }
  }

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

  const toggleWishlist = (productId) => {
    setWishlistIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    )
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
        isCartOpen,
        wishlistIds,
        wishlistProducts,
        user,
        orders: accountOrders,
        openCart,
        closeCart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        login,
        signup,
        googleLogin,
        forgotPassword,
        logout,
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
