// FILE: src/App.jsx

import {
  lazy,
  Suspense,
} from 'react'
import { HelmetProvider } from 'react-helmet-async'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'

import SiteLayout from './components/SiteLayout.jsx'
import AdminLayout from './components/AdminLayout.jsx'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import PageLoader from './components/PageLoader.jsx'
import AppErrorBoundary from './components/AppErrorBoundary.jsx'

import {
  StoreProvider,
} from './context/StoreContext.jsx'

import {
  PageLoaderProvider,
} from './context/PageLoaderContext.jsx'

const chunkRetryKey = 'elura-chunk-reload-attempted'
const chunkLoadPattern = /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i

const lazyRoute = (importPage) =>
  lazy(() =>
    importPage().catch((error) => {
      const canRetry =
        typeof window !== 'undefined' &&
        chunkLoadPattern.test(error?.message || '') &&
        window.sessionStorage.getItem(chunkRetryKey) !== '1'

      if (canRetry) {
        window.sessionStorage.setItem(chunkRetryKey, '1')
        window.location.reload()
        return new Promise(() => {})
      }

      throw error
    }),
  )

const AboutPage = lazyRoute(() => import('./pages/AboutPage.jsx'))
const AdminAboutPage = lazyRoute(() => import('./pages/AdminAboutPage.jsx'))
const AdminBannersPage = lazyRoute(() => import('./pages/AdminBannersPage.jsx'))
const AdminCollectionsPage = lazyRoute(() => import('./pages/AdminCollectionsPage.jsx'))
const AdminCTAPage = lazyRoute(() => import('./pages/AdminCTAPage.jsx'))
const AdminDashboard = lazyRoute(() => import('./pages/AdminDashboard.jsx'))
const AdminCouponsPage = lazyRoute(() => import('./pages/AdminCouponsPage.jsx'))
const AdminMarketingPage = lazyRoute(() => import('./pages/AdminMarketingPage.jsx'))
const AdminNewsletterPage = lazyRoute(() => import('./pages/AdminNewsletterPage.jsx'))
const AdminSettingsPage = lazyRoute(() => import('./pages/AdminSettingsPage.jsx'))
const AdminShopifyCustomersPage = lazyRoute(() => import('./pages/AdminShopifyCustomersPage.jsx'))
const AdminShopifySubscribersPage = lazyRoute(() => import('./pages/AdminShopifySubscribersPage.jsx'))
const AdminSocialMediaPage = lazyRoute(() => import('./pages/AdminSocialMediaPage.jsx'))
const AdminLoginPage = lazyRoute(() => import('./pages/AdminLoginPage.jsx'))
const AuthPage = lazyRoute(() => import('./pages/AuthPage.jsx'))
const CheckoutPage = lazyRoute(() => import('./pages/CheckoutPage.jsx'))
const CollectionsPage = lazyRoute(() => import('./pages/CollectionsPage.jsx'))
const CollectionPage = lazyRoute(() => import('./pages/CollectionPage.jsx'))
const ContactPage = lazyRoute(() => import('./pages/ContactPage.jsx'))
const FaqPage = lazyRoute(() => import('./pages/FaqPage.jsx'))
const HomePage = lazyRoute(() => import('./pages/HomePage.jsx'))
const NotFoundPage = lazyRoute(() => import('./pages/NotFoundPage.jsx'))
const OrderDetailsPage = lazyRoute(() => import('./pages/OrderDetailsPage.jsx'))
const PrivacyPolicy = lazyRoute(() => import('./pages/privacy-policy.jsx'))
const ProductPage = lazyRoute(() => import('./pages/ProductPage.jsx'))
const ProfilePage = lazyRoute(() => import('./pages/ProfilePage.jsx'))
const RefundPolicy = lazyRoute(() => import('./pages/refund-policy.jsx'))
const ShippingReturns = lazyRoute(() => import('./pages/shipping&returns.jsx'))
const ShopPage = lazyRoute(() => import('./pages/ShopPage.jsx'))
const Terms = lazyRoute(() => import('./pages/terms.jsx'))
const WishlistPage = lazyRoute(() => import('./pages/WishlistPage.jsx'))

function AppRoutes() {
  const location = useLocation()
  const resetKey = `${location.pathname}${location.search}`

  return (
    <AppErrorBoundary resetKey={resetKey}>

      <Suspense fallback={<PageLoader />}>

        <Routes>

          {/* MAIN WEBSITE */}
          <Route element={<SiteLayout />}>

            <Route
              index
              element={<HomePage />}
            />

            <Route
              path="/shop"
              element={<ShopPage />}
            />

            <Route
              path="/collections"
              element={<CollectionsPage />}
            />

            <Route
              path="/collections/:handle"
              element={<CollectionPage />}
            />

            <Route
              path="/about"
              element={<AboutPage />}
            />

            <Route
              path="/contact"
              element={<ContactPage />}
            />

            <Route
              path="/checkout"
              element={<CheckoutPage />}
            />

            <Route
              path="/faq"
              element={<FaqPage />}
            />

            <Route
              path="/privacy-policy"
              element={<PrivacyPolicy />}
            />

            <Route
              path="/terms"
              element={<Terms />}
            />

            <Route
              path="/refund-policy"
              element={<RefundPolicy />}
            />

            <Route
              path="/shipping&returns"
              element={<ShippingReturns />}
            />

            <Route
              path="/wishlist"
              element={<WishlistPage />}
            />

            <Route
              path="/profile"
              element={<ProfilePage />}
            />

            <Route
              path="/profile/orders/:orderId"
              element={<OrderDetailsPage />}
            />

            <Route
              path="/product/:slug"
              element={<ProductPage />}
            />

            <Route
              path="/login"
              element={<AuthPage mode="login" />}
            />

            <Route
              path="/signup"
              element={<AuthPage mode="signup" />}
            />

            {/* ADMIN LOGIN */}
            <Route
              path="/admin-login"
              element={<AdminLoginPage />}
            />

            <Route
              path="/home"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />

            <Route
              path="*"
              element={<NotFoundPage />}
            />

          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="banners" element={<AdminBannersPage />} />
            <Route path="collections" element={<AdminCollectionsPage />} />
            <Route path="about" element={<AdminAboutPage />} />
            <Route path="cta" element={<AdminCTAPage />} />
            <Route path="coupons" element={<AdminCouponsPage />} />
            <Route path="marketing" element={<AdminMarketingPage />} />
            <Route path="marketing/customers" element={<AdminShopifyCustomersPage />} />
            <Route path="marketing/subscribers" element={<AdminShopifySubscribersPage />} />
            <Route path="marketing/newsletter" element={<AdminNewsletterPage />} />
            <Route path="social-media" element={<AdminSocialMediaPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

        </Routes>

      </Suspense>

    </AppErrorBoundary>
  )
}

function App() {

  return (

    <HelmetProvider>

      <StoreProvider>

        <PageLoaderProvider>

          <BrowserRouter>

            <AppRoutes />

          </BrowserRouter>

        </PageLoaderProvider>

      </StoreProvider>

    </HelmetProvider>
  )
}

export default App
