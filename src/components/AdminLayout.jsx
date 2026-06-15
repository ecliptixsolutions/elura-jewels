import { BarChart3, BookOpen, Home, Image, LayoutDashboard, LogOut, Mail, Megaphone, Newspaper, Share2, Tags, Users } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { useStore } from '../context/StoreContext.jsx'

const adminLinks = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Homepage CMS', href: '/admin/settings', icon: Home },
  { label: 'Hero Banners', href: '/admin/banners', icon: Image },
  { label: 'Collections CMS', href: '/admin/collections', icon: Tags },
  { label: 'About CMS', href: '/admin/about', icon: BookOpen },
  { label: 'CTA Banners', href: '/admin/cta', icon: Megaphone },
  { label: 'Coupons', href: '/admin/coupons', icon: Tags },
  { label: 'Marketing', href: '/admin/marketing', icon: Mail },
  { label: 'Customers', href: '/admin/marketing/customers', icon: Users },
  { label: 'Subscribers', href: '/admin/marketing/subscribers', icon: BarChart3 },
  { label: 'Newsletter Popup', href: '/admin/marketing/newsletter', icon: Newspaper },
  { label: 'Social Media', href: '/admin/social-media', icon: Share2 },
]

function AdminLayout() {
  const navigate = useNavigate()
  const { logout } = useStore()

  const handleLogout = async () => {
    await logout()
    navigate('/admin-login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 border-r border-black/8 bg-white/80 px-5 py-6 backdrop-blur lg:block">
        <p className="section-eyebrow">ELURA Admin</p>
        <nav className="mt-8 space-y-1">
          {adminLinks.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.href}
                to={item.href}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-semibold transition ${
                    isActive ? 'bg-ink text-ivory' : 'text-muted hover:bg-linen/70 hover:text-ink'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 flex w-full items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-semibold text-muted transition hover:bg-linen/70 hover:text-ink"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>

      <header className="sticky top-0 z-40 border-b border-black/8 bg-white/90 px-5 py-4 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <p className="section-eyebrow">ELURA Admin</p>
          <button type="button" onClick={handleLogout} className="icon-button" aria-label="Logout">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {adminLinks.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold ${
                  isActive ? 'bg-ink text-ivory' : 'bg-linen/70 text-muted'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="lg:pl-72">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
