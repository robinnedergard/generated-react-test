import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import Reviews from './Reviews'
import { getAverageRating } from './utils/reviews'
import { GET_PRODUCT, GET_REVIEWS } from './graphql/queries'
import type { Product } from './data/products'
import LoadingState from './components/LoadingState'
import EmptyState from './components/EmptyState'
import PageContainer from './components/PageContainer'
import ProductImage from './components/product/ProductImage'
import ProductDetails from './components/product/ProductDetails'

type ProductPageProps = {
  onAddToCart: (productId: string) => void
  isHighlighted: (productId: string) => boolean
}

type ProductQueryResult = {
  product: Product | null
}

export default function ProductPage({ onAddToCart, isHighlighted }: ProductPageProps) {
  const { id } = useParams<{ id: string }>()
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  const { loading, error, data } = useQuery<ProductQueryResult>(GET_PRODUCT, {
    variables: { id: id || '' },
    skip: !id,
  })

  const { data: reviewsData, refetch: refetchReviews } = useQuery<{
    reviews: Array<{
      id: string
      productId: string
      userName: string
      text: string
      rating: number
      createdAt: string
    }>
  }>(GET_REVIEWS, {
    variables: { productId: id || '' },
    skip: !id,
  })

  const product = data?.product || null

  // Scroll to top when product page loads or product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  // Calculate average rating from reviews
  const averageRating = useMemo(() => {
    if (reviewsData?.reviews) {
      return getAverageRating(reviewsData.reviews)
    }
    return null
  }, [reviewsData])

  // Listen for review added event to refetch reviews
  useEffect(() => {
    if (!id) return

    const handleReviewAdded = () => {
      refetchReviews()
    }

    window.addEventListener('reviewAdded', handleReviewAdded)

    return () => {
      window.removeEventListener('reviewAdded', handleReviewAdded)
    }
  }, [id, refetchReviews])

  if (loading) {
    return <LoadingState />
  }

  if (error || !product) {
    return (
      <EmptyState
        title="Product not found"
        message="Sorry, we couldn't find the product you're looking for."
        actionLabel="Back to products"
        actionTo="/products"
      />
    )
  }

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
  }

  const handleAddToCart = () => {
    onAddToCart(product.id)
  }

  return (
    <PageContainer backLink={{ to: '/products', label: '← Back to products' }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <ProductImage product={product} />
        <ProductDetails
          product={product}
          averageRating={averageRating}
          selectedColor={selectedColor}
          onColorSelect={handleColorSelect}
          onAddToCart={handleAddToCart}
          isHighlighted={isHighlighted(product.id)}
        />
      </div>

      <Reviews productId={product.id} />
    </PageContainer>
  )
}
