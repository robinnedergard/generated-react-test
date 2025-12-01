import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation } from '@apollo/client/react'
import { CREATE_CHECKOUT } from './graphql/queries'
import { ErrorMessage } from './components/ErrorMessage'
import { PageContainer } from './components/PageContainer'
import { EmptyCartState } from './components/checkout/EmptyCartState'
import { ShippingAddressForm } from './components/checkout/ShippingAddressForm'
import { PaymentMethodSelect } from './components/checkout/PaymentMethodSelect'
import { OrderSummary } from './components/checkout/OrderSummary'
import { useCart } from './contexts/CartContext'

type CreateCheckoutInput = {
  items: Array<{
    productId: string
    name: string
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
  subtotal: number
  shipping: number
  tax: number
  total: number
}

type CreateCheckoutMutationResult = {
  createCheckout: {
    id: string
    status: string
    total: number
  }
}

export default function CheckoutPage() {
  const { cartItems, subtotal, shipping, total } = useCart()
  const [createCheckout, { loading, error }] =
    useMutation<CreateCheckoutMutationResult>(CREATE_CHECKOUT)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'CREDIT_CARD',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (cartItems.length === 0) {
      alert('Your cart is empty')
      return
    }

    // Calculate tax (assuming 8% tax rate)
    const taxRate = 0.08
    const calculatedTax = subtotal * taxRate
    const calculatedTotal = subtotal + shipping + calculatedTax

    const createCheckoutInput: CreateCheckoutInput = {
      items: cartItems.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      },
      paymentMethod: formData.paymentMethod,
      subtotal,
      shipping,
      tax: calculatedTax,
      total: calculatedTotal,
    }

    try {
      const { data } = await createCheckout({
        variables: { createCheckoutInput },
      })

      if (data?.createCheckout) {
        // Navigate to checkout success page or show confirmation
        window.location.href = `/checkout/${data.createCheckout.id}/success`
      }
    } catch (err) {
      console.error('Checkout error:', err)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (cartItems.length === 0) {
    return <EmptyCartState />
  }

  return (
    <PageContainer backLink={{ to: '/products', label: '← Back to products' }}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 mt-8">
        <section>
          <h1 className="text-4xl mb-8 m-0">Checkout</h1>

          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <ShippingAddressForm formData={formData} onChange={handleChange} />
            <PaymentMethodSelect value={formData.paymentMethod} onChange={handleChange} />

            {error && <ErrorMessage message={`Error processing checkout: ${error.message}`} />}

            <button
              type="submit"
              className="rounded-full px-6 py-3.5 text-sm font-semibold cursor-pointer transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 w-full text-center mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Complete Order'}
            </button>
          </form>
        </section>

        <OrderSummary cartItems={cartItems} subtotal={subtotal} shipping={shipping} total={total} />
      </div>
    </PageContainer>
  )
}
