# ELURA Admin CMS End-to-End Audit

Date: 2026-06-15  
Production URL: `https://www.elurajewels.com/admin-login`  
Local verification URL: `http://localhost:5173/admin-login`  
Credentials: supplied admin account used; password intentionally omitted  
Final verdict: **NOT READY FOR PRODUCTION**

## 1. Executive Summary

The Admin CMS was audited through repository inspection, authenticated production browser testing, local authenticated browser testing, production API probes, responsive checks, lint, build, and dependency audit.

Authentication, route protection, session persistence, logout, the dashboard, and the Firestore-backed CMS editors generally render successfully. All 12 discovered admin routes were opened and recorded.

The Admin CMS is not production-ready because the deployed `/api/shopify` endpoint returns the storefront HTML document with HTTP 200 instead of JSON. As a result, Coupons, Marketing, Customers, and Subscribers silently display empty or zero data. The API client accepts the invalid HTML response as a successful empty object, so administrators receive no useful error.

No production CMS data was saved, deleted, uploaded, or permanently modified during this audit. Save, upload, and persisted destructive workflows were intentionally blocked to comply with the requirement not to change production configuration or real data.

## 2. Environment And Architecture

| Area | Finding |
| --- | --- |
| Frontend | React 19, React Router 7, Vite 8, Tailwind CSS |
| Authentication | Firebase Authentication email/password |
| CMS storage | Firebase Firestore documents under `/cms/*` |
| Media upload | Cloudinary unsigned upload flow |
| Commerce admin data | Shopify Admin GraphQL API through `/api/shopify` |
| Local API | Express server on port `5000` |
| Production hosting | Hostinger; production was serving the frontend as a static SPA |
| Production API | Express endpoint at `/api/shopify`; requires Hostinger Node.js application deployment |
| Admin authorization | Hardcoded email allowlist in frontend, Firestore rules, and backend |
| Automated test framework | None configured |

### Discovered Admin Routes

Visible sidebar routes:

- `/admin`
- `/admin/settings`
- `/admin/banners`
- `/admin/collections`
- `/admin/coupons`
- `/admin/marketing`
- `/admin/marketing/customers`
- `/admin/marketing/subscribers`
- `/admin/social-media`

Hidden or conditionally reachable routes:

- `/admin/marketing/newsletter` - linked from the Marketing page, absent from sidebar
- `/admin/about` - no sidebar or dashboard link
- `/admin/cta` - no sidebar or dashboard link

### CMS Documents

`announcementBar`, `about`, `careGuide`, `cartDrawer`, `collections`, `conversion`, `ctaBanners`, `heroBanners`, `locationTwin`, `newsletterPopup`, and `socialMedia`.

## 3. Complete Coverage Checklist

Legend: **Pass** = actually tested successfully; **Fail** = confirmed defect; **Blocked** = not executed to avoid changing production data; **N/A** = feature is not provided.

| Sidebar Section | Subsection/Page | Navigation | View | Create | Edit | Delete | Search/Filter | Responsive | Status | Issues |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dashboard | `/admin` | Pass | Pass | N/A | N/A | N/A | N/A | Pass | Pass | Dashboard omits some hidden editors |
| Homepage CMS | `/admin/settings` | Pass | Pass | N/A | Pass in memory; persistence Blocked | N/A | N/A | Pass | Unsaved changes lost; multi-document save is non-atomic |
| Hero Banners | `/admin/banners` | Pass | Pass | Pass in memory; persistence Blocked | Pass in memory; persistence Blocked | Pass in memory; persistence Blocked | N/A | Pass | No confirmation; weak validation |
| Collections CMS | `/admin/collections` | Pass | Pass; 6 synced cards visible | N/A | Pass in memory; persistence Blocked | N/A | N/A | Pass | Save persistence Blocked |
| Coupons | `/admin/coupons` | Pass | Fail | N/A | External Shopify only | External Shopify only | N/A | Pass | Production API returns HTML; empty page has no useful error |
| Marketing | `/admin/marketing` | Pass | Fail | N/A | N/A | N/A | N/A | Pass | Silently shows all totals as zero because API response is invalid |
| Customers | `/admin/marketing/customers` | Pass | Fail | N/A | N/A | N/A | Controls render; results Fail | Pass | Empty table, no error/empty state/pagination; double active nav |
| Subscribers | `/admin/marketing/subscribers` | Pass | Fail | N/A | N/A | N/A | Control renders; results Fail | Pass | Empty table, no error/empty state/pagination; double active nav |
| Social Media | `/admin/social-media` | Pass | Pass; existing Instagram item visible | Form required validation Pass; persistence Blocked | Form available; persistence Blocked | In-memory available; persistence Blocked | N/A | Pass | Delete has no confirmation |
| Newsletter Popup | `/admin/marketing/newsletter` | Pass by direct URL/Marketing link | Pass | N/A | Pass in memory; persistence Blocked | N/A | N/A | Pass | Missing from sidebar; weak validation |
| About CMS | `/admin/about` | Pass by direct URL | Pass | N/A | Pass in memory; persistence/upload Blocked | N/A | N/A | Pass | Hidden from all admin navigation |
| CTA Banners | `/admin/cta` | Pass by direct URL | Pass; 2 banners visible | Form available; persistence Blocked | Pass in memory; persistence Blocked | In-memory available; persistence Blocked | N/A | Pass | Hidden from navigation; no confirmation; weak validation |

## 4. Authentication And Permission Results

| Test | Result | Evidence |
| --- | --- | --- |
| Valid admin login | Pass | Redirected to `/admin`; dashboard rendered |
| Invalid email/password | Pass | Rejected with `Unauthorized admin account` |
| Empty login fields | Partial | No `required` attributes or field-specific validation |
| Forgot password with blank email | Pass | Shows `Please enter your admin email first` |
| Password visibility toggle | Functional, accessibility Fail | Toggle button has no accessible name |
| Logout | Pass | Redirected to `/admin-login` |
| Session persistence after refresh | Pass | `/admin/settings` remained authenticated after reload |
| Direct protected URL while logged out | Pass | `/admin` redirected to `/admin-login` |
| Firestore authorization | Static pass | Public CMS reads; writes require allowlisted authenticated email |
| Local unauthenticated Shopify admin API | Pass | Returns `401 application/json` with `{"error":"Unauthorized."}` |
| Production unauthenticated Shopify admin API | Fail | Returns `200 text/html` storefront shell instead of auth response |
| Expired/invalid Firebase session | Blocked | No safe mechanism to force token expiry during audit |
| Multiple admin roles | N/A | Only a single email allowlist role exists |

## 5. Confirmed Issues

### HIGH-01: Production Shopify Admin API Routes Return HTML Instead Of JSON

Affected sections: Coupons, Marketing, Customers, Subscribers  
Severity: **HIGH**

Reproduction:

1. Request `https://www.elurajewels.com/api/shopify?resource=marketing-overview`.
2. Observe HTTP `200`.
3. Observe `Content-Type: text/html` and the storefront `<!doctype html>` response.
4. Open Marketing, Coupons, Customers, or Subscribers in the production Admin CMS.

Expected: `/api/shopify` executes the serverless handler and returns JSON or an authorization error.

Actual: The SPA HTML shell is returned. Marketing silently shows zero totals; list pages render empty data.

Source:

- Hostinger production routing/deployment configuration
- `backend/server.js`
- `api/shopify.js:1`
- `src/lib/api.js:37-43`

Recommended fix:

- Deploy the repository as a Hostinger Node.js application using `npm start`, not as static `dist/` files only.
- Ensure `/api/shopify` reaches the Node/Express application before any SPA fallback.
- Add a deployment smoke test asserting `/api/shopify?resource=marketing-overview` never returns HTML.

### MEDIUM-01: API Client Silently Accepts Invalid Successful Responses

Affected sections: all API-backed admin/customer features  
Severity: **MEDIUM**

`apiRequest` catches JSON parsing failure and substitutes `{}`. Because the invalid production response is HTTP 200, it is treated as success and UI pages silently render empty/zero data.

Source: `src/lib/api.js:37-43`

Recommended fix: require an `application/json` content type, reject JSON parse failures, and validate required response fields before returning payloads.

### MEDIUM-02: Admin Editors Are Missing From Navigation

Affected sections: About CMS, CTA Banners, Newsletter Popup  
Severity: **MEDIUM**

`/admin/about` and `/admin/cta` can only be reached by knowing the direct URL. Newsletter is linked from Marketing but is absent from the sidebar. This prevents a normal admin user from discovering the full CMS.

Source:

- `src/App.jsx:221-227`
- `src/components/AdminLayout.jsx:6-16`

Recommended fix: add all maintained CMS pages to the sidebar or group them under clear nested navigation.

### MEDIUM-03: Unsaved CMS Changes Are Lost Without Warning

Affected sections: Homepage CMS and other editors  
Severity: **MEDIUM**

Reproduction:

1. Open Homepage CMS.
2. Change the announcement message to a temporary value.
3. Navigate to Dashboard.
4. Return to Homepage CMS.

Expected: warn about unsaved changes or preserve the draft.

Actual: the edit is discarded without warning.

Recommended fix: track dirty form state and add an internal navigation blocker plus `beforeunload` warning.

### MEDIUM-04: Destructive Editor Actions Have No Confirmation

Affected sections: Hero Banners, CTA Banners, Social Media  
Severity: **MEDIUM**

Banner removal and social-link deletion immediately remove items from local editor state. If the user then saves, the deletion is persisted without any confirmation or undo.

Source:

- `src/pages/AdminBannersPage.jsx:71,158`
- `src/pages/AdminCTAPage.jsx:145-154`
- `src/pages/AdminSocialMediaPage.jsx:147,343`

Recommended fix: show a confirmation dialog or provide an undo state before saving destructive changes.

### MEDIUM-05: Homepage Settings Save Is Non-Atomic

Affected section: Homepage CMS  
Severity: **MEDIUM**

Five Firestore documents are saved independently with `Promise.all`. If one write fails after others succeed, the page reports a failure while production configuration is partially updated.

Source: `src/pages/AdminSettingsPage.jsx:89-95`

Recommended fix: use a Firestore batch write or transaction so all related settings commit together.

### MEDIUM-06: CMS Editors Have Weak Validation

Affected sections: Hero Banners, CTA Banners, Collections, Newsletter, Homepage CMS  
Severity: **MEDIUM**

Most CMS editors can save empty headings, invalid links, incomplete CTA definitions, or inconsistent content. Only Social Media has meaningful custom URL validation.

Source:

- `src/pages/AdminBannersPage.jsx:89-128`
- `src/pages/AdminCollectionsPage.jsx:63-83`
- `src/pages/AdminNewsletterPage.jsx:34-48`
- `src/pages/AdminSettingsPage.jsx:85-99`

Recommended fix: add client and server-side schemas with required fields, URL validation, numeric bounds, file constraints, and actionable inline errors.

### MEDIUM-07: Dependency Audit Reports High-Severity Vulnerabilities

Severity: **MEDIUM**

`npm audit --omit=dev --audit-level=high` reported 8 vulnerabilities: 3 high and 5 moderate. High findings include `@grpc/grpc-js` denial-of-service issues and React Router vulnerabilities.

Recommended fix: update dependencies using a reviewed lockfile change, rerun lint/build, and regression-test routing/authentication.

### LOW-01: Marketing Parent And Child Links Are Active Together

Affected sections: Customers and Subscribers  
Severity: **LOW**

Both Marketing and the current child route are highlighted because only Dashboard uses exact/end matching.

Source: `src/components/AdminLayout.jsx:36-39,71-82`

Recommended fix: define exact matching rules for parent/child routes or implement nested navigation styling.

### LOW-02: Password Toggle Has No Accessible Name

Affected section: Admin Login  
Severity: **LOW**

The icon-only password visibility button has no `aria-label`. The browser accessibility tree exposes it as an unnamed button.

Source: `src/pages/AdminLoginPage.jsx:144-154`

Recommended fix: add a dynamic label such as `Show password` / `Hide password`, and associate visible labels with login inputs.

### LOW-03: Empty States And Pagination Are Missing

Affected sections: Coupons, Customers, Subscribers  
Severity: **LOW**

Empty API results produce blank cards/tables without explaining whether no records exist or loading failed. Customers and Subscribers have no pagination; the backend fetches at most 100 customers.

Source:

- `src/pages/AdminShopifyCustomersPage.jsx:87-103`
- `src/pages/AdminShopifySubscribersPage.jsx:59-69`
- `backend/shopifyAdmin.js:617`

Recommended fix: add loading/error/empty states and cursor-based pagination.

## 6. CRUD And Cross-Feature Results

| Workflow | Result |
| --- | --- |
| Firestore CMS reads | Pass in production |
| Hero add/remove before save | Pass in memory |
| CMS edits before save | Pass in memory |
| Social required-field validation | Pass through browser-native required controls |
| Save/persistence verification | Blocked to avoid modifying production configuration |
| Upload valid/invalid/oversized media | Blocked to avoid uploading production assets |
| Persisted delete and cleanup | Blocked to avoid changing production data |
| Shopify data sync in Collections | Pass; 6 synced collection cards visible |
| Shopify Coupons/Marketing/Customers/Subscribers | Fail because production API routing is broken |
| Dashboard links | Pass for linked pages |
| Direct hidden routes | Pass |

## 7. Responsive And Accessibility Results

| Check | Result |
| --- | --- |
| Desktop admin layout | Pass |
| Mobile `375x667` layout | Pass; no horizontal document overflow detected |
| Mobile admin navigation | Pass; horizontal navigation displays all visible sections |
| Mobile logout control | Pass |
| Active navigation state | Partial; parent and child both active under Marketing |
| Keyboard/basic semantic controls | Partial |
| Login password toggle accessible name | Fail |
| Breadcrumbs | Not implemented |

## 8. Console, API, And Backend Results

- No browser console errors or warnings were captured during the tested admin route navigation.
- Production `/api/shopify?resource=marketing-overview`:
  - Status: `200`
  - Content type: `text/html`
  - Body begins with the storefront HTML document.
- Local `/api/shopify?resource=marketing-overview` without authorization:
  - Status: `401`
  - Content type: `application/json`
  - Body: `{"error":"Unauthorized."}`
- This proves the local handler authorization works, while the production deployment does not route the request to that handler.

## 9. Automated Test Results

| Command | Result |
| --- | --- |
| `npm run lint` | Pass |
| `npm run build` | Pass |
| `npm audit --omit=dev --audit-level=high` | Fail: 8 vulnerabilities, including 3 high |

No unit, integration, browser E2E, Jest, Vitest, Cypress, or Playwright test suite is configured in `package.json`.

Recommended automated coverage:

- Production API content-type and status smoke tests.
- Admin authentication and protected-route tests.
- Firestore emulator tests for authorized/unauthorized CMS writes.
- CMS form validation and unsaved-change tests.
- Shopify-backed page loading/error/empty-state tests.
- Sidebar route coverage test ensuring every admin route is navigable.

## 10. Untested Or Blocked Items

- Persisted create/edit/delete and cleanup on Firestore CMS documents.
- Cloudinary upload, invalid file type, and oversized upload.
- Save-button double submission and saved-data refresh.
- Production Shopify data accuracy, filters, sorting, customer detail modal, and external Shopify links because the production API route is broken.
- Expired Firebase token behavior.
- Multiple role permission behavior because the system only implements an email allowlist.
- Backend production logs, which were not available from the workspace.

## 11. Readiness Verdict

**NOT READY FOR PRODUCTION**

Release-blocking action:

1. Restore correct production routing/deployment for `/api/shopify`.
2. Make the API client reject non-JSON success responses.
3. Verify Coupons, Marketing, Customers, and Subscribers with real production data.
4. Add missing editor navigation and safeguards for unsaved/destructive changes.
5. Resolve or formally accept the dependency audit findings.
