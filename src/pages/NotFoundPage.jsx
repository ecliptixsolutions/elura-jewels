import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { pageSeo } from '../seo/seoConfig.js'

function NotFoundPage() {
  return (
    <div className="section-spacing">
      <SEO {...pageSeo.notFound} canonicalPath="/" />
      <div className="section-shell max-w-3xl text-center">
        <SectionHeading
          eyebrow="404"
          title="Page not found"
          description="The page you're looking for isn't available right now."
          align="center"
        />
        <Link to="/" className="btn-primary">
          Return Home
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
