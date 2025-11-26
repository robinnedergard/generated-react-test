import { useState } from 'react'
import StarRating from './StarRating'
import ErrorMessage from '../ErrorMessage'

function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1
  const num2 = Math.floor(Math.random() * 10) + 1
  return { question: `${num1} + ${num2}`, answer: num1 + num2 }
}

type ReviewFormProps = {
  onSubmit: (review: { name: string; text: string; rating: number }) => Promise<void>
  isSubmitting: boolean
  error: string
  onError: (error: string) => void
}

export default function ReviewForm({ onSubmit, isSubmitting, error, onError }: ReviewFormProps) {
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState(0)
  const [captcha, setCaptcha] = useState(generateCaptcha())
  const [captchaAnswer, setCaptchaAnswer] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onError('')

    if (!name.trim()) {
      onError('Please enter your name')
      return
    }

    if (!text.trim()) {
      onError('Please enter your review')
      return
    }

    if (rating === 0) {
      onError('Please select a rating')
      return
    }

    const answer = parseInt(captchaAnswer, 10)
    if (isNaN(answer) || answer !== captcha.answer) {
      onError('Incorrect captcha answer. Please try again.')
      setCaptcha(generateCaptcha())
      setCaptchaAnswer('')
      return
    }

    try {
      await onSubmit({ name: name.trim(), text: text.trim(), rating })
      // Reset form on success
      setName('')
      setText('')
      setRating(0)
      setCaptchaAnswer('')
      setCaptcha(generateCaptcha())
    } catch {
      // Error handling is done by parent component
    }
  }

  return (
    <form
      className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col gap-6"
      onSubmit={handleSubmit}
    >
      <h3 className="text-xl m-0">Write a review</h3>

      <div className="flex flex-col gap-2">
        <label htmlFor="review-name" className="text-sm font-semibold text-slate-900">
          Your name
        </label>
        <input
          id="review-name"
          type="text"
          className="px-4 py-3 border border-slate-200 rounded-xl text-base font-inherit bg-white text-slate-900 transition-colors focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:opacity-60 disabled:cursor-not-allowed"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-900">Your rating</label>
        <StarRating rating={rating} onRatingChange={setRating} interactive />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="review-text" className="text-sm font-semibold text-slate-900">
          Your review
        </label>
        <textarea
          id="review-text"
          className="px-4 py-3 border border-slate-200 rounded-xl text-base font-inherit bg-white text-slate-900 transition-colors focus:outline-none focus:border-orange-500 focus:ring-3 focus:ring-orange-100 disabled:opacity-60 disabled:cursor-not-allowed resize-y min-h-[100px]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts about this product..."
          rows={4}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="review-captcha" className="text-sm font-semibold text-slate-900">
          Verification: What is {captcha.question}?
        </label>
        <input
          id="review-captcha"
          type="text"
          className="px-4 py-3 border border-slate-200 rounded-xl text-base font-inherit bg-white text-slate-900 transition-colors focus:outline-none focus:border-orange-500 focus:ring-3 focus:ring-orange-100 disabled:opacity-60 disabled:cursor-not-allowed max-w-[120px]"
          value={captchaAnswer}
          onChange={(e) => setCaptchaAnswer(e.target.value)}
          placeholder="Enter answer"
          disabled={isSubmitting}
        />
      </div>

      {error && <ErrorMessage message={error} />}

      <button
        type="submit"
        className="rounded-full px-6 py-3.5 text-sm font-semibold cursor-pointer transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 self-start mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
