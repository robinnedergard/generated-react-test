<template>
  <div class="products-page">
    <router-link to="/" class="product-page__back"> ← Back to home </router-link>
    <section class="product-grid">
      <div class="section-heading">
        <p class="eyebrow">Featured pieces</p>
        <h2>Crafted to layer beautifully</h2>
        <p>
          Mix tactile fabrics, natural woods, and sculptural silhouettes for your signature look.
        </p>
      </div>
      <div v-if="loading" class="products-page">Loading products...</div>
      <div v-else-if="error" class="products-page">Error loading products: {{ error.message }}</div>
      <div v-else class="product-grid__items">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :is-highlighted="isHighlighted(product.id)"
          @add="addToCart(product.id)"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import ProductCard from '../components/ProductCard.vue'
import { GET_PRODUCTS } from '../graphql/queries'
import type { Product } from '../data/products'

const route = useRoute()

// Scroll to top when products page loads or location changes
onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

watch(
  () => route.path,
  () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },
)

const { loading, error, result } = useQuery(GET_PRODUCTS)
const products = computed(() => (result.value?.products as Product[]) || [])

const addToCart = inject<(productId: string) => void>('addToCart', () => {})
const isHighlighted = inject<(productId: string) => boolean>('isHighlighted', () => false)
</script>

<style scoped>
@import '../App.css';
</style>

