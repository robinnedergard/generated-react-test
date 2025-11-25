<template>
  <div class="shop">
    <div class="product-page">
      <div v-if="loading" class="product-page__not-found">
        <h1>Loading...</h1>
      </div>
      <div v-else-if="error || !product" class="product-page__not-found">
        <h1>Product not found</h1>
        <p>Sorry, we couldn't find the product you're looking for.</p>
        <router-link to="/products" class="btn btn--primary"> Back to products </router-link>
      </div>
      <template v-else>
        <router-link to="/products" class="product-page__back"> ← Back to products </router-link>

        <div class="product-page__content">
          <div class="product-page__media">
            <img :src="product.image" :alt="product.name" />
            <span v-if="product.badge" class="product-card__badge">{{ product.badge }}</span>
          </div>

          <div class="product-page__details">
            <p class="product-page__category">{{ product.category }}</p>
            <h1 class="product-page__title">{{ product.name }}</h1>
            <p class="product-page__description">{{ product.description }}</p>

            <div class="product-page__meta">
              <span class="product-page__price">{{ currency.format(product.price) }}</span>
              <span v-if="averageRating !== null" class="product-page__rating">
                ★ {{ averageRating.toFixed(1) }}
              </span>
            </div>

            <div class="product-page__colors">
              <p class="product-page__colors-label">Available colors:</p>
              <div class="product-page__colors-list">
                <button
                  v-for="color in product.colors"
                  :key="color"
                  type="button"
                  :class="[
                    'product-page__color-option',
                    { 'product-page__color-option--selected': selectedColor === color },
                  ]"
                  :aria-label="`Select color ${color}`"
                  @click="selectedColor = color"
                >
                  {{ color }}
                </button>
              </div>
            </div>

            <button
              type="button"
              :class="[
                'product-page__cta',
                { 'product-card__cta--highlight': isHighlighted(product.id) },
              ]"
              @click="handleAddToCart"
            >
              Add to bag
              <span
                v-if="isHighlighted(product.id)"
                class="product-card__checkmark"
                aria-label="Added to bag"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13.3333 4L6 11.3333L2.66667 8"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </button>

            <div class="product-page__info">
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

        <Reviews :product-id="product.id" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { inject } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import Reviews from '../components/Reviews.vue'
import { getAverageRating } from '../utils/reviews'
import { GET_PRODUCT } from '../graphql/queries'
import type { Product } from '../data/products'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const route = useRoute()
const id = computed(() => route.params.id as string)

const selectedColor = ref<string | null>(null)
const averageRating = ref<number | null>(null)

const { loading, error, result } = useQuery(
  GET_PRODUCT,
  () => ({ id: id.value }),
  () => ({ skip: !id.value }),
)

const product = computed(() => (result.value?.product as Product) || null)

// Scroll to top when product page loads or product changes
watch(
  () => id.value,
  () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },
)

watch(
  () => product.value,
  (newProduct) => {
    if (newProduct) {
      const rating = getAverageRating(newProduct.id)
      averageRating.value = rating
    }
  },
  { immediate: true },
)

const handleStorageChange = () => {
  if (product.value) {
    const rating = getAverageRating(product.value.id)
    averageRating.value = rating
  }
}

onMounted(() => {
  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('reviewAdded', handleStorageChange)
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('reviewAdded', handleStorageChange)
})

const addToCart = inject<(productId: string) => void>('addToCart', () => {})
const isHighlighted = inject<(productId: string) => boolean>('isHighlighted', () => false)

const handleAddToCart = () => {
  if (product.value) {
    addToCart(product.value.id)
  }
}
</script>

<style scoped>
@import '../App.css';
</style>

