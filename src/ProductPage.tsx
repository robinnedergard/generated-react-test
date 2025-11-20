import { useMemo, useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import './App.css'
import products from './data/products'
import Reviews from './Reviews'
import { getAverageRating } from './utils/reviews'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

type ProductPageProps = {
  onAddToCart: (productId: string) => void
  isHighlighted: (productId: string) => boolean
}

export default function ProductPage({ onAddToCart, isHighlighted }: ProductPageProps) {
  const { id } = useParams<{ id: string }>()
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [averageRating, setAverageRating] = useState<number | null>(null)

  const product = useMemo(() => {
    return products.find((p) => p.id === id)
  }, [id])

  // Scroll to top when product page loads or product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  useEffect(() => {
    if (!product) return
    const loadRating = () => {
      const rating = getAverageRating(product.id)
      setAverageRating(rating)
    }
    loadRating()
  }, [product])

  // Listen for storage changes to update rating when new reviews are added
  useEffect(() => {
    if (!product) return

    const handleStorageChange = () => {
      const rating = getAverageRating(product.id)
      setAverageRating(rating)
    }

    window.addEventListener('storage', handleStorageChange)
    // Also listen for custom event from Reviews component
    window.addEventListener('reviewAdded', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('reviewAdded', handleStorageChange)
    }
  }, [product])

  if (!product) {
    return (
      <div className="shop">
        <div className="product-page">
          <div className="product-page__not-found">
            <h1>Product not found</h1>
            <p>Sorry, we couldn't find the product you're looking for.</p>
            <Link to="/" className="btn btn--primary">
              Back to shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
  }

  const handleAddToCart = () => {
    onAddToCart(product.id)
  }

  return (
    <div className="shop">
      <div className="product-page">
        <Link to="/" className="product-page__back">
          ← Back to shop
        </Link>

        <div className="product-page__content">
          <div className="product-page__media">
            <img src={product.image} alt={product.name} />
            {product.badge && <span className="product-card__badge">{product.badge}</span>}
          </div>

          <div className="product-page__details">
            <p className="product-page__category">{product.category}</p>
            <h1 className="product-page__title">{product.name}</h1>
            <p className="product-page__description">{product.description}</p>

            <div className="product-page__meta">
              <span className="product-page__price">{currency.format(product.price)}</span>
              {averageRating !== null && (
                <span className="product-page__rating">★ {averageRating.toFixed(1)}</span>
              )}
            </div>

            <div className="product-page__colors">
              <p className="product-page__colors-label">Available colors:</p>
              <div className="product-page__colors-list">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`product-page__color-option ${
                      selectedColor === color ? 'product-page__color-option--selected' : ''
                    }`}
                    onClick={() => handleColorSelect(color)}
                    aria-label={`Select color ${color}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className={`product-page__cta ${isHighlighted(product.id) ? 'product-card__cta--highlight' : ''}`}
              onClick={handleAddToCart}
            >
              Add to bag
              {isHighlighted(product.id) && (
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

            <div className="product-page__info">
              <h3>Product details</h3>
              <ul>
                <li>Premium materials and craftsmanship</li>
                <li>30-day return policy</li>
                <li>Complimentary shipping on orders over $150</li>
                <li>Design consultation available</li>
              </ul>
            </div>
          </div>
        </div>

        <Reviews productId={product.id} />
      </div>
    </div>
  )
}
