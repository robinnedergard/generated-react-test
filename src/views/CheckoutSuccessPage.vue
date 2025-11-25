<template>
  <div class="shop">
    <div class="checkout-page">
      <div v-if="loading" class="checkout-page__empty">
        <h1>Loading...</h1>
      </div>
      <div v-else-if="!checkout" class="checkout-page__empty">
        <h1>Checkout not found</h1>
        <p>Sorry, we couldn't find your checkout information.</p>
        <button type="button" class="btn btn--primary" @click="window.location.href = '/products'">
          Continue Shopping
        </button>
      </div>
      <div v-else class="checkout-page__success">
        <div class="checkout-page__success-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="#22c55e" />
            <path
              d="M20 32L28 40L44 24"
              stroke="white"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <h1 class="checkout-page__success-title">Order Confirmed!</h1>
        <p class="checkout-page__success-message">
          Thank you for your order. We've received your payment and will begin processing your
          shipment shortly.
        </p>
        <div class="checkout-page__success-details">
          <div class="checkout-page__success-detail">
            <span class="checkout-page__success-label">Order ID:</span>
            <span class="checkout-page__success-value">{{ checkout.id }}</span>
          </div>
          <div class="checkout-page__success-detail">
            <span class="checkout-page__success-label">Total:</span>
            <span class="checkout-page__success-value">
              {{ currency.format(checkout.total) }}
            </span>
          </div>
          <div class="checkout-page__success-detail">
            <span class="checkout-page__success-label">Status:</span>
            <span class="checkout-page__success-value">{{ checkout.status }}</span>
          </div>
        </div>
        <div class="checkout-page__success-actions">
          <button
            type="button"
            class="btn btn--primary"
            @click="window.location.href = '/products'"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { GET_CHECKOUT } from '../graphql/queries'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const route = useRoute()
const id = computed(() => route.params.id as string)

const { loading, result } = useQuery(
  GET_CHECKOUT,
  () => ({ id: id.value }),
  () => ({ skip: !id.value }),
)

const checkout = computed(() => result.value?.checkout || null)

const clearCart = inject<() => void>('clearCart', () => {})

// Clear cart when checkout is successful
watch(
  () => checkout.value,
  (newCheckout) => {
    if (newCheckout) {
      clearCart()
    }
  },
)

// Scroll to top on mount
onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
@import '../App.css';
</style>

