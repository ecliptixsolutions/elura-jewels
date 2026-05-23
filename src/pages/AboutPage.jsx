import SEO from '../components/SEO.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { aboutPageContent } from '../data/siteData.js'
import { pageSeo } from '../seo/seoConfig.js'
import {
  breadcrumbSchema,
  organizationSchema,
} from '../seo/structuredData.js'

function AboutPage() {
  return (
    <div className="section-spacing">
      <SEO
        {...pageSeo.about}
        canonicalPath="/about"
        structuredData={[
          organizationSchema('/about'),
          breadcrumbSchema([
            {
              name: 'Home',
              path: '/',
            },
            {
              name: 'About',
              path: '/about',
            },
          ]),
        ]}
      />
      <div className="section-shell">
        <SectionHeading
          eyebrow="About"
          title="A modern jewellery brand with a quieter luxury point of view"
          description={aboutPageContent.intro}
          as="h1"
        />

        <div className="grid gap-8">
          {aboutPageContent.blocks.map((block, index) => (
            <section
              key={`${block.title}-${index}`}
              className={`grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16 ${
                index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              <img
                src={block.image}
                alt={`${block.title} at ELURA Jewels UK luxury jewellery brand`}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                decoding="async"
                width="720"
                height="900"
                className="h-full min-h-[30rem] w-full rounded-[18px] object-cover"
              />
              <div className="max-w-xl">
                <p className="section-eyebrow">{block.title}</p>
                <h2 className="mt-4 text-4xl sm:text-5xl">{block.title}</h2>
                <p className="mt-6 text-base leading-8 text-muted sm:text-lg">{block.text}</p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AboutPage
