import SEO from '../components/SEO.jsx'
import { pageSeo } from '../seo/seoConfig.js'
import { breadcrumbSchema } from '../seo/structuredData.js'

function ShippingReturnsPage() {
  return (
    <div className="section-spacing">
      <SEO
        {...pageSeo.shipping}
        canonicalPath="/shipping&returns"
        structuredData={breadcrumbSchema([
          {
            name: 'Home',
            path: '/',
          },
          {
            name: 'Shipping and Returns',
            path: '/shipping&returns',
          },
        ])}
      />
      <div className="section-shell">
        <div className="max-w-4xl mx-auto py-16 px-4">
          <h1 className="text-4xl font-semibold mb-6">
            Shipping &amp; Returns &ndash; ELURA Jewels
          </h1>

          <h2 className="text-xl font-medium mt-8 mb-3">1. Order Processing</h2>
          <ul className="list-disc pl-5 text-gray-600 mb-3">
            <li>
              Orders are processed within <strong>1&ndash;3 business days</strong>
            </li>
            <li>Orders placed on weekends are processed the next working day</li>
          </ul>

          <h2 className="text-xl font-medium mt-8 mb-3">2. Shipping Times</h2>
          <ul className="list-disc pl-5 text-gray-600 mb-3">
            <li>UK: 2&ndash;5 business days</li>
            <li>International: 5&ndash;10 business days</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mb-3">
            Delays may occur during peak periods or due to external factors beyond our control.
          </p>

          <h2 className="text-xl font-medium mt-8 mb-3">3. Shipping Fees</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Shipping fees are calculated at checkout based on your location.
          </p>

          <h2 className="text-xl font-medium mt-8 mb-3">4. Tracking</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Tracking details will be emailed to you once your order has been dispatched.
          </p>

          <h2 className="text-xl font-medium mt-8 mb-3">5. Customs &amp; Duties</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            International orders may be subject to customs duties and taxes, which are the
            responsibility of the customer.
          </p>

          <h2 className="text-xl font-medium mt-8 mb-3">6. Returns</h2>
          <ul className="list-disc pl-5 text-gray-600 mb-3">
            <li>
              Return requests must be made within <strong>7 days</strong> of delivery
            </li>
            <li>Items must be unused and in original packaging</li>
          </ul>

          <h2 className="text-xl font-medium mt-8 mb-3">7. Return Process</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            To initiate a return, email us at: <strong>info.elurajewels@gmail.com</strong>
          </p>
          <p className="text-gray-600 leading-relaxed mb-3">Please include:</p>
          <ul className="list-disc pl-5 text-gray-600 mb-3">
            <li>Order number</li>
            <li>Reason for return</li>
          </ul>

          <h2 className="text-xl font-medium mt-8 mb-3">8. Damaged Items</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Damaged items must be reported within <strong>48 hours of delivery</strong> with clear
            photos.
          </p>

          <h2 className="text-xl font-medium mt-8 mb-3">9. Lost Packages</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            We are not responsible for delays caused by courier services, but we will assist you in
            resolving any issues.
          </p>

          <h2 className="text-xl font-medium mt-8 mb-3">10. Incorrect Address</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Please ensure your shipping details are correct. We are not responsible for failed
            deliveries due to incorrect information.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ShippingReturnsPage
