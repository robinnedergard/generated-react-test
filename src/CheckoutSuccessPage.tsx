import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { GET_CHECKOUT } from './graphql/queries'
import { LoadingState } from './components/LoadingState'
import { EmptyState } from './components/EmptyState'
import { useCart } from './contexts/CartContext'
import { currency } from './utils/constants'

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

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart()
  const { id } = useParams<{ id: string }>()
  const { loading, data } = useQuery<CheckoutQueryResult>(GET_CHECKOUT, {
    variables: { id: id || '' },
    skip: !id,
  })

  useEffect(() => {
    // Clear cart when checkout is successful
    if (data?.checkout) {
      clearCart()
    }
  }, [data?.checkout, clearCart])

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  if (loading) {
    return <LoadingState />
  }

  const checkout = data?.checkout

  if (!checkout) {
    return (
      <EmptyState
        title="Checkout not found"
        message="Sorry, we couldn't find your checkout information."
        actionLabel="Continue Shopping"
        onAction={() => {
          window.location.href = '/products'
        }}
      />
    )
  }

  return (
    <div className="text-center py-16 px-8 flex flex-col items-center gap-8 max-w-2xl mx-auto">
      <div className="mb-4">
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
      <h1 className="text-4xl m-0 font-semibold">Order Confirmed!</h1>
      <p className="text-lg text-slate-600 m-0 leading-relaxed">
        Thank you for your order. We've received your payment and will begin processing your
        shipment shortly.
      </p>
      <div className="bg-white border border-slate-200 rounded-3xl p-8 w-full flex flex-col gap-4">
        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
          <span className="font-semibold text-slate-600">Order ID:</span>
          <span className="font-semibold text-slate-900">{checkout.id}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
          <span className="font-semibold text-slate-600">Total:</span>
          <span className="font-semibold text-slate-900">{currency.format(checkout.total)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-slate-600">Status:</span>
          <span className="font-semibold text-slate-900">{checkout.status}</span>
        </div>
      </div>
      <div className="mt-4">
        <button
          type="button"
          className="rounded-full px-6 py-3.5 text-sm font-semibold cursor-pointer transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5"
          onClick={() => {
            window.location.href = '/products'
          }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}
