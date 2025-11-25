<template>
  <div class="shop">
    <div class="cart-bar">
      <div>
        <p class="eyebrow">Your bag</p>
        <p>{{ cartCount ? `${cartCount} item${cartCount > 1 ? 's' : ''}` : 'No items yet' }}</p>
      </div>
      <div style="display: flex; align-items: center; gap: 1rem">
        <template v-if="isAuthenticated">
          <router-link
            to="/account/orders"
            style="color: inherit; text-decoration: none; font-size: 0.875rem; margin-right: 0.5rem"
          >
            {{ user?.email }}
          </router-link>
          <button
            type="button"
            class="btn btn--ghost btn--small"
            style="font-size: 0.875rem"
            @click="logout"
          >
            Logout
          </button>
        </template>
        <template v-else>
          <router-link
            to="/login"
            style="color: inherit; text-decoration: none; font-size: 0.875rem; margin-right: 0.5rem"
          >
            Login
          </router-link>
        </template>
        <button type="button" class="cart-toggle" data-testid="cart-toggle" @click="toggleCart">
          Bag
          <span class="cart-pill" data-testid="cart-count" aria-live="polite">
            {{ cartCount }}
          </span>
        </button>
      </div>
    </div>

    <section v-if="isCartOpen" class="cart-panel cart-panel--open" aria-live="polite">
      <header class="cart-panel__header">
        <div>
          <p class="eyebrow">Shopping bag</p>
          <h2>Ready to ship</h2>
        </div>
        <button type="button" class="btn btn--ghost btn--small" @click="toggleCart">Hide</button>
      </header>
      <p class="cart-panel__note">{{ freeShippingMessage }}</p>
      <ul v-if="cartItems.length > 0" class="cart-panel__lines">
        <li v-for="item in cartItems" :key="item.product.id" class="cart-line">
          <div class="cart-line__info">
            <p>{{ item.product.name }}</p>
            <span>{{ currency.format(item.product.price) }}</span>
          </div>
          <div class="cart-line__controls">
            <div class="cart-line__quantity-group">
              <div class="quantity" :aria-label="`Quantity controls for ${item.product.name}`">
                <button
                  type="button"
                  :aria-label="`Decrease quantity for ${item.product.name}`"
                  @click="updateQuantity(item.product.id, (qty) => qty - 1)"
                >
                  –
                </button>
                <span :data-testid="`cart-qty-${item.product.id}`" aria-live="polite">
                  {{ item.quantity }}
                </span>
                <button
                  type="button"
                  :aria-label="`Increase quantity for ${item.product.name}`"
                  @click="updateQuantity(item.product.id, (qty) => qty + 1)"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                class="cart-line__remove"
                :aria-label="`Remove all ${item.product.name} from cart`"
                @click="updateQuantity(item.product.id, () => 0)"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334ZM6.667 7.333v4M9.333 7.333v4"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
            <span class="cart-line__total">
              {{ currency.format(item.product.price * item.quantity) }}
            </span>
          </div>
        </li>
      </ul>
      <p v-else class="cart-panel__empty">Your basket is empty – add your favorite finds.</p>
      <div class="cart-panel__summary">
        <div class="cart-panel__summary-row">
          <span>Subtotal</span>
          <span>{{ currency.format(subtotal) }}</span>
        </div>
        <div class="cart-panel__summary-row">
          <span>Shipping</span>
          <span>{{ shipping === 0 ? 'Complimentary' : currency.format(shipping) }}</span>
        </div>
        <div class="cart-panel__summary-row cart-panel__summary-row--total">
          <span>Total</span>
          <span>{{ currency.format(total) }}</span>
        </div>
        <router-link
          to="/checkout"
          class="btn btn--primary btn--full"
          style="text-align: center; display: block; text-decoration: none"
          @click="toggleCart"
        >
          Proceed to checkout
        </router-link>
      </div>
    </section>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import type { Product } from '../data/products'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

type CartLineItem = {
  product: Product
  quantity: number
}

interface Props {
  cartItems: CartLineItem[]
  cartCount: number
  subtotal: number
  shipping: number
  total: number
  freeShippingMessage: string
  isCartOpen: boolean
}

interface Emits {
  (e: 'toggle-cart'): void
  (e: 'update-quantity', productId: string, updater: (current: number) => number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { isAuthenticated, user, logout } = useAuth()
const router = useRouter()

const toggleCart = () => {
  emit('toggle-cart')
}

const updateQuantity = (productId: string, updater: (current: number) => number) => {
  emit('update-quantity', productId, updater)
}
</script>
