import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import ProductCard from '#src/ProductCard'
import { GET_PRODUCTS, GET_REVIEWS_BY_PRODUCT_IDS } from '#src/graphql/queries'
import type { Product } from '#src/data/products'
import { LoadingState } from '#src/components/LoadingState'
import { ErrorMessage } from '#src/components/ErrorMessage'
import { useCart } from '#src/hooks/useCart'
import { getAverageRating } from '#src/utils/reviews'
import { client } from '#src/graphql/client'

type ProductsQueryResult = {
  products: Product[]
}

type ReviewsByProductIdsResult = {
  reviewsByProductIds: Array<{
    id: string
    productId: string
    userName: string
    text: string
    rating: number
    createdAt: string
  }>
}

export default function ProductsPage() {
  const { addToCart, isHighlighted } = useCart()
  const location = useLocation()
  const { loading, error, data } = useQuery<ProductsQueryResult>(GET_PRODUCTS)

  const products = useMemo(() => data?.products || [], [data?.products])

  // Fetch reviews for all products using a single batch query
  const [reviewsMap, setReviewsMap] = useState<
    Record<string, ReviewsByProductIdsResult['reviewsByProductIds']>
  >({})

  useEffect(() => {
    if (products.length === 0) {
      return
    }

    // Fetch all reviews for all products in a single query
    const productIds = products.map((product) => product.id)

    client
      .query<ReviewsByProductIdsResult>({
        query: GET_REVIEWS_BY_PRODUCT_IDS,
        variables: { productIds },
      })
      .then((result) => {
        if (!result.data) {
          throw new Error('No data returned')
        }
        // Group reviews by productId
        const map: Record<string, ReviewsByProductIdsResult['reviewsByProductIds']> = {}
        result.data.reviewsByProductIds.forEach((review) => {
          if (!map[review.productId]) {
            map[review.productId] = []
          }
          map[review.productId].push(review)
        })
        setReviewsMap(map)
      })
      .catch(() => {
        // On error, set empty reviews for all products
        const map: Record<string, ReviewsByProductIdsResult['reviewsByProductIds']> = {}
        products.forEach((product) => {
          map[product.id] = []
        })
        setReviewsMap(map)
      })
  }, [products])

  // Calculate average ratings for each product
  const averageRatings = useMemo(() => {
    const ratings: Record<string, number | null> = {}
    products.forEach((product) => {
      const reviews = reviewsMap[product.id] || []
      ratings[product.id] = getAverageRating(reviews)
    })
    return ratings
  }, [products, reviewsMap])

  // Scroll to top when products page loads or location changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  if (loading) return <LoadingState message="Loading products..." />
  if (error) return <ErrorMessage message={`Error loading products: ${error.message}`} />

  return (
    <section className="flex flex-col gap-10 py-8">
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
            averageRating={averageRatings[product.id] ?? null}
          />
        ))}
      </div>
    </section>
  )
}
