import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from 'lucide-react'
import { useDeferredValue, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { navigationItems } from '../data/siteData.js'
import { useStore } from '../context/StoreContext.jsx'

function Header({ onCartOpen, announcement }) {
  const navigate = useNavigate()
  const { cartCount, wishlistIds, products, user } = useStore()
  const headerRef = useRef(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(60)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const deferredQuery = useDeferredValue(searchQuery)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16)

    onScroll()
    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  useEffect(() => {
    const header = headerRef.current

    if (!header) {
      return undefined
    }

    const updateHeaderHeight = () => {
      setHeaderHeight(Math.ceil(header.getBoundingClientRect().height))
    }
    const resizeObserver = new ResizeObserver(updateHeaderHeight)

    updateHeaderHeight()
    resizeObserver.observe(header)

    return () => resizeObserver.disconnect()
  }, [])

  const trimmedQuery = deferredQuery.trim().toLowerCase()

  const suggestions = !trimmedQuery
    ? []
    : products
        .filter(
          (product) =>
            product.name.toLowerCase().includes(trimmedQuery) ||
            product.category.toLowerCase().includes(trimmedQuery),
        )
        .slice(0, 5)

  const headerClasses = isScrolled
    ? 'border-b border-black/8 bg-[rgba(248,246,242,0.97)] shadow-[0_16px_34px_rgba(27,24,19,0.05)] backdrop-blur-[3px]'
    : 'border-b border-black/6 bg-[rgba(248,246,242,0.94)] shadow-[0_10px_24px_rgba(27,24,19,0.03)] backdrop-blur-[2px]'
  const showAnnouncement = Boolean(announcement?.enabled && announcement?.message?.trim())
  const mobileHeaderOffset = `${headerHeight}px`
  const announcementContent = (
    <div
      className="flex min-h-[34px] items-center justify-center whitespace-nowrap px-1 py-2 text-center text-[7px] font-semibold uppercase tracking-[0.16em] min-[360px]:px-2 min-[360px]:text-[8px] min-[360px]:tracking-[0.2em] sm:px-4 sm:text-[11px] sm:tracking-[0.26em]"
      style={{
        backgroundColor: announcement?.backgroundColor || '#1B1813',
        color: announcement?.textColor || '#F8F6F2',
      }}
    >
      {announcement?.message}
    </div>
  )

  const handleSearchSubmit = (event) => {
    event.preventDefault()

    if (!searchQuery.trim()) {
      return
    }

    navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${headerClasses}`}
      >
        {showAnnouncement ? (
          announcement.linkUrl ? (
            <Link to={announcement.linkUrl}>{announcementContent}</Link>
          ) : (
            announcementContent
          )
        ) : null}
        <div className="section-shell">
          <div className="navbar flex h-[60px] items-center justify-between gap-4 sm:h-[72px]">
            
            <Link
              to="/"
              className="navbar-logo flex h-full items-center gap-2.5 py-1 pr-3 sm:gap-3"
            >
              <img
                src="/elura-logo-mark.webp"
                alt="ELURA Jewels"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width="128"
                height="128"
                className="logo block h-[40px] w-auto object-contain bg-transparent sm:h-[44px] lg:h-[52px]"
              />

              <span className="whitespace-nowrap font-serif text-[13px] font-medium uppercase tracking-[0.12em] text-gold sm:text-[15px] lg:text-[17px]">
                ELURA JEWELS
              </span>
            </Link>

            <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.href}
                  className={({ isActive }) =>
                    `nav-link link-animated ${isActive ? 'nav-link-active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* UPDATED MOBILE + DESKTOP ICONS */}
            <div className="flex items-center gap-1 sm:gap-2">
              
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(true)
                  setMenuOpen(false)
                }}
                className="icon-button"
                aria-label="Open search"
              >
                <Search className="h-4 w-4" />
              </button>

              <Link
                to={user ? '/wishlist' : '/login'}
                state={
                  user
                    ? undefined
                    : {
                        redirectTo: '/wishlist',
                        notice: 'Please login to add items to wishlist',
                      }
                }
                className="icon-button hidden sm:inline-flex"
                aria-label="View wishlist"
              >
                <div className="relative">
                  <Heart className="h-4 w-4" />

                  {wishlistIds.length > 0 && (
                    <span className="absolute -right-2.5 -top-2.5 inline-flex min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
                      {wishlistIds.length}
                    </span>
                  )}
                </div>
              </Link>

              <button
                type="button"
                onClick={onCartOpen}
                className="icon-button"
                aria-label="Open cart"
              >
                <div className="relative">
                  <ShoppingBag className="h-4 w-4" />

                  {cartCount > 0 && (
                    <span className="absolute -right-2.5 -top-2.5 inline-flex min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </div>
              </button>

              <Link
                to={user ? '/profile' : '/login'}
                className="icon-button hidden sm:inline-flex"
                aria-label="View profile"
              >
                <UserRound className="h-4 w-4" />
              </Link>

              {/* UPDATED MENU BUTTON */}
              <button
                type="button"
                onClick={() => setMenuOpen((current) => !current)}
                className="icon-button lg:hidden"
                aria-label="Toggle navigation"
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
              >
                {menuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] bg-[rgba(27,24,19,0.18)] backdrop-blur-[2px] transition duration-300 ${
          searchOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setSearchOpen(false)}
      />

      <div
        className={`fixed left-1/2 top-4 z-[70] w-[calc(100%-2.5rem)] max-w-4xl -translate-x-1/2 transition duration-300 sm:top-6 sm:w-[calc(100%-3rem)] ${
          searchOpen
            ? 'translate-y-0 opacity-100'
            : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <form
          onSubmit={handleSearchSubmit}
          className="relative"
          onClick={(event) => event.stopPropagation()}
        >
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search jewellery..."
            className="search-shell pl-14 pr-16"
            aria-label="Search jewellery"
            autoFocus
          />

          <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />

          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-muted transition hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/30 sm:right-4"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>

          {suggestions.length > 0 && (
            <div className="mt-4 overflow-hidden rounded-[18px] bg-white/92 p-2 shadow-[0_24px_70px_rgba(27,24,19,0.1)] backdrop-blur-xl">
              {suggestions.map((product, index) => (
                <button
                  key={`${product.id}-${product.slug || index}`}
                  type="button"
                  onClick={() => {
                    setSearchOpen(false)
                    navigate(`/product/${product.slug}`)
                  }}
                  className="flex w-full items-center gap-4 rounded-[14px] px-4 py-3 text-left transition hover:bg-mist/90"
                >
                  <img
                    src={product.images[0]}
                    alt={`${product.name} luxury jewellery search result`}
                    loading="lazy"
                    decoding="async"
                    width="56"
                    height="64"
                    className="h-16 w-14 rounded-[12px] object-cover"
                  />

                  <div>
                    <p className="text-sm font-medium text-ink">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-muted">
                      {product.category}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 top-[var(--mobile-menu-top)] z-[41] bg-black/30 transition lg:hidden ${
          menuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        style={{
          '--mobile-menu-top': mobileHeaderOffset,
        }}
        onClick={() => setMenuOpen(false)}
      />

      <div
        id="mobile-navigation"
        className={`fixed right-0 top-[var(--mobile-menu-top)] z-[42] max-h-[calc(100dvh-var(--mobile-menu-top))] w-[min(88vw,360px)] overflow-y-auto rounded-bl-[24px] border-b border-l border-black/8 bg-[rgba(248,246,242,0.99)] px-6 py-5 shadow-[-18px_24px_55px_rgba(27,24,19,0.16)] backdrop-blur-xl transition duration-300 sm:px-7 lg:hidden ${
          menuOpen
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full opacity-0 pointer-events-none'
        }`}
        style={{
          '--mobile-menu-top': mobileHeaderOffset,
        }}
      >
        <div className="flex flex-col gap-5">
          <nav className="flex flex-col">
            {navigationItems.map((item) => (
              <NavLink
                key={`${item.href}-${item.label}`}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `nav-link border-b border-black/8 py-4 leading-[1.45] ${
                    isActive ? 'nav-link-active' : ''
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div>
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.34em] text-gold">
              Your Account
            </p>
            <div className="flex flex-col">
                <Link
                  to={user ? '/wishlist' : '/login'}
                  onClick={() => setMenuOpen(false)}
                  state={
                    user
                      ? undefined
                      : {
                          redirectTo: '/wishlist',
                          notice: 'Please login to add items to wishlist',
                        }
                  }
                  className="flex min-h-12 w-full items-center gap-3 border-b border-black/8 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] transition hover:text-gold"
                >
                  <Heart className="h-4 w-4" />
                  <span>Wishlist</span>
                  {wishlistIds.length > 0 && (
                    <span className="ml-auto inline-flex min-w-6 items-center justify-center rounded-full bg-gold px-2 py-1 text-[10px] font-bold tracking-normal text-white">
                      {wishlistIds.length}
                    </span>
                  )}
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    onCartOpen()
                  }}
                  className="flex min-h-12 w-full items-center gap-3 border-b border-black/8 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.24em] transition hover:text-gold"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="ml-auto inline-flex min-w-6 items-center justify-center rounded-full bg-gold px-2 py-1 text-[10px] font-bold tracking-normal text-white">
                      {cartCount}
                    </span>
                  )}
                </button>

                <Link
                  to={user ? '/profile' : '/login'}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-12 w-full items-center gap-3 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] transition hover:text-gold"
                >
                  <UserRound className="h-4 w-4" />
                  <span>{user ? 'Profile' : 'Login'}</span>
                </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
