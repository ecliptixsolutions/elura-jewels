import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import {
  alternateLinksForPath,
  canonicalForPath,
  defaultSeo,
  getCurrentOrigin,
  toAbsoluteUrl,
  verificationMeta,
} from '../seo/seoConfig.js'

function SEO({
  title,
  description,
  keywords,
  image,
  type = defaultSeo.type,
  robots = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
  canonicalPath,
  canonicalUrl,
  structuredData,
  preloadImages = [],
  author = 'ELURA Jewels',
  geo = true,
}) {
  const location = useLocation()
  const path = canonicalPath || `${location.pathname}${location.search}`
  const origin = getCurrentOrigin()
  const resolvedTitle = title || defaultSeo.title
  const fullTitle = resolvedTitle.includes('ELURA Jewels')
    ? resolvedTitle
    : `${resolvedTitle} | ELURA Jewels`
  const resolvedDescription = description || defaultSeo.description
  const resolvedKeywords = keywords?.length ? keywords : defaultSeo.keywords
  const resolvedCanonical = canonicalUrl || canonicalForPath(path, origin)
  const resolvedImage = toAbsoluteUrl(image || defaultSeo.image, origin)
  const alternates = alternateLinksForPath(path)
  const structuredDataItems = Array.isArray(structuredData)
    ? structuredData.filter(Boolean)
    : [structuredData].filter(Boolean)

  return (
    <Helmet prioritizeSeoTags>
      <html lang={origin.includes('elurajewels.co.uk') ? 'en-GB' : 'en'} />
      <title>{fullTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <meta name="keywords" content={resolvedKeywords.join(', ')} />
      <meta name="robots" content={robots} />
      <meta name="author" content={author} />
      <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="" />
      <link rel="dns-prefetch" href="https://cdn.shopify.com" />
      <link rel="canonical" href={resolvedCanonical} />

      {preloadImages.filter(Boolean).map((preloadImage) => (
        <link
          key={preloadImage}
          rel="preload"
          as="image"
          href={toAbsoluteUrl(preloadImage, origin)}
          fetchPriority="high"
        />
      ))}

      {alternates.map((alternate) => (
        <link
          key={alternate.hrefLang}
          rel="alternate"
          hrefLang={alternate.hrefLang}
          href={alternate.href}
        />
      ))}

      <meta property="og:site_name" content="ELURA Jewels" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={resolvedCanonical} />
      {resolvedImage ? <meta property="og:image" content={resolvedImage} /> : null}
      <meta property="og:locale" content="en_GB" />
      <meta property="og:locale:alternate" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      {resolvedImage ? <meta name="twitter:image" content={resolvedImage} /> : null}

      {geo ? (
        <>
          <meta name="geo.region" content="GB-LND" />
          <meta name="geo.placename" content="London, United Kingdom" />
          <meta name="geo.position" content="51.5072;-0.1276" />
          <meta name="ICBM" content="51.5072, -0.1276" />
        </>
      ) : null}

      {verificationMeta.google ? (
        <meta name="google-site-verification" content={verificationMeta.google} />
      ) : null}
      {verificationMeta.bing ? (
        <meta name="msvalidate.01" content={verificationMeta.bing} />
      ) : null}
      {verificationMeta.pinterest ? (
        <meta name="p:domain_verify" content={verificationMeta.pinterest} />
      ) : null}
      {verificationMeta.facebook ? (
        <meta name="facebook-domain-verification" content={verificationMeta.facebook} />
      ) : null}

      {structuredDataItems.map((item, index) => (
        <script key={`json-ld-${index}`} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  )
}

export default SEO
