# ELURA Jewels Mobile UX Audit Report

Date: 2026-06-16  
Site tested: https://elurajewels.com  
Local test target: http://localhost:5173

## 1. Executive Summary

I audited the ELURA Jewels customer mobile experience across home, shop, collections, product, contact, login, wishlist, cart, search, newsletter popup, social proof, and floating WhatsApp flows.

The highest-impact mobile issues were fixed directly:

- Heavy brand logo assets were removed from key first-load UI and replaced with a small optimized brand mark.
- Newsletter popup behavior was made less aggressive on mobile and disabled on critical account/checkout/admin routes.
- WhatsApp no longer overlaps the mobile product sticky add-to-cart bar.
- Product cards, shop filters, carousel dots, cart quantity controls, remove action, contact WhatsApp link, and search close controls now have mobile-friendly tap areas.
- Cart add, quantity controls, remove, and empty-cart behavior were verified locally.
- Local browser checks found no console errors, no broken visible images, and no small visible interactive controls on checked mobile routes after fixes.

## 2. Mobile Readiness Verdict

READY WITH MINOR ISSUES

The mobile store is usable and much less frustrating after this pass. I would still rerun Hostinger/PageSpeed after deployment because the live score depends on Hostinger CDN/cache state, Shopify/Firebase network timing, and live images.

## 3. Viewports Tested

| Viewport | Device Type | Tested |
|---|---|---|
| 320 x 568 | Small phone | Yes |
| 360 x 800 | Common Android | Yes |
| 390 x 844 | iPhone size | Yes |
| 430 x 932 | Large phone | Yes |
| 768 x 1024 | Tablet | Yes |

## 4. Pages and Routes Tested

| Route | Area |
|---|---|
| `/` | Home, hero, header, popup timing, social proof, WhatsApp |
| `/shop` | Product grid, filters, search query UI |
| `/collections` | Collection navigation |
| `/product/emerald-necklace-set` | Product details, sticky add bar, cart add/remove |
| `/contact` | Contact details, WhatsApp link, form layout |
| `/login` | Auth page mobile layout and popup suppression |
| `/wishlist` | Wishlist route and logged-out state |

## 5. Issues Found

| Area | Page/Flow | Viewport | Issue | Severity | Fixed? | Notes |
|------|-----------|----------|-------|----------|--------|-------|
| Performance | Header/footer/auth/loader | All | Large brand assets were loaded in critical UI. | HIGH | Yes | Replaced with `/elura-logo-mark.webp` at 3.6 KB. |
| Popup UX | Newsletter popup | Mobile | Popup could interrupt browsing too early. | HIGH | Yes | Mobile waits at least 45s and deep scroll, and is suppressed on checkout/auth/admin/profile routes. |
| Product CTA | Product page | Mobile | Floating WhatsApp could compete with sticky add-to-cart. | HIGH | Yes | WhatsApp moves above the product sticky bar on product pages. |
| Cart | Cart drawer | Mobile | Quantity buttons were 36px, below recommended touch size. | MEDIUM | Yes | Increased to 44px. |
| Cart | Cart drawer | Mobile | Remove action was visually small. | MEDIUM | Yes | Added 44px minimum tap height and focus ring. |
| Shop | Category filters | Mobile/tablet | Filter buttons were too small on tablet/mobile. | MEDIUM | Yes | Kept 44px chip sizing until desktop breakpoint. |
| Product cards | Wishlist button | Mobile | Wishlist icon target was too small. | MEDIUM | Yes | Increased to 44px with visible focus ring. |
| Home hero | Carousel dots | Mobile | Dots were visually and interactively tiny. | MEDIUM | Yes | Added 44px tap area and accessible labels while keeping the thin visual style. |
| Search | Search modal | Mobile | Close button was smaller than ideal. | LOW | Yes | Increased close target to 44px. |
| Contact | WhatsApp contact link | Mobile | Phone link was only text-height. | LOW | Yes | Added 44px minimum tap height. |
| Performance | Live Hostinger PageSpeed | Mobile | Prior score was around 44 with high LCP/CLS. | MEDIUM | Partially | Code-level fixes made; live PageSpeed should be rerun after deployment/cache refresh. |

## 6. Fixes Implemented

- Added optimized brand asset: `public/elura-logo-mark.webp`.
- Updated brand logo usage in header, footer, auth page, and page loader.
- Delayed Turnstile script loading until newsletter popup is visible.
- Made newsletter popup mobile-aware, route-aware, scroll-aware, and Escape-closeable.
- Made social proof less intrusive by delaying display and reducing its mobile footprint.
- Raised WhatsApp button on product pages to avoid sticky CTA overlap.
- Improved mobile tap targets in product cards, cart drawer, shop filters, contact link, search close, and hero carousel.
- Added extra mobile bottom padding on product page so content is not hidden behind sticky purchase UI.

## 7. Performance Findings

Before this pass, the known Hostinger Page Speed context was:

- Mobile score around 44
- LCP around 7.6s
- Speed Index around 10.4s
- CLS around 0.386
- FCP around 2.8s

Code-level performance improvements made:

- Removed imports of heavy brand assets from critical UI paths.
- Replaced a roughly 297 KB SVG/316 KB PNG logo path with a 3.6 KB WebP mark.
- Deferred Turnstile until the newsletter popup is actually visible.
- Reduced popup/social proof first-view disruption.

Remaining performance work:

- Audit large product/hero images further, especially `ring-1` and older JPG hero assets.
- Rerun Hostinger Page Speed after deployment and CDN/cache refresh.
- Consider preloading the exact CMS-selected first hero image when stable.
- Consider deeper Firebase/Shopify chunk strategy if live network traces still show slow main-thread work.

## 8. Accessibility Findings

Fixed or verified:

- Mobile navigation exposes `aria-expanded` and `aria-controls`.
- Search input has an accessible label.
- Search close, newsletter close, social proof close, cart close, and carousel controls have accessible labels.
- New/touched controls include visible focus rings.
- Newsletter can be dismissed with Escape.
- Core tap targets tested after fixes had no visible under-40px interactive controls on `/`, `/shop`, and `/contact`.

Remaining recommendation:

- Do a full screen-reader pass later with VoiceOver/TalkBack. This pass covered structural and keyboard/tap accessibility, not spoken output quality.

## 9. Test Evidence

Local browser evidence after fixes:

- Viewports tested: 320x568, 360x800, 390x844, 430x932, 768x1024.
- No visible broken images on checked routes.
- No console errors in final local browser sweep.
- No newsletter popup on initial mobile route load.
- Header logo source confirmed as `/elura-logo-mark.webp`.
- Mobile menu opens inside the viewport, locks body scroll, and closes correctly.
- Search opens, accepts input, shows matching suggestion text, and close target is 44x44.
- Product page sticky add bar is visible and WhatsApp does not overlap it.
- Product add-to-cart opens the cart drawer with item and checkout visible.
- Cart quantity controls are 44x44.
- Remove action returns cart to empty state.

## 10. Test Commands and Results

| Command | Result |
|---|---|
| `npm run lint` | Passed |
| `npm run build` | Passed |
| Local browser mobile sweep | Passed for checked routes |
| Product cart flow | Passed locally |

## 11. Untested or Blocked Items

| Item | Reason |
|---|---|
| Final Shopify checkout completion | Not performed to avoid creating a real external checkout/payment side effect. Checkout button visibility and cart readiness were verified. |
| Logged-in profile/order history | No customer test account was provided for a full authenticated order-history pass. |
| Live post-deploy PageSpeed score | Must be rerun after Hostinger auto-deploy and CDN/cache refresh. |
| `.co.uk` SSL/domain behavior | Domain/SSL configuration is outside this mobile UX code pass and was previously in propagation/configuration work. |

## 12. Final Recommendation

Ship these changes, let Hostinger auto-deploy from GitHub, then rerun Hostinger Page Speed and a quick live smoke test on `https://elurajewels.com` for home, shop, product, cart, and checkout handoff.
