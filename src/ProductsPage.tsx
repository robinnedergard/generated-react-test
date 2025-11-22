import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import './App.css'
import ProductCard from './ProductCard'
import { GET_PRODUCTS } from './graphql/queries'
import type { Product } from './data/products'

type ProductsPageProps = {
  addToCart: (productId: string) => void
  isHighlighted: (productId: string) => boolean
}

type ProductsQueryResult = {
  products: Product[]
}

export default function ProductsPage({ addToCart, isHighlighted }: ProductsPageProps) {
  const location = useLocation()
  const { loading, error, data } = useQuery<ProductsQueryResult>(GET_PRODUCTS)

  // Scroll to top when products page loads or location changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  if (loading) return <div className="products-page">Loading products...</div>
  if (error) return <div className="products-page">Error loading products: {error.message}</div>

  const products = data?.products || []

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
          {products.map((product: Product) => (
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
