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
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'))
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'))
const CollectionsPage = lazy(() => import('./pages/CollectionsPage.jsx'))
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'))
const FaqPage = lazy(() => import('./pages/FaqPage.jsx'))
const HomePage = lazy(() => import('./pages/HomePage.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))
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

            {/* ADMIN DASHBOARD */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />

            {/* ADMIN BANNERS */}
            <Route
              path="/admin/banners"
              element={
                <ProtectedAdminRoute>
                  <AdminBannersPage />
                </ProtectedAdminRoute>
              }
            />

            {/* ADMIN COLLECTIONS */}
            <Route
              path="/admin/collections"
              element={
                <ProtectedAdminRoute>
                  <AdminCollectionsPage />
                </ProtectedAdminRoute>
              }
            />

            {/* ADMIN ABOUT */}
            <Route
              path="/admin/about"
              element={
                <ProtectedAdminRoute>
                  <AdminAboutPage />
                </ProtectedAdminRoute>
              }
            />

            {/* ADMIN CTA */}
            <Route
              path="/admin/cta"
              element={
                <ProtectedAdminRoute>
                  <AdminCTAPage />
                </ProtectedAdminRoute>
              }
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
