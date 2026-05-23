import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const domains = [
  {
    origin: 'https://www.elurajewels.co.uk',
    hreflang: 'en-GB',
  },
  {
    origin: 'https://www.elurajewels.com',
    hreflang: 'x-default',
  },
]

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/shop', priority: '0.95', changefreq: 'daily' },
  { path: '/collections', priority: '0.9', changefreq: 'weekly' },
  { path: '/about', priority: '0.75', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/faq', priority: '0.7', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.35', changefreq: 'yearly' },
  { path: '/terms', priority: '0.35', changefreq: 'yearly' },
  { path: '/refund-policy', priority: '0.45', changefreq: 'yearly' },
  { path: '/shipping&returns', priority: '0.55', changefreq: 'monthly' },
]

const categoryRoutes = [
  'Necklaces',
  'Earrings',
  'Rings',
  'Bracelets',
  'Bangles',
].map((category) => ({
  path: `/shop?category=${encodeURIComponent(category)}`,
  priority: '0.85',
  changefreq: 'daily',
}))

const escapeXml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

const urlFor = (origin, path) => {
  const url = new URL(path, origin)
  return url.toString()
}

const readProductRoutes = async () => {
  const siteDataPath = resolve('src/data/siteData.js')
  const source = await readFile(siteDataPath, 'utf8')
  const slugs = [...source.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map((match) => match[1])

  return [...new Set(slugs)].map((slug) => ({
    path: `/product/${slug}`,
    priority: '0.9',
    changefreq: 'daily',
  }))
}

const renderUrl = ({ path, priority, changefreq }, domain, lastmod) => {
  const alternates = domains
    .map(
      (alternate) =>
        `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${escapeXml(
          urlFor(alternate.origin, path),
        )}" />`,
    )
    .join('\n')

  return `  <url>
    <loc>${escapeXml(urlFor(domain.origin, path))}</loc>
${alternates}
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

const productRoutes = await readProductRoutes()
const routes = [...staticRoutes, ...categoryRoutes, ...productRoutes]
const lastmod = new Date().toISOString().slice(0, 10)
const urlEntries = domains
  .flatMap((domain) => routes.map((route) => renderUrl(route, domain, lastmod)))
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>
`

await writeFile(resolve('public/sitemap.xml'), sitemap)
