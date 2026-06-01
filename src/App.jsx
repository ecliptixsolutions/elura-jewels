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

const AboutPage = lazy(() => import('./pages/AboutPage.jsx'))
const AdminAboutPage = lazy(() => import('./pages/AdminAboutPage'))
const AdminBannersPage = lazy(() => import('./pages/AdminBannersPage'))
const AdminCollectionsPage = lazy(() => import('./pages/AdminCollectionsPage'))
const AdminCTAPage = lazy(() => import('./pages/AdminCTAPage'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminCouponsPage = lazy(() => import('./pages/AdminCouponsPage.jsx'))
const AdminMarketingPage = lazy(() => import('./pages/AdminMarketingPage.jsx'))
const AdminNewsletterPage = lazy(() => import('./pages/AdminNewsletterPage.jsx'))
const AdminSettingsPage = lazy(() => import('./pages/AdminSettingsPage.jsx'))
const AdminShopifyCustomersPage = lazy(() => import('./pages/AdminShopifyCustomersPage.jsx'))
const AdminShopifySubscribersPage = lazy(() => import('./pages/AdminShopifySubscribersPage.jsx'))
const AdminSocialMediaPage = lazy(() => import('./pages/AdminSocialMediaPage.jsx'))
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'))
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'))
const CollectionsPage = lazy(() => import('./pages/CollectionsPage.jsx'))
const CollectionPage = lazy(() => import('./pages/CollectionPage.jsx'))
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'))
const FaqPage = lazy(() => import('./pages/FaqPage.jsx'))
const HomePage = lazy(() => import('./pages/HomePage.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage.jsx'))
const PrivacyPolicy = lazy(() => import('./pages/privacy-policy.jsx'))
const ProductPage = lazy(() => import('./pages/ProductPage.jsx'))
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'))
const RefundPolicy = lazy(() => import('./pages/refund-policy.jsx'))
const ShippingReturns = lazy(() => import('./pages/shipping&returns.jsx'))
const ShopPage = lazy(() => import('./pages/ShopPage.jsx'))
const Terms = lazy(() => import('./pages/terms.jsx'))
const WishlistPage = lazy(() => import('./pages/WishlistPage.jsx'))

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
