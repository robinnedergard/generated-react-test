<template>
  <div class="shop">
    <div class="checkout-page">
      <div class="checkout-page__content">
        <div class="checkout-page__form-section" style="max-width: 500px; margin: 0 auto">
          <h1 class="checkout-page__title">Login</h1>

          <form class="checkout-form" @submit.prevent="handleSubmit">
            <div v-if="error" class="checkout-form__error">
              <p>{{ error }}</p>
            </div>

            <div class="checkout-form__group">
              <label for="email" class="checkout-form__label"> Email </label>
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                class="checkout-form__input"
                required
                autocomplete="email"
              />
            </div>

            <div class="checkout-form__group">
              <label for="password" class="checkout-form__label"> Password </label>
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                class="checkout-form__input"
                required
                autocomplete="current-password"
              />
            </div>

            <button
              type="submit"
              class="btn btn--primary btn--full checkout-form__submit"
              :disabled="loading"
            >
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>

            <p style="text-align: center; margin-top: 1rem">
              Don't have an account?
              <router-link to="/register" style="color: inherit; text-decoration: underline">
                Register here
              </router-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const route = useRoute()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const from = (route.query.from as string) || '/account/orders'

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    await login(email.value, password.value)
    router.push(from)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import '../App.css';
</style>

