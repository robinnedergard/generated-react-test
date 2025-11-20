import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import { type Product } from './data/products'
import { getAverageRating } from './utils/reviews'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

type ProductCardProps = {
  product: Product
  onAdd: () => void
  isHighlighted: boolean
}

export default function ProductCard({ product, onAdd, isHighlighted }: ProductCardProps) {
  const [averageRating, setAverageRating] = useState<number | null>(null)

  useEffect(() => {
    const loadRating = () => {
      const rating = getAverageRating(product.id)
      setAverageRating(rating)
    }
    loadRating()

    const handleReviewAdded = () => {
      const newRating = getAverageRating(product.id)
      setAverageRating(newRating)
    }

    window.addEventListener('reviewAdded', handleReviewAdded)
    return () => {
      window.removeEventListener('reviewAdded', handleReviewAdded)
    }
  }, [product.id])

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAdd()
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className={`product-card ${isHighlighted ? 'product-card--highlight' : ''}`}
      data-testid="product-card"
    >
      <div className="product-card__media">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.badge && <span className="product-card__badge">{product.badge}</span>}
      </div>
      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="product-card__description">{product.description}</p>
        <div className="product-card__meta">
          <span className="product-card__price">{currency.format(product.price)}</span>
          {averageRating !== null && (
            <span className="product-card__rating">★ {averageRating.toFixed(1)}</span>
          )}
        </div>
        <div className="product-card__colors">
          {product.colors.map((color) => (
            <span key={color}>{color}</span>
          ))}
        </div>
        <button
          type="button"
          className={`product-card__cta ${isHighlighted ? 'product-card__cta--highlight' : ''}`}
          onClick={handleAddClick}
        >
          Add to bag
          {isHighlighted && (
            <span className="product-card__checkmark" aria-label="Added to bag">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.3333 4L6 11.3333L2.66667 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </button>
      </div>
    </Link>
  )
}
