import SEO from '../components/SEO.jsx'
import { pageSeo } from '../seo/seoConfig.js'
import { breadcrumbSchema } from '../seo/structuredData.js'

function PrivacyPolicyPage() {
  return (
    <div className="section-spacing">
      <SEO
        {...pageSeo.privacy}
        canonicalPath="/privacy-policy"
        structuredData={breadcrumbSchema([
          {
            name: 'Home',
            path: '/',
          },
          {
            name: 'Privacy Policy',
            path: '/privacy-policy',
          },
        ])}
      />
      <div className="section-shell">
        <div className="max-w-4xl mx-auto py-16 px-4">
          <h1 className="text-4xl font-semibold mb-6">Privacy Policy &ndash; ELURA Jewels</h1>
          <p className="text-gray-600 leading-relaxed mb-3">Effective Date: 23 May 2026</p>
          <p className="text-gray-600 leading-relaxed mb-3">
            At ELURA Jewels (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), your privacy is
            extremely important to us. This Privacy Policy explains how we collect, use, and
            protect your personal data when you visit or make a purchase from our website.
          </p>

          <h2 className="text-xl font-medium mt-8 mb-3">1. Information We Collect</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            We may collect the following types of personal information:
          </p>

          <p className="text-gray-600 leading-relaxed mb-3">
            a) Information you provide directly:
          </p>
          <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-3 space-y-1">
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Billing and shipping address</li>
            <li>Order details</li>
          </ul>

          <p className="text-gray-600 leading-relaxed mb-3">
            b) Automatically collected information:
          </p>
          <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-3 space-y-1">
            <li>IP address</li>
            <li>Browser type</li>
            <li>Device information</li>
            <li>Pages visited and time spent</li>
          </ul>

          <p className="text-gray-600 leading-relaxed mb-3">c) Payment Information:</p>
          <p className="text-gray-600 leading-relaxed mb-3">
            All payments are processed securely via third-party providers (e.g., Shopify
            Payments). We do not store your card details.
          </p>

          <h2 className="text-xl font-medium mt-8 mb-3">2. How We Use Your Information</h2>
          <p className="text-gray-600 leading-relaxed mb-3">We use your data to:</p>
          <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-3 space-y-1">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you</li>
            <li>Improve website performance</li>
            <li>Send marketing emails (if opted in)</li>
            <li>Prevent fraud</li>
          </ul>

          <h2 className="text-xl font-medium mt-8 mb-3">3. Legal Basis (UK GDPR)</h2>
          <p className="text-gray-600 leading-relaxed mb-3">We process data based on:</p>
          <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-3 space-y-1">
            <li>Contract</li>
            <li>Consent</li>
            <li>Legitimate interest</li>
          </ul>

          <h2 className="text-xl font-medium mt-8 mb-3">4. Sharing Your Information</h2>
          <p className="text-gray-600 leading-relaxed mb-3">We may share data with:</p>
          <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-3 space-y-1">
            <li>Payment providers</li>
            <li>Shipping partners</li>
            <li>Email services</li>
            <li>Legal authorities</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mb-3">We NEVER sell your data.</p>

          <h2 className="text-xl font-medium mt-8 mb-3">5. Data Retention</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            We retain data only as necessary.
          </p>

          <h2 className="text-xl font-medium mt-8 mb-3">6. Cookies</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            We use cookies for performance and analytics.
          </p>

          <h2 className="text-xl font-medium mt-8 mb-3">7. Your Rights</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            You may access, update, or delete your data.
          </p>

          <h2 className="text-xl font-medium mt-8 mb-3">8. Security</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            We take reasonable steps to protect your data.
          </p>

          <h2 className="text-xl font-medium mt-8 mb-3">9. Contact</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Email: info.elurajewels@gmail.com
          </p>
          <p className="text-gray-600 leading-relaxed mb-3">Location: West London, UK</p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
