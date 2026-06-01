import { Link } from 'react-router-dom'

const dashboardCards = [
  {
    eyebrow: 'Homepage',
    title: 'Hero Banner Management',
    description: 'Manage media, hero copy, overlay, alignment, and calls to action.',
    href: '/admin/banners',
  },
  {
    eyebrow: 'Collections',
    title: 'Collections CMS',
    description: 'Control the homepage collection section while collections sync from Shopify.',
    href: '/admin/collections',
  },
  {
    eyebrow: 'Marketing',
    title: 'Customer Marketing',
    description: 'View Shopify customers, subscribers, marketing consent, and Shopify Email shortcuts.',
    href: '/admin/marketing',
  },
  {
    eyebrow: 'Footer',
    title: 'Social Media CMS',
    description: 'Manage platform links, ordering, visibility, and footer social icons.',
    href: '/admin/social-media',
  },
  {
    eyebrow: 'Settings',
    title: 'Announcement and Cart',
    description: 'Manage announcement bar content and cart drawer reassurance messages.',
    href: '/admin/settings',
  },
]

function AdminDashboard() {
  return (
    <div className="section-spacing">
      <div className="section-shell">
        <p className="section-eyebrow">Admin Panel</p>
        <h1 className="mt-3 text-5xl">ELURA Dashboard</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Manage storefront CMS content, Shopify-powered commerce surfaces, and customer marketing flows.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {dashboardCards.map((card) => (
            <Link
              key={card.href}
              to={card.href}
              className="rounded-[8px] border border-black/8 bg-white/70 p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(27,24,19,0.08)]"
            >
              <p className="section-eyebrow">{card.eyebrow}</p>
              <h2 className="mt-3 text-2xl">{card.title}</h2>
              <p className="mt-3 text-sm text-muted">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
