import { Navigate, Link } from 'react-router-dom'
import { useState } from 'react'
import SEO from '../components/SEO.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { formatCurrency } from '../data/siteData.js'
import { useStore } from '../context/StoreContext.jsx'
import { pageSeo } from '../seo/seoConfig.js'

function CheckoutPage() {
  const { cartItems, cartSubtotal, clearCart, user } = useStore()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState(() => ({
    name: user?.name ?? '',
    address: '',
    phone: '',
    email: user?.email ?? '',
  }))

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          redirectTo: '/checkout',
          notice: 'Please login to continue to checkout',
        }}
      />
    )
  }

  if (submitted) {
    return (
      <div className="section-spacing">
        <SEO {...pageSeo.checkout} canonicalPath="/checkout" />
        <div className="section-shell max-w-3xl text-center">
          <SectionHeading
            eyebrow="Checkout"
            title="Your order has been prepared"
            description="Thank you for shopping with ELURA. A confirmation email will follow shortly."
            align="center"
            as="h1"
          />
          <Link to="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="section-spacing">
      <SEO {...pageSeo.checkout} canonicalPath="/checkout" />
      <div className="section-shell">
        <SectionHeading
          eyebrow="Checkout"
          title="Complete your order"
          description="Enter your delivery details and review the order summary before placing your ELURA order."
          as="h1"
        />

        {cartItems.length === 0 ? (
          <div className="mx-auto max-w-2xl border-t border-black/8 pt-10 text-center">
            <p className="text-lg text-muted">Your cart is currently empty.</p>
            <Link to="/shop" className="btn-primary mt-6">
              Return to Shop
            </Link>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr]">
            <form
              className="space-y-7"
              onSubmit={(event) => {
                event.preventDefault()
                clearCart()
                setSubmitted(true)
              }}
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-3 block text-xs font-medium uppercase tracking-[0.24em] text-muted">
                    Name
                  </label>
                  <input
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, name: event.target.value }))
                    }
                    className="input-shell"
                    required
                  />
                </div>
                <div>
                  <label className="mb-3 block text-xs font-medium uppercase tracking-[0.24em] text-muted">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, email: event.target.value }))
                    }
                    className="input-shell"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-xs font-medium uppercase tracking-[0.24em] text-muted">
                  Address
                </label>
                <textarea
                  rows="4"
                  value={formData.address}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, address: event.target.value }))
                  }
                  className="input-shell resize-none"
                  required
                />
              </div>

              <div>
                <label className="mb-3 block text-xs font-medium uppercase tracking-[0.24em] text-muted">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, phone: event.target.value }))
                  }
                  className="input-shell"
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                Place Order
              </button>
            </form>

            <aside className="surface h-fit p-7 sm:p-8">
              <p className="section-eyebrow">Order Summary</p>
              <div className="mt-6 space-y-5">
                {cartItems.map((item) => (
                  <article key={item.id} className="flex items-start gap-4">
                    <img
                      src={item.images[0]}
                      alt={`${item.name} luxury jewellery order summary`}
                      loading="lazy"
                      decoding="async"
                      width="80"
                      height="96"
                      className="h-24 w-20 rounded-[14px] object-cover"
                    />
                    <div className="flex-1">
                      <p className="product-name-animated w-fit text-base font-medium text-ink">
                        {item.name}
                      </p>
                      <p className="mt-2 text-sm text-muted">
                        {formatCurrency(item.price)} x {item.quantity}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-8 border-t border-black/8 pt-5">
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>Subtotal</span>
                  <span className="text-xl font-semibold text-ink">
                    {formatCurrency(cartSubtotal)}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckoutPage
