import SEO from '../components/SEO.jsx'
import { pageSeo } from '../seo/seoConfig.js'
import { breadcrumbSchema } from '../seo/structuredData.js'

function TermsPage() {
  return (
    <div className="section-spacing">
      <SEO
        {...pageSeo.terms}
        canonicalPath="/terms"
        structuredData={breadcrumbSchema([
          {
            name: 'Home',
            path: '/',
          },
          {
            name: 'Terms and Conditions',
            path: '/terms',
          },
        ])}
      />
      <div className="section-shell">
        <div className="max-w-4xl mx-auto py-16 px-4">
          <h1 className="text-4xl font-semibold mb-6">
            Terms &amp; Conditions &ndash; ELURA Jewels
          </h1>

          <p className="text-gray-600 leading-relaxed mb-3">Effective Date: 23 May 2026</p>

          <h2 className="text-xl font-medium mt-8 mb-3">1. Introduction</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            These Terms govern your use of ELURA Jewels. By using our website, you agree to
            comply with these terms.
          </p>

          <h2 className="text-xl font-medium mt-8 mb-3">2. Eligibility</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            You must be at least 18 years old or have parental permission to use this website.
          </p>

          <h2 className="text-xl font-medium mt-8 mb-3">3. Products &amp; Descriptions</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            We aim to ensure product details are accurate, but:
          </p>
          <ul className="list-disc pl-5 text-gray-600 mb-3">
            <li>Colors may vary due to screens</li>
            <li>Slight variations may occur in handcrafted items</li>
          </ul>

          <h2 className="text-xl font-medium mt-8 mb-3">4. Pricing &amp; Currency</h2>
          <ul className="list-disc pl-5 text-gray-600 mb-3">
            <li>All prices are in GBP (&pound;)</li>
            <li>Prices may change without notice</li>
            <li>Taxes and shipping are calculated at checkout</li>
          </ul>

          <h2 className="text-xl font-medium mt-8 mb-3">5. Orders</h2>
          <ul className="list-disc pl-5 text-gray-600 mb-3">
            <li>Orders are subject to availability</li>
            <li>We reserve the right to cancel or refuse orders</li>
            <li>You will receive confirmation via email</li>
          </ul>

          <h2 className="text-xl font-medium mt-8 mb-3">6. Payments</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Payments are processed securely via third-party gateways such as Shopify Payments.
            We do not store payment details.
          </p>

          <h2 className="text-xl font-medium mt-8 mb-3">7. Shipping</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Delivery timelines are estimates and may vary due to external factors.
          </p>

          <h2 className="text-xl font-medium mt-8 mb-3">8. Returns &amp; Refunds</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Please refer to our Refund and Shipping Policy for full details.
          </p>

          <h2 className="text-xl font-medium mt-8 mb-3">9. Intellectual Property</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            All content on this website, including logos, images, and text, is owned by ELURA
            Jewels and protected by copyright laws.
          </p>

          <h2 className="text-xl font-medium mt-8 mb-3">10. Prohibited Use</h2>
          <ul className="list-disc pl-5 text-gray-600 mb-3">
            <li>Use the site for illegal purposes</li>
            <li>Attempt to hack or disrupt the website</li>
            <li>Copy or misuse content</li>
          </ul>

          <h2 className="text-xl font-medium mt-8 mb-3">11. Limitation of Liability</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            We are not responsible for indirect or consequential losses, or delays caused by third
            parties.
          </p>

          <h2 className="text-xl font-medium mt-8 mb-3">12. Governing Law</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            These Terms are governed by the laws of England and Wales.
          </p>

          <h2 className="text-xl font-medium mt-8 mb-3">13. Contact</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Email: info.elurajewels@gmail.com
          </p>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
