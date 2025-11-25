<template>
  <Layout
    :cart-items="cartItems"
    :cart-count="cartCount"
    :subtotal="subtotal"
    :shipping="shipping"
    :total="total"
    :free-shipping-message="freeShippingMessage"
    :is-cart-open="isCartOpen"
    @toggle-cart="toggleCart"
    @update-quantity="updateQuantity"
  >
    <router-view />
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, provide } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import Layout from './components/Layout.vue'
import { provideAuth } from './composables/useAuth'
import { GET_PRODUCTS } from './graphql/queries'
import type { Product } from './data/products'

// Provide Auth (must be called in component setup)
provideAuth()

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const freeShippingThreshold = 150
const flatShippingRate = 15

type CartLineItem = {
  product: Product
  quantity: number
}

const cart = ref<Record<string, number>>({})
const isCartOpen = ref(false)
const highlightedProduct = ref<{
  id: string
  token: number
} | null>(null)
const highlightTimeoutRef = ref<number | null>(null)
const highlightSequenceRef = ref(0)

const { result: productsResult } = useQuery(GET_PRODUCTS)
const products = computed(() => (productsResult.value?.products as Product[]) || [])

const productDictionary = computed(() =>
  products.value.reduce<Record<string, Product>>((acc, product) => {
    acc[product.id] = product
    return acc
  }, {}),
)

const cartItems = computed<CartLineItem[]>(() => {
  return Object.entries(cart.value)
    .map(([productId, quantity]) => {
      const product = productDictionary.value[productId]
      if (!product) return null
      return { product, quantity }
    })
    .filter(Boolean) as CartLineItem[]
})

const cartCount = computed(() => cartItems.value.reduce((total, item) => total + item.quantity, 0))
const subtotal = computed(() =>
  cartItems.value.reduce((total, item) => total + item.product.price * item.quantity, 0),
)
const shipping = computed(() =>
  subtotal.value === 0 || subtotal.value >= freeShippingThreshold ? 0 : flatShippingRate,
)
const total = computed(() => subtotal.value + shipping.value)
const freeShippingMessage = computed(() =>
  subtotal.value === 0
    ? 'Start building your bag to unlock complimentary delivery.'
    : shipping.value === 0
      ? 'Shipping is on us today.'
      : `Add ${currency.format(freeShippingThreshold - subtotal.value)} more for free express delivery.`,
)

const updateQuantity = (productId: string, updater: (current: number) => number) => {
  const nextQuantity = updater(cart.value[productId] ?? 0)
  if (nextQuantity <= 0) {
    const rest = { ...cart.value }
    delete rest[productId]
    cart.value = rest
  } else {
    cart.value = { ...cart.value, [productId]: nextQuantity }
  }
}

const addToCart = (productId: string) => {
  updateQuantity(productId, (current) => current + 1)

  // Clear any existing timeout
  if (highlightTimeoutRef.value) {
    clearTimeout(highlightTimeoutRef.value)
    highlightTimeoutRef.value = null
  }

  // If this product is already highlighted, briefly remove the highlight to restart the animation
  if (highlightedProduct.value?.id === productId) {
    highlightedProduct.value = null
    // Use setTimeout with 0ms to ensure the state update is processed before re-adding
    setTimeout(() => {
      const token = ++highlightSequenceRef.value
      highlightedProduct.value = { id: productId, token }
      highlightTimeoutRef.value = window.setTimeout(() => {
        if (highlightedProduct.value?.token === token) {
          highlightedProduct.value = null
        }
      }, 1200)
    }, 0)
  } else {
    // First time highlighting this product
    const token = ++highlightSequenceRef.value
    highlightedProduct.value = { id: productId, token }
    highlightTimeoutRef.value = window.setTimeout(() => {
      if (highlightedProduct.value?.token === token) {
        highlightedProduct.value = null
      }
    }, 1200)
  }
}

onUnmounted(() => {
  if (highlightTimeoutRef.value) {
    clearTimeout(highlightTimeoutRef.value)
  }
})

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}

const clearCart = () => {
  cart.value = {}
}

const isHighlighted = (productId: string) => highlightedProduct.value?.id === productId

// Provide cart functions to child components (reactive values)
provide('addToCart', addToCart)
provide('isHighlighted', isHighlighted)
provide('cartItems', cartItems)
provide('subtotal', subtotal)
provide('shipping', shipping)
provide('total', total)
provide('clearCart', clearCart)
</script>

<style scoped>
@import './App.css';
</style>

