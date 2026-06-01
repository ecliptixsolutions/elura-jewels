# ELURA Jewels Phase 14 Pre-Launch Audit

Date: 2026-05-31
Store: elura-jewels-2.myshopify.com

## Executive Verdict

WARNING - Launch is close, but keep Shopify Payments Test Mode on until the manual Shopify Admin checks below pass.

Code-level launch blockers fixed in this phase:
- Customer account order history no longer uses static/mock order data.
- Customer order details are now served from Shopify Admin GraphQL and protected by Firebase authentication.
- Storefront token fallback was removed from source.
- Local `.env` Shopify/Firebase API version and malformed sender ID line were corrected.
- Checkout code now uses only Shopify Storefront `cart.checkoutUrl`; no custom success URL, cancel URL, or `shop.app` redirect is present in the codebase.

Manual Shopify Admin launch blockers still requiring dashboard verification:
- Refund email setting/template must be checked.
- Refund/return restock workflow must be checked.
- Shop Pay/Shop app redirect behavior must be checked in Shopify Payments settings.
- Full historic customer order history requires the `read_all_orders` scope if you need orders older than Shopify's standard `read_orders` access window.

## Issue 1 - Customer Account And Order History

Status: PASS after code change

Root cause:
- The customer profile previously depended on static `accountOrders` data in `src/data/siteData.js`.
- There was no customer-facing Shopify order detail route.
- Customer order history was not guaranteed to be sourced from Shopify Admin API.

Code changes:
- Removed static `accountOrders` from `src/data/siteData.js`.
- Added protected backend resources in `backend/shopifyAdmin.js`:
  - `GET /api/shopify?resource=customer-orders`
  - `GET /api/shopify?resource=customer-order&id=<legacyOrderId>`
- Added Firebase-authenticated customer protection via `requireAuthenticated` in `backend/security.js`.
- Added frontend API helpers in `src/lib/api.js`.
- Reworked `src/pages/ProfilePage.jsx` to load real Shopify orders with pagination.
- Added `src/pages/OrderDetailsPage.jsx`.
- Added route `/profile/orders/:orderId` in `src/App.jsx`.

Security behavior:
- Anonymous customer order access returns `401 Unauthorized`.
- Order details are returned only when the Firebase user email matches the Shopify order email.

Expected customer output:
- `/profile` shows real Shopify order history for the signed-in user's email.
- `/profile/orders/:orderId` shows real order items, payment status, fulfillment status, shipping/billing addresses, tracking, timeline, and refunds.
- If no Shopify orders exist for the account email, the profile shows an empty-order message.

## Issue 2 - Refund Email Not Received

Status: WARNING - Shopify Admin setting/workflow, not code-controlled

Verified from code:
- There is no refund email sender in the React app or Node API.
- Refund emails are controlled by Shopify Notifications and the refund action used inside Shopify Admin.

Root cause to check:
- On the refund screen, the customer notification may have been unchecked.
- The Order refund notification template may be customized incorrectly.
- The email may be in spam/junk.
- The test order may not have a valid customer email.

Fix in Shopify Admin:
1. Go to Shopify Admin > Settings > Notifications > Customer notifications.
2. Open Order refund.
3. If customized, confirm it includes the required order/refund content or revert to default.
4. Go to Orders > open the test order > Refund.
5. Keep Send notification email to customer enabled.
6. Refund a small test amount and confirm the refund email arrives.

## Issue 3 - Inventory Not Returning After Refund

Status: WARNING - Shopify Admin refund/return workflow, not code-controlled

Verified from code:
- The project does not call inventory adjustment or refund mutations.
- Inventory reduction happens inside Shopify checkout/order processing.
- Inventory return after refund depends on Shopify Admin restock/return actions.

Root cause to check:
- Refund was processed without selecting restock.
- Return was not processed through the return workflow.
- Product inventory tracking is disabled.
- Inventory was restocked to the wrong location.
- The item was fulfilled and refund was issued without return/restock.

Fix in Shopify Admin:
1. Products > product variant > Inventory: confirm Track quantity is enabled.
2. Confirm Continue selling when out of stock is disabled for launch products unless backorders are intended.
3. Orders > open test order.
4. Use Return/Refund workflow.
5. Select the returned item.
6. Select Restock at and choose the correct location.
7. Process the refund.
8. Recheck product inventory quantity.

## Issue 4 - Checkout Redirects To shop.app/pay/remember-me

Status: WARNING - code is clean; Shopify/Shop Pay setting needs verification

Verified from code:
- `src/lib/shopify.js` creates a Storefront API cart.
- The frontend redirects only to `cart.checkoutUrl`.
- `src/context/StoreContext.jsx` calls `window.location.assign(checkoutCart.checkoutUrl)`.
- No codebase references were found for `shop.app`, `remember-me`, `successUrl`, or `cancelUrl`.
- Shopify accepted the generated cart/order GraphQL shape on Admin API `2026-04`.

Code change already made:
- Buyer email prefill is disabled by default to reduce automatic Shop Pay remembered-buyer handoff.

Root cause:
- The `shop.app/pay/remember-me` URL is a Shopify Shop Pay/Shop app remembered-buyer step after payment, not a custom headless redirect from this codebase.
- If it times out after Pay Now but the order/payment/email/inventory all complete, Shopify is processing the order, then the browser/network is failing on the Shop Pay remembered-buyer/order handoff.

Fix options:
1. For final checkout QA, disable Shop Pay temporarily in Shopify Admin > Settings > Payments > Shopify Payments > Manage.
2. Test normal card checkout using Shopify Payments test cards, not a remembered Shop Pay session.
3. Clear browser cookies for `shop.app`, `shopify.com`, and the store domain, then retest.
4. In checkout, avoid saving info/phone remember-me options during QA.
5. Confirm the final page is Shopify's order status page.

Expected checkout result:
- Customer clicks Checkout.
- App redirects to the Shopify-hosted `checkoutUrl`.
- Customer pays on Shopify checkout.
- Customer lands on Shopify Order Status / Order Confirmation page.
- Order appears in Shopify Admin.
- Inventory decreases.
- Confirmation email sends.

## Payment QA Checklist

Use Shopify Payments Test Mode until all rows pass.

PASS required:
- Visa success: `4242424242424242`
- Mastercard success: `5555555555554444`
- American Express success: `378282246310005`
- Generic decline: `4000000000000002`
- Insufficient funds: `4000000000009995`
- Lost card: `4000000000009987`
- Stolen card: `4000000000009979`
- Expired card: `4000000000000069`
- Incorrect CVC: `4000000000000127`
- Processing error: `4000000000000119`
- Incorrect number: `4242424242424241`
- Chargeback/disputed simulation: `4000000000000259`

For each successful payment:
- PASS - Order created in Shopify Admin.
- PASS - Payment status is paid/test.
- PASS - Inventory reduced.
- PASS - Customer email received.
- PASS - Discount appears correctly when applied.
- PASS - Customer account order history shows the order.
- PASS - Order detail route opens only for the matching customer email.

For each failed payment:
- PASS - No paid order is created.
- PASS - Checkout displays the expected Shopify-hosted payment error.
- PASS - Inventory is not permanently reduced.

## Go-Live Checklist

PASS - Products load from Shopify Storefront API.
PASS - Collections load from Shopify Storefront API.
PASS - Discounts load from Shopify Admin API.
PASS - WELCOME10 is available through the API.
PASS - Admin customers/subscribers/marketing endpoints reject anonymous access.
PASS - Customer order endpoints reject anonymous access.
PASS - Newsletter invalid email is rejected.
PASS - Storefront token fallback removed from source.
PASS - Admin API client credentials are server-side only.
PASS - Lint passes.
PASS - Production build passes.
PASS - Shopify Admin GraphQL order/refund/fulfillment query shape is valid on `2026-04`.

WARNING - Browser plugin route was unavailable during this run, so visual route verification after the last account-page change could not be completed in the in-app browser. Build/lint/API verification passed.
WARNING - Refund email must be manually verified in Shopify Notifications and refund workflow.
WARNING - Inventory restock must be manually verified in Shopify return/refund workflow.
WARNING - Shop Pay should be disabled or avoided during final checkout QA until the `shop.app/pay/remember-me` timeout is gone.
WARNING - Add `read_all_orders` scope if customer accounts must show orders older than the standard `read_orders` access window.
WARNING - Large assets remain in the production bundle; image optimization can continue after launch hardening.

FAIL - None found in the code paths audited in this phase.

## Scores

Security Score: 8/10
Shopify Integration Score: 8/10
Checkout Reliability Score: 7/10 until Shop Pay redirect is manually resolved
Performance Score: 7/10
Production Readiness Score: 7.5/10

Final launch verdict:
Do not turn off Shopify Payments Test Mode until refund email, restock behavior, and Shop Pay/order-status redirect pass manually inside Shopify Admin. The codebase changes in this phase are production-safe and verified by lint, build, protected endpoint tests, public discount API test, newsletter validation test, and live Shopify GraphQL shape checks.

