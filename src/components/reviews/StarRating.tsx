import { useState } from 'react'

type StarRatingProps = {
  rating: number
  onRatingChange?: (rating: number) => void
  interactive?: boolean
}

export default function StarRating({ rating, onRatingChange, interactive = false }: StarRatingProps) {
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
      className="inline-flex gap-1 items-center"
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={`Rating: ${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          className={`bg-none border-none p-0 text-xl leading-none transition-all ${
            value <= displayRating ? 'text-amber-400' : 'text-slate-200'
          } ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
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

