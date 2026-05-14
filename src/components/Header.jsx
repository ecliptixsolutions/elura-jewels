import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from 'lucide-react'
import { useDeferredValue, useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logoImage from '../assets/brand/elura-logo.svg'
import { navigationItems } from '../data/siteData.js'
import { useStore } from '../context/StoreContext.jsx'

function Header({ onCartOpen }) {
  const navigate = useNavigate()
  const { cartCount, wishlistIds, products, user } = useStore()
  const [isScrolled, setIsScrolled] = useState(false)
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
        className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${headerClasses}`}
      >
        <div className="section-shell">
          <div className="navbar flex h-[60px] items-center justify-between gap-4 sm:h-[72px]">
            
            <Link
              to="/"
              className="navbar-logo flex h-full items-center gap-2.5 py-1 pr-3 sm:gap-3"
            >
              <img
                src={logoImage}
                alt="ELURA Jewels"
                className="logo block h-[40px] w-auto object-contain bg-transparent sm:h-[44px] lg:h-[52px]"
              />

              <span className="font-serif text-[15px] font-medium uppercase tracking-[0.1em] text-gold sm:text-[17px] lg:text-[21px]">
                ELURA
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
                className="icon-button"
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
                className="icon-button"
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
            className="absolute right-5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center text-muted transition hover:text-gold"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>

          {suggestions.length > 0 && (
            <div className="mt-4 overflow-hidden rounded-[18px] bg-white/92 p-2 shadow-[0_24px_70px_rgba(27,24,19,0.1)] backdrop-blur-xl">
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    setSearchOpen(false)
                    navigate(`/product/${product.slug}`)
                  }}
                  className="flex w-full items-center gap-4 rounded-[14px] px-4 py-3 text-left transition hover:bg-mist/90"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
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
        className={`fixed inset-0 z-[61] bg-black/30 transition lg:hidden ${
          menuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <div
        className={`fixed inset-x-0 bottom-0 top-[60px] z-[62] overflow-y-auto bg-[rgba(248,246,242,0.985)] px-5 py-6 shadow-[0_20px_40px_rgba(27,24,19,0.08)] transition sm:top-[72px] sm:px-7 lg:hidden ${
          menuOpen
            ? 'translate-y-0 opacity-100'
            : '-translate-y-3 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-4">
          <nav className="flex flex-col gap-3">
            {navigationItems.map((item) => (
              <NavLink
                key={`${item.href}-${item.label}`}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `nav-link block w-full py-3 leading-[1.65] ${
                    isActive ? 'nav-link-active' : ''
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="thin-divider pt-4">
            <form onSubmit={handleSearchSubmit} className="space-y-3">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search jewellery..."
                className="search-shell text-sm"
              />

              <div className="flex flex-col gap-3">
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
                  className="line-link w-full justify-between"
                >
                  Wishlist
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    onCartOpen()
                  }}
                  className="line-link w-full justify-between"
                >
                  Cart
                </button>

                <Link
                  to={user ? '/profile' : '/login'}
                  onClick={() => setMenuOpen(false)}
                  className="line-link w-full justify-between"
                >
                  Profile
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header