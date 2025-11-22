import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import './App.css'
import { CREATE_CHECKOUT } from './graphql/queries'
import type { Product } from './data/products'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

type CartLineItem = {
  product: Product
  quantity: number
}

type CheckoutPageProps = {
  cartItems: CartLineItem[]
  subtotal: number
  shipping: number
  total: number
}

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

export default function CheckoutPage({ cartItems, subtotal, shipping, total }: CheckoutPageProps) {
  const navigate = useNavigate()
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
        navigate(`/checkout/${data.createCheckout.id}/success`)
      }
    } catch (err) {
      console.error('Checkout error:', err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (cartItems.length === 0) {
    return (
      <div className="shop">
        <div className="checkout-page">
          <div className="checkout-page__empty">
            <h1>Your cart is empty</h1>
            <p>Add items to your cart before proceeding to checkout.</p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => navigate('/products')}
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
        <Link to="/products" className="product-page__back">
          ← Back to products
        </Link>

        <div className="checkout-page__content">
          <div className="checkout-page__form-section">
            <h1 className="checkout-page__title">Checkout</h1>

            <form className="checkout-form" onSubmit={handleSubmit}>
              <section className="checkout-form__section">
                <h2 className="checkout-form__section-title">Shipping Address</h2>
                <div className="checkout-form__row">
                  <div className="checkout-form__group">
                    <label htmlFor="firstName" className="checkout-form__label">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      className="checkout-form__input"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="checkout-form__group">
                    <label htmlFor="lastName" className="checkout-form__label">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      className="checkout-form__input"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="checkout-form__group">
                  <label htmlFor="address" className="checkout-form__label">
                    Street Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    className="checkout-form__input"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="checkout-form__row">
                  <div className="checkout-form__group">
                    <label htmlFor="city" className="checkout-form__label">
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      className="checkout-form__input"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="checkout-form__group">
                    <label htmlFor="state" className="checkout-form__label">
                      State
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      className="checkout-form__input"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="checkout-form__group">
                    <label htmlFor="zipCode" className="checkout-form__label">
                      ZIP Code
                    </label>
                    <input
                      id="zipCode"
                      name="zipCode"
                      type="text"
                      className="checkout-form__input"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="checkout-form__group">
                  <label htmlFor="country" className="checkout-form__label">
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    className="checkout-form__input"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </section>

              <section className="checkout-form__section">
                <h2 className="checkout-form__section-title">Payment Method</h2>
                <div className="checkout-form__group">
                  <label htmlFor="paymentMethod" className="checkout-form__label">
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    className="checkout-form__input"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    required
                  >
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="DEBIT_CARD">Debit Card</option>
                    <option value="PAYPAL">PayPal</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>
              </section>

              {error && (
                <div className="checkout-form__error">
                  <p>Error processing checkout: {error.message}</p>
                </div>
              )}

              <button
                type="submit"
                className="btn btn--primary btn--full checkout-form__submit"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Complete Order'}
              </button>
            </form>
          </div>

          <div className="checkout-page__summary">
            <h2 className="checkout-page__summary-title">Order Summary</h2>
            <div className="checkout-page__items">
              {cartItems.map((item) => (
                <div key={item.product.id} className="checkout-page__item">
                  <div className="checkout-page__item-info">
                    <h3>{item.product.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <div className="checkout-page__item-price">
                    {currency.format(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="checkout-page__totals">
              <div className="checkout-page__total-row">
                <span>Subtotal</span>
                <span>{currency.format(subtotal)}</span>
              </div>
              <div className="checkout-page__total-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Complimentary' : currency.format(shipping)}</span>
              </div>
              <div className="checkout-page__total-row checkout-page__total-row--final">
                <span>Total</span>
                <span>{currency.format(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
