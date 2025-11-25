<template>
  <div class="shop">
    <div class="checkout-page">
      <div class="checkout-page__content">
        <div class="checkout-page__form-section" style="max-width: 500px; margin: 0 auto">
          <h1 class="checkout-page__title">Register</h1>

          <form class="checkout-form" @submit.prevent="handleSubmit">
            <div v-if="error" class="checkout-form__error">
              <p>{{ error }}</p>
            </div>

            <div class="checkout-form__row">
              <div class="checkout-form__group">
                <label for="firstName" class="checkout-form__label"> First Name </label>
                <input
                  id="firstName"
                  v-model="firstName"
                  name="firstName"
                  type="text"
                  class="checkout-form__input"
                  required
                  autocomplete="given-name"
                />
              </div>

              <div class="checkout-form__group">
                <label for="lastName" class="checkout-form__label"> Last Name </label>
                <input
                  id="lastName"
                  v-model="lastName"
                  name="lastName"
                  type="text"
                  class="checkout-form__input"
                  required
                  autocomplete="family-name"
                />
              </div>
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
                autocomplete="new-password"
                minlength="6"
              />
              <small style="display: block; margin-top: 0.25rem; color: #666">
                Must be at least 6 characters
              </small>
            </div>

            <button
              type="submit"
              class="btn btn--primary btn--full checkout-form__submit"
              :disabled="loading"
            >
              {{ loading ? 'Registering...' : 'Register' }}
            </button>

            <p style="text-align: center; margin-top: 1rem">
              Already have an account?
              <router-link to="/login" style="color: inherit; text-decoration: underline">
                Login here
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
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { register } = useAuth()

const email = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const error = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  error.value = ''

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters long'
    return
  }

  loading.value = true

  try {
    await register(email.value, password.value, firstName.value, lastName.value)
    router.push('/account/orders')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import '../App.css';
</style>

