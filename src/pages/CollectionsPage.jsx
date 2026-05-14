import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { collectionCards } from '../data/siteData.js'

function CollectionsPage() {
  const { homeFeaturedProducts } = useStore()

  return (
    <div className="section-spacing">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Collections"
          title="Curated categories with a cleaner route into product discovery"
          description="Explore ELURA by category, then move directly into product pages built for easier browsing and clearer detail."
        />

        <div className="grid items-start gap-6 lg:grid-cols-2">
          {collectionCards.map((card, index) => (
            <Link
              key={`${card.href}-${index}`}
              to={card.href}
              className={`group block overflow-hidden rounded-[18px] ${
                collectionCards.length % 2 === 1 && index === collectionCards.length - 1
                  ? 'lg:col-span-2 lg:mx-auto lg:max-w-[32rem]'
                  : ''
              }`}
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full object-cover transition duration-700 group-hover:scale-[1.02]"
              />

              <div className="px-1 py-5">
                <h2 className="text-3xl">{card.title}</h2>
                <p className="mt-3 text-sm text-muted">{card.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-eyebrow">Signature Edit</p>
              <h2 className="mt-3 text-3xl">A refined starting point</h2>
            </div>

            <Link to="/shop" className="line-link self-start">
              Shop All
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {homeFeaturedProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="group"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="aspect-[4/5] w-full object-cover"
                />

                <div className="pt-4">
                  <p className="product-name-animated text-base font-medium">
                    {product.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionsPage