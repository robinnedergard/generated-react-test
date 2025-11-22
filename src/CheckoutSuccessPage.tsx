import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import './App.css'
import { GET_CHECKOUT } from './graphql/queries'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

type CheckoutSuccessPageProps = {
  onClearCart?: () => void
}

type CheckoutQueryResult = {
  checkout: {
    id: string
    status: string
    total: number
    items: Array<{
      productId: string
      quantity: number
      price: number
    }>
    shippingAddress: {
      firstName: string
      lastName: string
      address: string
      city: string
      state: string
      zipCode: string
      country: string
    }
    paymentMethod: string
    createdAt: string
  } | null
}

export default function CheckoutSuccessPage({ onClearCart }: CheckoutSuccessPageProps) {
  const { id } = useParams<{ id: string }>()
  const { loading, data } = useQuery<CheckoutQueryResult>(GET_CHECKOUT, {
    variables: { id: id || '' },
    skip: !id,
  })

  useEffect(() => {
    // Clear cart when checkout is successful
    if (data?.checkout && onClearCart) {
      onClearCart()
    }
  }, [data?.checkout, onClearCart])

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  if (loading) {
    return (
      <div className="shop">
        <div className="checkout-page">
          <div className="checkout-page__empty">
            <h1>Loading...</h1>
          </div>
        </div>
      </div>
    )
  }

  const checkout = data?.checkout

  if (!checkout) {
    return (
      <div className="shop">
        <div className="checkout-page">
          <div className="checkout-page__empty">
            <h1>Checkout not found</h1>
            <p>Sorry, we couldn't find your checkout information.</p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                window.location.href = '/products'
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="shop">
      <div className="checkout-page">
        <div className="checkout-page__success">
          <div className="checkout-page__success-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="32" cy="32" r="32" fill="#22c55e" />
              <path
                d="M20 32L28 40L44 24"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="checkout-page__success-title">Order Confirmed!</h1>
          <p className="checkout-page__success-message">
            Thank you for your order. We've received your payment and will begin processing your
            shipment shortly.
          </p>
          <div className="checkout-page__success-details">
            <div className="checkout-page__success-detail">
              <span className="checkout-page__success-label">Order ID:</span>
              <span className="checkout-page__success-value">{checkout.id}</span>
            </div>
            <div className="checkout-page__success-detail">
              <span className="checkout-page__success-label">Total:</span>
              <span className="checkout-page__success-value">
                {currency.format(checkout.total)}
              </span>
            </div>
            <div className="checkout-page__success-detail">
              <span className="checkout-page__success-label">Status:</span>
              <span className="checkout-page__success-value">{checkout.status}</span>
            </div>
          </div>
          <div className="checkout-page__success-actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                // Direct navigation using window.location to ensure page updates
                window.location.href = '/products'
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
