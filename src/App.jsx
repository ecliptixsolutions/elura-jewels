import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/SiteLayout.jsx'
import { StoreProvider } from './context/StoreContext.jsx'
import AboutPage from './pages/AboutPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import CollectionsPage from './pages/CollectionsPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import FaqPage from './pages/FaqPage.jsx'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import PrivacyPolicy from './pages/privacy-policy.jsx'
import RefundPolicy from './pages/refund-policy.jsx'
import ShopPage from './pages/ShopPage.jsx'
import ShippingReturns from './pages/shipping&returns.jsx'
import Terms from './pages/terms.jsx'
import WishlistPage from './pages/WishlistPage.jsx'

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/shipping&returns" element={<ShippingReturns />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App
