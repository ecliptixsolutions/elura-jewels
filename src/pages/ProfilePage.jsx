import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { formatCurrency } from '../data/siteData.js'
import { useStore } from '../context/StoreContext.jsx'
import { pageSeo } from '../seo/seoConfig.js'

function ProfilePage() {
  const { orders, user, wishlistProducts, logout } = useStore()

  if (!user) {
    return (
      <div className="section-spacing">
        <SEO {...pageSeo.profile} canonicalPath="/profile" />
        <div className="section-shell max-w-3xl text-center">
          <SectionHeading
            eyebrow="Profile"
            title="Sign in to view your account"
            description="Access order history, saved pieces, and your account details."
            align="center"
            as="h1"
          />
          <div className="flex justify-center gap-3">
            <Link to="/login" className="btn-primary">
              Login
            </Link>
            <Link to="/signup" className="btn-secondary">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section-spacing">
      <SEO {...pageSeo.profile} canonicalPath="/profile" />
      <div className="section-shell">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Profile"
            title={`Welcome, ${user.name}`}
            description="Manage account details, review past orders, and revisit favourite pieces."
            as="h1"
          />
          <button type="button" onClick={logout} className="line-link self-start">
            Log Out
          </button>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.84fr_1.16fr] lg:gap-16">
          <section>
            <p className="section-eyebrow">Account Details</p>
            <div className="mt-6 space-y-5 text-sm text-muted">
              <div className="border-b border-black/8 pb-5">
                <p className="font-semibold text-ink">Email</p>
                <p className="mt-1">{user.email}</p>
              </div>
              <div className="border-b border-black/8 pb-5">
                <p className="font-semibold text-ink">Member Since</p>
                <p className="mt-1">{user.memberSince}</p>
              </div>
              <div className="pb-1">
                <p className="font-semibold text-ink">Account ID</p>
                <p className="mt-1">{user.loyaltyId}</p>
              </div>
            </div>

            <div className="mt-10 border-t border-black/8 pt-7">
              <p className="section-eyebrow">Wishlist</p>
              <p className="mt-2 text-sm text-muted">
                {wishlistProducts.length} saved piece{wishlistProducts.length === 1 ? '' : 's'}
              </p>
              <Link to="/wishlist" className="line-link mt-5 inline-flex">
                View Wishlist
              </Link>
            </div>
          </section>

          <section>
            <p className="section-eyebrow">Order History</p>
            <div className="mt-5 space-y-4">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="border-b border-black/8 pb-6 pt-2 last:border-b-0"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
                        {order.id}
                      </p>
                      <h3 className="mt-2 text-xl">{order.items.join(', ')}</h3>
                      <p className="mt-2 text-sm text-muted">{order.date}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">
                        {order.status}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-ink">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
