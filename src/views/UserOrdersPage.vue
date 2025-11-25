<template>
  <div class="shop">
    <div class="checkout-page">
      <div v-if="loading" class="checkout-page__empty">
        <h1>Loading your orders...</h1>
      </div>
      <div v-else-if="error" class="checkout-page__empty">
        <h1>Error loading orders</h1>
        <p>{{ error.message }}</p>
        <p v-if="apolloError?.networkError" style="color: #ef4444; margin-top: 0.5rem">
          Network error: {{ apolloError.networkError.message }}
        </p>
        <div v-if="apolloError?.graphQLErrors && apolloError.graphQLErrors.length > 0" style="margin-top: 0.5rem">
          <p v-for="(err, idx) in apolloError.graphQLErrors" :key="idx" style="color: #ef4444">
            {{ err.message }}
          </p>
        </div>
        <router-link to="/products" class="btn btn--primary" style="margin-top: 1rem">
          Continue Shopping
        </router-link>
      </div>
      <div v-else-if="orders.length === 0" class="checkout-page__empty">
        <h1>No orders yet</h1>
        <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
        <router-link to="/products" class="btn btn--primary"> Start Shopping </router-link>
      </div>
      <template v-else>
        <router-link to="/products" class="product-page__back"> ← Back to products </router-link>

        <div class="checkout-page__content">
          <div style="width: 100%; max-width: 800px; margin: 0 auto">
            <h1 class="checkout-page__title">My Orders</h1>

            <div style="display: flex; flex-direction: column; gap: 1.5rem">
              <div
                v-for="order in orders"
                :key="order.id"
                style="
                  border: 1px solid #e5e7eb;
                  border-radius: 8px;
                  padding: 1.5rem;
                  background-color: #fff;
                "
              >
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                  "
                >
                  <div>
                    <h3 style="margin: 0 0 0.5rem 0; font-size: 1.125rem">
                      Order #{{ order.id.slice(0, 8) }}
                    </h3>
                    <p style="margin: 0; color: #6b7280; font-size: 0.875rem">
                      {{ formatDate(order.createdAt) }}
                    </p>
                  </div>
                  <div style="text-align: right">
                    <div
                      :style="{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        backgroundColor: getStatusColor(order.status) + '20',
                        color: getStatusColor(order.status),
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        marginBottom: '0.5rem',
                      }"
                    >
                      {{ getStatusLabel(order.status) }}
                    </div>
                    <div style="font-size: 1.25rem; font-weight: 600">
                      {{ currency.format(order.total) }}
                    </div>
                  </div>
                </div>

                <div style="margin-bottom: 1rem">
                  <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: #6b7280">Items:</p>
                  <ul style="margin: 0; padding-left: 1.25rem; list-style: disc">
                    <li v-for="(item, index) in order.items" :key="index" style="margin-bottom: 0.25rem">
                      {{ item.name }} × {{ item.quantity }} - {{ currency.format(item.price * item.quantity) }}
                    </li>
                  </ul>
                </div>

                <router-link
                  :to="`/checkout/${order.id}/success`"
                  style="
                    display: inline-block;
                    color: inherit;
                    text-decoration: underline;
                    font-size: 0.875rem;
                  "
                >
                  View order details →
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { useAuth } from '../composables/useAuth'
import { MY_ORDERS } from '../graphql/queries'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

type OrderItem = {
  productId: string
  name: string
  quantity: number
  price: number
}

type Order = {
  id: string
  status: string
  total: number
  items: OrderItem[]
  paymentMethod: string
  createdAt: string
}

const { isAuthenticated } = useAuth()

const { loading, error, result } = useQuery(
  MY_ORDERS,
  {},
  () => ({ skip: !isAuthenticated.value, errorPolicy: 'all' }),
)

const orders = computed(() => (result.value?.myOrders as Order[]) || [])

const apolloError = computed(() => {
  if (!error.value) return null
  return error.value as {
    message: string
    networkError?: { message: string }
    graphQLErrors?: Array<{ message: string }>
  }
})

function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return '#22c55e'
    case 'processing':
      return '#3b82f6'
    case 'pending':
      return '#f59e0b'
    case 'failed':
      return '#ef4444'
    case 'cancelled':
      return '#6b7280'
    default:
      return '#6b7280'
  }
}

function getStatusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
@import '../App.css';
</style>

