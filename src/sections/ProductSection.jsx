import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import Reveal from '../components/Reveal.jsx'
import SectionHeading from '../components/SectionHeading.jsx'

function ProductSection({ products }) {
  return (
    <section className="section-spacing">
      <div className="section-shell">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Featured"
            title="Selected pieces for a refined jewellery wardrobe"
            description="A simplified edit of bestselling necklaces, earrings, rings, bangles, and bracelets."
          />
          <Link to="/shop" className="line-link self-start sm:self-auto">
            View All Products
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <Reveal key={`${product.id}-${product.slug || index}`} delay={index * 70}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductSection
