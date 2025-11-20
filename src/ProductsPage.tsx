import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import products from './data/products'
import ProductCard from './ProductCard'

type ProductsPageProps = {
  addToCart: (productId: string) => void
  isHighlighted: (productId: string) => boolean
}

export default function ProductsPage({ addToCart, isHighlighted }: ProductsPageProps) {
  // Scroll to top when products page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="products-page">
      <Link to="/" className="product-page__back">
        ← Back to home
      </Link>
      <section className="product-grid">
        <div className="section-heading">
          <p className="eyebrow">Featured pieces</p>
          <h2>Crafted to layer beautifully</h2>
          <p>
            Mix tactile fabrics, natural woods, and sculptural silhouettes for your signature look.
          </p>
        </div>
        <div className="product-grid__items">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={() => addToCart(product.id)}
              isHighlighted={isHighlighted(product.id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
