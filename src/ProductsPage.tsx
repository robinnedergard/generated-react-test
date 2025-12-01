import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import ProductCard from './ProductCard'
import { GET_PRODUCTS } from './graphql/queries'
import type { Product } from './data/products'
import { LoadingState } from './components/LoadingState'
import { ErrorMessage } from './components/ErrorMessage'
import { PageContainer } from './components/PageContainer'
import { useCart } from './contexts/CartContext'

type ProductsQueryResult = {
  products: Product[]
}

export default function ProductsPage() {
  const { addToCart, isHighlighted } = useCart()
  const location = useLocation()
  const { loading, error, data } = useQuery<ProductsQueryResult>(GET_PRODUCTS)

  // Scroll to top when products page loads or location changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  if (loading) return <LoadingState message="Loading products..." />
  if (error) return <ErrorMessage message={`Error loading products: ${error.message}`} />

  const products = data?.products || []

  return (
    <PageContainer backLink={{ to: '/', label: '← Back to home' }} innerClassName="py-8">
      <section className="flex flex-col gap-10">
        <div className="max-w-[520px]">
          <p className="text-xs tracking-widest uppercase text-slate-400">Featured pieces</p>
          <h2 className="m-0">Crafted to layer beautifully</h2>
          <p className="m-0">
            Mix tactile fabrics, natural woods, and sculptural silhouettes for your signature look.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
    </PageContainer>
  )
}
