import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import ReviewItem from './components/reviews/ReviewItem'
import ReviewForm from './components/reviews/ReviewForm'
import { GET_REVIEWS, CREATE_REVIEW } from './graphql/queries'

type Review = {
  id: string
  productId: string
  userName: string
  text: string
  rating: number
  createdAt: string
}

type ReviewsProps = {
  productId: string
}

export default function Reviews({ productId }: ReviewsProps) {
  const [formError, setFormError] = useState('')
  const {
    data,
    loading,
    error: queryError,
    refetch,
  } = useQuery<{ reviews: Review[] }>(GET_REVIEWS, {
    variables: { productId },
  })

  const [createReview, { loading: isSubmitting, error: mutationError }] = useMutation(
    CREATE_REVIEW,
    {
      onCompleted: () => {
        setFormError('')
        refetch()
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('reviewAdded', { detail: { productId } }))
      },
    },
  )

  const reviews = data?.reviews || []
  const error = formError || mutationError?.message || queryError?.message || ''

  const handleSubmit = async (review: { name?: string; text: string; rating: number }) => {
    setFormError('')
    try {
      await createReview({
        variables: {
          createReviewInput: {
            productId,
            text: review.text,
            rating: review.rating,
            name: review.name,
          },
        },
      })
    } catch (err) {
      // Error is handled by mutation error
      console.error('Failed to create review:', err)
    }
  }

  return (
    <section className="mt-16 pt-12 border-t border-slate-200">
      <h2 className="text-3xl m-0 mb-8">Customer Reviews</h2>

      {loading && <p className="text-slate-600">Loading reviews...</p>}

      {!loading && reviews.length > 0 && (
        <div className="flex flex-col gap-6 mb-12">
          {reviews.map((review: Review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
      )}

      <ReviewForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
        onError={setFormError}
      />
    </section>
  )
}
