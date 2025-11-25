<template>
  <div class="shop">
    <div class="checkout-page">
      <div v-if="cartItems.length === 0" class="checkout-page__empty">
        <h1>Your cart is empty</h1>
        <p>Add items to your cart before proceeding to checkout.</p>
        <button type="button" class="btn btn--primary" @click="router.push('/products')">
          Continue Shopping
        </button>
      </div>
      <template v-else>
        <router-link to="/products" class="product-page__back"> ← Back to products </router-link>

        <div class="checkout-page__content">
          <div class="checkout-page__form-section">
            <h1 class="checkout-page__title">Checkout</h1>

            <form class="checkout-form" @submit.prevent="handleSubmit">
              <section class="checkout-form__section">
                <h2 class="checkout-form__section-title">Shipping Address</h2>
                <div class="checkout-form__row">
                  <div class="checkout-form__group">
                    <label for="firstName" class="checkout-form__label"> First Name </label>
                    <input
                      id="firstName"
                      v-model="formData.firstName"
                      name="firstName"
                      type="text"
                      class="checkout-form__input"
                      required
                    />
                  </div>

                  <div class="checkout-form__group">
                    <label for="lastName" class="checkout-form__label"> Last Name </label>
                    <input
                      id="lastName"
                      v-model="formData.lastName"
                      name="lastName"
                      type="text"
                      class="checkout-form__input"
                      required
                    />
                  </div>
                </div>

                <div class="checkout-form__group">
                  <label for="address" class="checkout-form__label"> Street Address </label>
                  <input
                    id="address"
                    v-model="formData.address"
                    name="address"
                    type="text"
                    class="checkout-form__input"
                    required
                  />
                </div>

                <div class="checkout-form__row">
                  <div class="checkout-form__group">
                    <label for="city" class="checkout-form__label"> City </label>
                    <input
                      id="city"
                      v-model="formData.city"
                      name="city"
                      type="text"
                      class="checkout-form__input"
                      required
                    />
                  </div>

                  <div class="checkout-form__group">
                    <label for="state" class="checkout-form__label"> State </label>
                    <input
                      id="state"
                      v-model="formData.state"
                      name="state"
                      type="text"
                      class="checkout-form__input"
                      required
                    />
                  </div>

                  <div class="checkout-form__group">
                    <label for="zipCode" class="checkout-form__label"> ZIP Code </label>
                    <input
                      id="zipCode"
                      v-model="formData.zipCode"
                      name="zipCode"
                      type="text"
                      class="checkout-form__input"
                      required
                    />
                  </div>
                </div>

                <div class="checkout-form__group">
                  <label for="country" class="checkout-form__label"> Country </label>
                  <input
                    id="country"
                    v-model="formData.country"
                    name="country"
                    type="text"
                    class="checkout-form__input"
                    required
                  />
                </div>
              </section>

              <section class="checkout-form__section">
                <h2 class="checkout-form__section-title">Payment Method</h2>
                <div class="checkout-form__group">
                  <label for="paymentMethod" class="checkout-form__label"> Payment Method </label>
                  <select
                    id="paymentMethod"
                    v-model="formData.paymentMethod"
                    name="paymentMethod"
                    class="checkout-form__input"
                    required
                  >
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="DEBIT_CARD">Debit Card</option>
                    <option value="PAYPAL">PayPal</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>
              </section>

              <div v-if="error" class="checkout-form__error">
                <p>Error processing checkout: {{ error.message }}</p>
              </div>

              <button
                type="submit"
                class="btn btn--primary btn--full checkout-form__submit"
                :disabled="loading"
              >
                {{ loading ? 'Processing...' : 'Complete Order' }}
              </button>
            </form>
          </div>

          <div class="checkout-page__summary">
            <h2 class="checkout-page__summary-title">Order Summary</h2>
            <div class="checkout-page__items">
              <div v-for="item in cartItems" :key="item.product.id" class="checkout-page__item">
                <div class="checkout-page__item-info">
                  <h3>{{ item.product.name }}</h3>
                  <p>Quantity: {{ item.quantity }}</p>
                </div>
                <div class="checkout-page__item-price">
                  {{ currency.format(item.product.price * item.quantity) }}
                </div>
              </div>
            </div>
            <div class="checkout-page__totals">
              <div class="checkout-page__total-row">
                <span>Subtotal</span>
                <span>{{ currency.format(subtotal) }}</span>
              </div>
              <div class="checkout-page__total-row">
                <span>Shipping</span>
                <span>{{ shipping === 0 ? 'Complimentary' : currency.format(shipping) }}</span>
              </div>
              <div class="checkout-page__total-row checkout-page__total-row--final">
                <span>Total</span>
                <span>{{ currency.format(total) }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'
import { useAuth } from '../composables/useAuth'
import { CREATE_CHECKOUT } from '../graphql/queries'
import type { Product } from '../data/products'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

type CartLineItem = {
  product: Product
  quantity: number
}

const router = useRouter()
const { user } = useAuth()

const cartItems = inject<ReturnType<typeof computed<CartLineItem[]>>>('cartItems', computed(() => []))
const subtotal = inject<ReturnType<typeof computed<number>>>('subtotal', computed(() => 0))
const shipping = inject<ReturnType<typeof computed<number>>>('shipping', computed(() => 0))
const total = inject<ReturnType<typeof computed<number>>>('total', computed(() => 0))

const { mutate: createCheckout, loading, error } = useMutation(CREATE_CHECKOUT, {
  refetchQueries: [],
})

const formData = ref({
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States',
  paymentMethod: 'CREDIT_CARD',
})

  const handleSubmit = async () => {
  const items = cartItems.value
  if (items.length === 0) {
    alert('Your cart is empty')
    return
  }

  // Calculate tax (assuming 8% tax rate)
  const taxRate = 0.08
  const calculatedTax = subtotal * taxRate
  const calculatedTotal = subtotal + shipping + calculatedTax

  const createCheckoutInput = {
    items: items.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    })),
    shippingAddress: {
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      address: formData.value.address,
      city: formData.value.city,
      state: formData.value.state,
      zipCode: formData.value.zipCode,
      country: formData.value.country,
    },
    paymentMethod: formData.value.paymentMethod,
    subtotal: subtotal.value,
    shipping: shipping.value,
    tax: calculatedTax,
    total: calculatedTotal,
    userId: user.value?.id,
  }

  try {
    const result = await createCheckout({ createCheckoutInput })
    if (result?.data?.createCheckout) {
      router.push(`/checkout/${result.data.createCheckout.id}/success`)
    }
  } catch (err) {
    console.error('Checkout error:', err)
  }
}
</script>

<style scoped>
@import '../App.css';
</style>

