import { Copy, Gift, Loader2, Mail, Minus, Plus, ShieldCheck, ShoppingBag, Truck, Undo2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../data/siteData.js'
import { useStore } from '../context/StoreContext.jsx'
import { getShopifyDiscounts } from '../lib/api.js'
import { subscribeCmsDoc } from '../lib/cms.js'

const cartDrawerFallback = {
  freeDeliveryMessage: '',
  secureCheckoutMessage: '',
  easyReturnsMessage: '',
}

function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemove,
}) {
  const { cartOptions, checkout, conversionSettings, updateCartOptions } = useStore()
  const [offers, setOffers] = useState([])
  const [settings, setSettings] = useState(cartDrawerFallback)
  const [copiedCode, setCopiedCode] = useState('')
  const [checkoutError, setCheckoutError] = useState('')
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const freeShippingThreshold = Number(conversionSettings.freeShippingThreshold || 0)
  const giftWrapPrice = Number(conversionSettings.giftWrapPrice || 0)
  const giftWrapEnabled = Boolean(conversionSettings.giftWrapEnabled)
  const giftWrapTotal = cartOptions.giftWrap ? giftWrapPrice : 0
  const estimatedTotal = subtotal + giftWrapTotal
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
  const freeShippingProgress = freeShippingThreshold
    ? Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))
    : 100

  useEffect(() => {
    const unsubscribe = subscribeCmsDoc(
      'cartDrawer',
      cartDrawerFallback,
      setSettings,
    )

    return unsubscribe
  }, [])

  useEffect(() => {
    let isActive = true

    async function loadDiscounts() {
      try {
        const payload = await getShopifyDiscounts()

        if (isActive) {
          setOffers(payload.discounts ?? [])
        }
      } catch {
        if (isActive) {
          setOffers([])
        }
      }
    }

    if (isOpen) {
      loadDiscounts()
    }

    return () => {
      isActive = false
    }
  }, [isOpen])

  const copyOffer = async (code) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    window.setTimeout(() => setCopiedCode(''), 1800)
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    setCheckoutError('')

    try {
      await checkout()
    } catch (error) {
      setCheckoutError(error.message)
      setIsCheckingOut(false)
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/25 transition ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-ivory shadow-[0_0_50px_rgba(15,20,17,0.16)] transition duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/8 px-6 py-5">
          <div>
            <p className="section-eyebrow">Your Cart</p>
            <h2 className="mt-2 text-2xl">Shopping Bag</h2>
          </div>
          <button type="button" onClick={onClose} className="icon-button" aria-label="Close cart">
            <X className="h-4 w-4" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/70">
              <ShoppingBag className="h-7 w-7 text-muted" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl">Your bag is empty</h3>
              <p className="text-sm text-muted">
                Add a few pieces and continue building your ELURA collection.
              </p>
            </div>
            <Link to="/shop" onClick={onClose} className="btn-primary">
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {freeShippingThreshold ? (
                <div className="mb-6 rounded-[8px] border border-black/8 bg-white/75 p-4">
                  <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
                    <span>Free UK Delivery</span>
                    <span>{freeShippingProgress}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-linen">
                    <div
                      className="h-full rounded-full bg-gold transition-all duration-500"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-muted">
                    {remainingForFreeShipping > 0
                      ? `${formatCurrency(remainingForFreeShipping)} away from free UK delivery.`
                      : 'Your order qualifies for free UK delivery.'}
                  </p>
                </div>
              ) : null}

              <div className="space-y-5">
                {items.map((item) => (
                  <article key={item.id} className="flex gap-4 border-b border-black/8 pb-5">
                    <Link to={`/product/${item.slug}`} onClick={onClose}>
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="h-28 w-24 rounded-[14px] object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-muted">
                          {item.category}
                        </p>
                        <Link
                          to={`/product/${item.slug}`}
                          onClick={onClose}
                          className="product-name-animated mt-2 block w-fit text-lg font-medium text-ink"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-2 text-sm text-muted">{formatCurrency(item.price)}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-black/10 bg-white/70">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="inline-flex h-9 w-9 items-center justify-center"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="inline-flex min-w-10 items-center justify-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="inline-flex h-9 w-9 items-center justify-center"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemove(item.id)}
                          className="text-xs font-semibold uppercase tracking-[0.24em] text-muted transition hover:text-gold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {giftWrapEnabled ? (
                  <div className="rounded-[8px] border border-black/8 bg-white/80 p-4">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={Boolean(cartOptions.giftWrap)}
                        onChange={(event) => updateCartOptions({ giftWrap: event.target.checked })}
                        className="mt-1"
                      />
                      <span>
                        <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                          <Gift className="h-4 w-4 text-gold" />
                          Add ELURA gift wrapping
                        </span>
                        <span className="mt-1 block text-sm text-muted">
                          {giftWrapPrice > 0 ? `${formatCurrency(giftWrapPrice)} added at Shopify checkout.` : 'Complimentary presentation added to your order.'}
                        </span>
                      </span>
                    </label>
                    <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.22em] text-muted">
                      Gift Message
                      <textarea
                        value={cartOptions.giftMessage || ''}
                        onChange={(event) => updateCartOptions({ giftMessage: event.target.value })}
                        maxLength={250}
                        rows={3}
                        className="input-shell mt-2 resize-none"
                        placeholder="Add a short message for the recipient"
                      />
                    </label>
                    <p className="mt-2 text-xs text-muted">
                      {(cartOptions.giftMessage || '').length}/250 characters
                    </p>
                  </div>
                ) : null}

                <div className="rounded-[8px] border border-black/8 bg-white/80 p-4">
                  <label className="block text-xs font-semibold uppercase tracking-[0.22em] text-muted">
                    Cart Recovery Email
                    <span className="mt-2 flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gold" />
                      <input
                        type="email"
                        value={cartOptions.recoveryEmail || ''}
                        onChange={(event) => updateCartOptions({ recoveryEmail: event.target.value })}
                        className="input-shell"
                        placeholder="Email for saved cart reminders"
                      />
                    </span>
                  </label>
                  <p className="mt-2 text-xs text-muted">
                    Used to prepare Shopify Email compatible abandoned cart recovery.
                  </p>
                </div>

                {settings.freeDeliveryMessage ? (
                  <div className="flex items-start gap-3 rounded-[8px] bg-white/75 p-4 text-sm text-muted">
                    <Truck className="mt-1 h-4 w-4 flex-none text-gold" />
                    <span>{settings.freeDeliveryMessage}</span>
                  </div>
                ) : null}

                {offers.length > 0 ? (
                  <div className="rounded-[8px] border border-black/8 bg-white/80 p-4">
                    <p className="section-eyebrow">Available Offers</p>
                    <div className="mt-4 space-y-3">
                      {offers.map((offer) => (
                        <button
                          key={offer.id}
                          type="button"
                          onClick={() => copyOffer(offer.code)}
                          className="flex w-full items-center justify-between gap-3 rounded-[8px] border border-black/8 px-4 py-3 text-left transition hover:border-gold"
                        >
                          <span>
                            <span className="block text-sm font-semibold text-ink">{offer.code}</span>
                            <span className="mt-1 block text-xs text-muted">{offer.summary}</span>
                          </span>
                          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                            {copiedCode === offer.code ? 'Coupon Copied' : 'Copy'}
                            <Copy className="h-3.5 w-3.5" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {settings.secureCheckoutMessage ? (
                  <div className="flex items-start gap-3 rounded-[8px] bg-white/75 p-4 text-sm text-muted">
                    <ShieldCheck className="mt-1 h-4 w-4 flex-none text-gold" />
                    <span>{settings.secureCheckoutMessage}</span>
                  </div>
                ) : null}

                {settings.easyReturnsMessage ? (
                  <div className="flex items-start gap-3 rounded-[8px] bg-white/75 p-4 text-sm text-muted">
                    <Undo2 className="mt-1 h-4 w-4 flex-none text-gold" />
                    <span>{settings.easyReturnsMessage}</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="border-t border-black/8 px-6 py-6">
              <div className="flex items-center justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span className="text-xl font-semibold text-ink">{formatCurrency(subtotal)}</span>
              </div>
              {giftWrapTotal > 0 ? (
                <div className="mt-2 flex items-center justify-between text-sm text-muted">
                  <span>Gift wrapping</span>
                  <span className="font-semibold text-ink">{formatCurrency(giftWrapTotal)}</span>
                </div>
              ) : null}
              <div className="mt-3 flex items-center justify-between text-sm text-muted">
                <span>Estimated total</span>
                <span className="text-xl font-semibold text-ink">{formatCurrency(estimatedTotal)}</span>
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.24em] text-muted">
                Taxes and shipping calculated at checkout
              </p>
              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="btn-primary"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Opening Shopify Checkout
                    </>
                  ) : (
                    'Checkout'
                  )}
                </button>
                {checkoutError ? (
                  <p className="text-sm text-red-600">{checkoutError}</p>
                ) : null}
                <Link to="/shop" onClick={onClose} className="line-link text-center">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

export default CartDrawer
