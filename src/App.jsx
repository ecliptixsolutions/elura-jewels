import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import SiteLayout from './components/SiteLayout.jsx'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'

import { StoreProvider } from './context/StoreContext.jsx'

import AboutPage from './pages/AboutPage.jsx'
import AdminDashboard from './pages/AdminDashboard'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminBannersPage from './pages/AdminBannersPage'
import AuthPage from './pages/AuthPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import CollectionsPage from './pages/CollectionsPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import FaqPage from './pages/FaqPage.jsx'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import PrivacyPolicy from './pages/privacy-policy.jsx'
import ProductPage from './pages/ProductPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import RefundPolicy from './pages/refund-policy.jsx'
import ShippingReturns from './pages/shipping&returns.jsx'
import ShopPage from './pages/ShopPage.jsx'
import Terms from './pages/terms.jsx'
import WishlistPage from './pages/WishlistPage.jsx'
import AdminCollectionsPage from './pages/AdminCollectionsPage'
import AdminAboutPage from './pages/AdminAboutPage'
import AdminCTAPage from './pages/AdminCTAPage'

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>

          {/* MAIN WEBSITE */}
          <Route element={<SiteLayout />}>

            <Route index element={<HomePage />} />

            <Route path="/shop" element={<ShopPage />} />

            <Route
              path="/collections"
              element={<CollectionsPage />}
            />

            <Route path="/about" element={<AboutPage />} />

            <Route path="/contact" element={<ContactPage />} />

            <Route path="/checkout" element={<CheckoutPage />} />

            <Route path="/faq" element={<FaqPage />} />

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

            {/* PROTECTED ADMIN DASHBOARD */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />

            {/* ADMIN BANNERS PAGE */}
            <Route
              path="/admin/banners"
              element={
                <ProtectedAdminRoute>
                  <AdminBannersPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
  path="/admin/collections"
  element={
    <ProtectedAdminRoute>
      <AdminCollectionsPage />
    </ProtectedAdminRoute>
  }
/>

<Route
  path="/admin/about"
  element={
    <ProtectedAdminRoute>
      <AdminAboutPage />
    </ProtectedAdminRoute>
  }
/>

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
              element={<Navigate to="/" replace />}
            />

            <Route
              path="*"
              element={<NotFoundPage />}
            />

          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App