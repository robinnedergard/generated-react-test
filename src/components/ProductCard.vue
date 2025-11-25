<template>
  <router-link
    :to="`/product/${product.id}`"
    :class="['product-card', { 'product-card--highlight': isHighlighted }]"
    data-testid="product-card"
  >
    <div class="product-card__media">
      <img :src="product.image" :alt="product.name" loading="lazy" />
      <span v-if="product.badge" class="product-card__badge">{{ product.badge }}</span>
    </div>
    <div class="product-card__body">
      <p class="product-card__category">{{ product.category }}</p>
      <h3>{{ product.name }}</h3>
      <p class="product-card__description">{{ product.description }}</p>
      <div class="product-card__meta">
        <span class="product-card__price">{{ currency.format(product.price) }}</span>
        <span v-if="averageRating !== null" class="product-card__rating">
          ★ {{ averageRating.toFixed(1) }}
        </span>
      </div>
      <div class="product-card__colors">
        <span v-for="color in product.colors" :key="color">{{ color }}</span>
      </div>
      <button
        type="button"
        :class="['product-card__cta', { 'product-card__cta--highlight': isHighlighted }]"
        @click.prevent.stop="handleAddClick"
      >
        Add to bag
        <span v-if="isHighlighted" class="product-card__checkmark" aria-label="Added to bag">
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
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Product } from '../data/products'
import { getAverageRating } from '../utils/reviews'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

interface Props {
  product: Product
  isHighlighted: boolean
}

interface Emits {
  (e: 'add'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const averageRating = ref<number | null>(null)

const loadRating = () => {
  const rating = getAverageRating(props.product.id)
  averageRating.value = rating
}

const handleReviewAdded = () => {
  const newRating = getAverageRating(props.product.id)
  averageRating.value = newRating
}

onMounted(() => {
  loadRating()
  window.addEventListener('reviewAdded', handleReviewAdded)
})

onUnmounted(() => {
  window.removeEventListener('reviewAdded', handleReviewAdded)
})

const handleAddClick = () => {
  emit('add')
}
</script>

<style scoped>
@import '../App.css';
</style>

