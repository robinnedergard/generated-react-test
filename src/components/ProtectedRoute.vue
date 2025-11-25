<template>
  <slot v-if="isAuthenticated && !loading" />
  <div v-else-if="loading" class="shop">
    <div class="checkout-page">
      <div class="checkout-page__empty">
        <h1>Loading...</h1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { isAuthenticated, loading } = useAuth()

// Redirect if not authenticated (handled by router guard, but this is a fallback)
if (!loading.value && !isAuthenticated.value) {
  router.push({ name: 'Login', query: { from: router.currentRoute.value.fullPath } })
}
</script>

