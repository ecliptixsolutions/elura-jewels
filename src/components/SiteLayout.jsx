// FILE: src/components/SiteLayout.jsx

import { useEffect, useState } from 'react'

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
import NewsletterPopup from './NewsletterPopup.jsx'
import SocialProofNotification from './SocialProofNotification.jsx'
import { subscribeCmsDoc } from '../lib/cms.js'

const announcementFallback = {
  enabled: false,
  message: '',
  backgroundColor: '#1B1813',
  textColor: '#F8F6F2',
  linkUrl: '',
}

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
  const [announcement, setAnnouncement] = useState(announcementFallback)
  const showAnnouncement = Boolean(announcement.enabled && announcement.message?.trim())

  useEffect(() => {
    const unsubscribe = subscribeCmsDoc(
      'announcement',
      announcementFallback,
      setAnnouncement,
    )

    return unsubscribe
  }, [])

  return (

    <div className="page-shell">

      <ScrollToTop />

      {!isPageLoading && (
        <Header
          key={`${location.pathname}${location.search}`}
          onCartOpen={openCart}
          announcement={announcement}
        />
      )}

      <main
        className={
          isPageLoading
            ? ''
            : showAnnouncement
              ? 'pt-[106px] sm:pt-[118px]'
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

      {!isPageLoading && (
        <NewsletterPopup />
      )}

      {!isPageLoading && (
        <SocialProofNotification />
      )}

    </div>
  )
}

export default SiteLayout
