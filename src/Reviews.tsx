import { useState, useEffect } from 'react'
import './App.css'

type Review = {
  id: string
  productId: string
  name: string
  text: string
  rating: number
  date: string
}

type StarRatingProps = {
  rating: number
  onRatingChange?: (rating: number) => void
  interactive?: boolean
}

function StarRating({ rating, onRatingChange, interactive = false }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value)
    }
  }

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0)
    }
  }

  const displayRating = hoverRating || rating

  return (
    <div
      className="star-rating"
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={`Rating: ${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          className={`star-rating__star ${value <= displayRating ? 'star-rating__star--filled' : ''} ${interactive ? 'star-rating__star--interactive' : ''}`}
          onClick={() => handleClick(value)}
          onMouseEnter={() => handleMouseEnter(value)}
          onMouseLeave={handleMouseLeave}
          disabled={!interactive}
          aria-label={`${value} star${value !== 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

type ReviewsProps = {
  productId: string
}

function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1
  const num2 = Math.floor(Math.random() * 10) + 1
  return { question: `${num1} + ${num2}`, answer: num1 + num2 }
}

export default function Reviews({ productId }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState(0)
  const [captcha, setCaptcha] = useState(generateCaptcha())
  const [captchaAnswer, setCaptchaAnswer] = useState('')
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter your name')
      return
    }

    if (!text.trim()) {
      setError('Please enter your review')
      return
    }

    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    const answer = parseInt(captchaAnswer, 10)
    if (isNaN(answer) || answer !== captcha.answer) {
      setError('Incorrect captcha answer. Please try again.')
      setCaptcha(generateCaptcha())
      setCaptchaAnswer('')
      return
    }

    setIsSubmitting(true)

    // Simulate a brief delay for better UX
    setTimeout(() => {
      const newReview: Review = {
        id: Date.now().toString(),
        productId,
        name: name.trim(),
        text: text.trim(),
        rating,
        date: new Date().toISOString(),
      }

      const updatedReviews = [newReview, ...reviews]
      setReviews(updatedReviews)
      localStorage.setItem(`reviews-${productId}`, JSON.stringify(updatedReviews))

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('reviewAdded', { detail: { productId } }))

      // Reset form
      setName('')
      setText('')
      setRating(0)
      setCaptchaAnswer('')
      setCaptcha(generateCaptcha())
      setIsSubmitting(false)
      setError('')
    }, 300)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <section className="reviews">
      <h2 className="reviews__title">Customer Reviews</h2>

      {reviews.length > 0 && (
        <div className="reviews__list">
          {reviews.map((review) => (
            <article key={review.id} className="review">
              <div className="review__header">
                <div>
                  <p className="review__name">{review.name}</p>
                  <StarRating rating={review.rating} />
                </div>
                <time className="review__date" dateTime={review.date}>
                  {formatDate(review.date)}
                </time>
              </div>
              <p className="review__text">{review.text}</p>
            </article>
          ))}
        </div>
      )}

      <form className="reviews__form" onSubmit={handleSubmit}>
        <h3 className="reviews__form-title">Write a review</h3>

        <div className="reviews__form-group">
          <label htmlFor="review-name" className="reviews__label">
            Your name
          </label>
          <input
            id="review-name"
            type="text"
            className="reviews__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            disabled={isSubmitting}
          />
        </div>

        <div className="reviews__form-group">
          <label className="reviews__label">Your rating</label>
          <StarRating rating={rating} onRatingChange={setRating} interactive />
        </div>

        <div className="reviews__form-group">
          <label htmlFor="review-text" className="reviews__label">
            Your review
          </label>
          <textarea
            id="review-text"
            className="reviews__textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts about this product..."
            rows={4}
            disabled={isSubmitting}
          />
        </div>

        <div className="reviews__form-group">
          <label htmlFor="review-captcha" className="reviews__label">
            Verification: What is {captcha.question}?
          </label>
          <input
            id="review-captcha"
            type="text"
            className="reviews__input reviews__input--captcha"
            value={captchaAnswer}
            onChange={(e) => setCaptchaAnswer(e.target.value)}
            placeholder="Enter answer"
            disabled={isSubmitting}
          />
        </div>

        {error && <p className="reviews__error">{error}</p>}

        <button type="submit" className="btn btn--primary reviews__submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </section>
  )
}
