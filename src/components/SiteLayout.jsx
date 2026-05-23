// FILE: src/components/SiteLayout.jsx

import { useEffect } from 'react'

import {
  Outlet,
  useLocation,
} from 'react-router-dom'

import {
  useStore,
} from '../context/StoreContext.jsx'

import {
  usePageLoader,
} from '../context/PageLoaderContext.jsx'

import CartDrawer from './CartDrawer.jsx'
import Header from './Header.jsx'
import WhatsAppButton from './WhatsAppButton.jsx'
import FooterSection from '../sections/FooterSection.jsx'

function ScrollToTop() {

  const location =
    useLocation()

  useEffect(() => {

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

  }, [
    location.pathname,
    location.search,
  ])

  return null
}

function SiteLayout() {

  const location =
    useLocation()

  const {
    cartItems,
    closeCart,
    isCartOpen,
    openCart,
    updateCartQuantity,
    removeFromCart,
  } = useStore()

  const {
    isPageLoading,
  } = usePageLoader()

  return (

    <div className="page-shell">

      <ScrollToTop />

      {!isPageLoading && (
        <Header
          key={`${location.pathname}${location.search}`}
          onCartOpen={openCart}
        />
      )}

      <main
        className={
          isPageLoading
            ? ''
            : 'pt-[72px] sm:pt-[84px]'
        }
      >

        <Outlet />

      </main>

      {!isPageLoading && (
        <FooterSection />
      )}

      {!isPageLoading && (
        <CartDrawer
          isOpen={isCartOpen}
          items={cartItems}
          onClose={closeCart}
          onUpdateQuantity={updateCartQuantity}
          onRemove={removeFromCart}
        />
      )}

      {!isPageLoading && (
        <WhatsAppButton />
      )}

    </div>
  )
}

export default SiteLayout