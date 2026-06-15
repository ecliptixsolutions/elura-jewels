# Hostinger Deployment

The ELURA website must be deployed as a **Hostinger Node.js application**, not as only static files in `public_html`.

The Node server serves:

- The production Vite build from `dist/`
- Shopify Admin API at `/api/shopify`
- Contact email endpoint at `/send-email`
- React SPA routes such as `/admin`, `/shop`, and `/product/*`

## Hostinger Setup

1. Confirm the plan supports Node.js Web Apps. Hostinger currently supports them on Business Web Hosting and Cloud plans. VPS plans require manual Node.js configuration.
2. In Hostinger hPanel, create a Node.js Web App for the production domain.
3. Upload or connect the complete repository, excluding local `.env` and `node_modules`.
4. Configure:
   - Framework: Express.js or Other
   - Build command: `npm ci && npm run build`
   - Start command: `npm start`
   - Entry file: `backend/server.js`
   - Output directory: `dist`
   - Node.js version: `22.x`
5. Add every variable from `.env.example` in Hostinger's environment-variable settings.
6. Keep `VITE_API_BASE_URL` empty so the frontend uses same-domain `/api/shopify`.
7. Do not hardcode `PORT`. The application automatically uses Hostinger's injected `PORT`.
8. Redeploy or restart the Node.js application.

## Required Production Secrets

The Shopify-connected admin sections require:

- `SHOPIFY_SHOP`
- `SHOPIFY_CLIENT_ID`
- `SHOPIFY_CLIENT_SECRET`
- `SHOPIFY_ADMIN_API_VERSION`
- `FIREBASE_PROJECT_ID` or `VITE_FIREBASE_PROJECT_ID`
- `ADMIN_EMAILS`

The storefront also requires the appropriate `VITE_FIREBASE_*` and `VITE_SHOPIFY_*` values.

## Production Verification

After deployment, open:

`https://www.elurajewels.com/api/shopify?resource=marketing-overview`

When logged out, the endpoint must return:

- HTTP status `401`
- `Content-Type: application/json`
- JSON body containing `{"error":"Unauthorized."}`

It must never return the website HTML document.

Then log into `/admin-login` and verify:

- Coupons displays Shopify discounts or a genuine empty state.
- Marketing displays Shopify totals.
- Customers displays Shopify customer records.
- Subscribers displays marketing-consent subscribers.

## Static Hosting Warning

Uploading only the contents of `dist/` to Hostinger static hosting cannot run the Shopify Admin API. In that setup, `/api/shopify` will be rewritten to `index.html`, and the Shopify-connected admin sections will not work.
