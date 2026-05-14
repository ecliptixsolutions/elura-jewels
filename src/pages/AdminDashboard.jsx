import { Link } from 'react-router-dom'

function AdminDashboard() {
  return (
    <div className="section-spacing">
      <div className="section-shell">

        <div className="flex items-center justify-between">
          <div>
            <p className="section-eyebrow">
              ADMIN PANEL
            </p>

            <h1 className="mt-3 text-5xl">
              ELURA Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-muted">
              Manage homepage visuals, collections,
              about section, and CTA content.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-2">

          <Link
            to="/admin/banners"
            className="rounded-[24px] border border-black/8 bg-white/70 p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(27,24,19,0.08)]"
          >
            <p className="section-eyebrow">
              HOMEPAGE
            </p>

            <h2 className="mt-3 text-2xl">
              Hero Banner Management
            </h2>

            <p className="mt-3 text-sm text-muted">
              Manage homepage hero banners, videos,
              and rotational sliders.
            </p>
          </Link>

          <Link
            to="/admin/collections"
            className="rounded-[24px] border border-black/8 bg-white/70 p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(27,24,19,0.08)]"
          >
            <p className="section-eyebrow">
              COLLECTIONS
            </p>

            <h2 className="mt-3 text-2xl">
              Collections Management
            </h2>

            <p className="mt-3 text-sm text-muted">
              Manage homepage collection category
              images and descriptions.
            </p>
          </Link>

          <Link
            to="/admin/about"
            className="rounded-[24px] border border-black/8 bg-white/70 p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(27,24,19,0.08)]"
          >
            <p className="section-eyebrow">
              ABOUT
            </p>

            <h2 className="mt-3 text-2xl">
              About ELURA Management
            </h2>

            <p className="mt-3 text-sm text-muted">
              Manage about section content,
              images, and descriptions.
            </p>
          </Link>

          <Link
            to="/admin/cta"
            className="rounded-[24px] border border-black/8 bg-white/70 p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(27,24,19,0.08)]"
          >
            <p className="section-eyebrow">
              CTA SECTION
            </p>

            <h2 className="mt-3 text-2xl">
              CTA Banner Management
            </h2>

            <p className="mt-3 text-sm text-muted">
              Manage footer CTA banners,
              videos, and rotational sliders.
            </p>
          </Link>

        </div>
      </div>
    </div>
  )
}

export default AdminDashboard