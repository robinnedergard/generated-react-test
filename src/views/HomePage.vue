<template>
  <div v-if="loading || !heroProduct">Loading...</div>
  <template v-else>
    <header class="hero">
      <div class="hero__content">
        <p class="hero__eyebrow">New season edit</p>
        <h1>Meet the modern home shop</h1>
        <p class="hero__lead">
          Curated furniture, lighting, and objects crafted in small batches and ready to ship.
        </p>
        <div class="hero__actions">
          <router-link to="/products" class="btn btn--primary"> Shop the collection </router-link>
          <button
            type="button"
            class="btn btn--ghost"
            @click="scrollToEditorial"
          >
            Studio story
          </button>
        </div>
        <div class="hero__meta">
          <span>{{ currency.format(heroProduct.price) }}</span>
          <span>{{ heroProduct.name }}</span>
        </div>
      </div>
      <div class="hero__media">
        <img :src="heroProduct.image" :alt="heroProduct.name" loading="lazy" />
      </div>
    </header>

    <section class="perks">
      <article v-for="perk in perks" :key="perk.title">
        <h3>{{ perk.title }}</h3>
        <p>{{ perk.detail }}</p>
      </article>
    </section>

    <section class="categories">
      <div class="section-heading">
        <p class="eyebrow">Shop by room</p>
        <h2>Spaces with intention</h2>
        <p>Refresh a single corner or rethink your whole home with designer-backed palettes.</p>
      </div>
      <div class="categories__grid">
        <article v-for="category in categorySummaries" :key="category.category">
          <h3>{{ category.category }}</h3>
          <p>{{ category.count }} curated pieces</p>
        </article>
      </div>
    </section>

    <section id="editorial" class="editorial">
      <div class="editorial__media">
        <img :src="editorialHighlight.image" :alt="editorialHighlight.name" loading="lazy" />
      </div>
      <div class="editorial__content">
        <p class="eyebrow">From the studio</p>
        <h2>Layered neutrals, elevated silhouettes</h2>
        <p>
          We partner with small-batch workshops to produce timeless staples. Every stitch, weave,
          and finishing touch is considered so you can style once and enjoy for years.
        </p>
        <ul>
          <li>Responsibly sourced materials and certified woods</li>
          <li>Color stories developed with interior stylists</li>
          <li>Transparent pricing and limited runs per season</li>
        </ul>
        <button type="button" class="btn btn--primary">Book a design consult</button>
      </div>
    </section>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_PRODUCTS } from '../graphql/queries'
import type { Product } from '../data/products'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const perks = [
  { title: 'Express shipping', detail: 'Complimentary on orders over $150' },
  { title: '30-day trial', detail: 'Live with every piece before you decide' },
  { title: 'Design support', detail: 'Chat with stylists for pairing advice' },
]

const { loading, result } = useQuery(GET_PRODUCTS)
const products = computed(() => (result.value?.products as Product[]) || [])

const categorySummaries = computed(() => {
  const categories = products.value.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] ?? 0) + 1
    return acc
  }, {})
  return Object.entries(categories)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
})

const heroProduct = computed(() => products.value[0])
const editorialHighlight = computed(
  () => products.value.find((product) => product.badge === 'Limited') ?? heroProduct.value,
)

const scrollToEditorial = () => {
  document.querySelector('#editorial')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
@import '../App.css';
</style>

