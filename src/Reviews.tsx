import { useState, useEffect } from 'react'
import ReviewItem from './components/reviews/ReviewItem'
import ReviewForm from './components/reviews/ReviewForm'

type Review = {
  id: string
  productId: string
  name: string
  text: string
  rating: number
  date: string
}

type ReviewsProps = {
  productId: string
}

export default function Reviews({ productId }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadReviews = () => {
      const stored = localStorage.getItem(`reviews-${productId}`)
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Review[]
          // Filter out old reviews without ratings
          const validReviews = parsed.filter((review) => review.rating && review.rating > 0)
          setReviews(validReviews)
          // Update localStorage to remove old reviews
          if (validReviews.length !== parsed.length) {
            localStorage.setItem(`reviews-${productId}`, JSON.stringify(validReviews))
          }
        } catch {
          // Invalid JSON, ignore
        }
      }
    }
    loadReviews()
  }, [productId])

  const handleSubmit = async (review: { name: string; text: string; rating: number }) => {
    setIsSubmitting(true)
    setError('')

    // Simulate a brief delay for better UX
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newReview: Review = {
          id: Date.now().toString(),
          productId,
          name: review.name,
          text: review.text,
          rating: review.rating,
          date: new Date().toISOString(),
        }

        const updatedReviews = [newReview, ...reviews]
        setReviews(updatedReviews)
        localStorage.setItem(`reviews-${productId}`, JSON.stringify(updatedReviews))

        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('reviewAdded', { detail: { productId } }))

        setIsSubmitting(false)
        resolve()
      }, 300)
    })
  }

  return (
    <section className="mt-16 pt-12 border-t border-slate-200">
      <h2 className="text-3xl m-0 mb-8">Customer Reviews</h2>

      {reviews.length > 0 && (
        <div className="flex flex-col gap-6 mb-12">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
      )}

      <ReviewForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
        onError={setError}
      />
    </section>
  )
}
