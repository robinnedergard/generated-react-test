<template>
  <section class="reviews">
    <h2 class="reviews__title">Customer Reviews</h2>

    <div v-if="reviews.length > 0" class="reviews__list">
      <article v-for="review in reviews" :key="review.id" class="review">
        <div class="review__header">
          <div>
            <p class="review__name">{{ review.name }}</p>
            <StarRating :rating="review.rating" />
          </div>
          <time class="review__date" :dateTime="review.date">
            {{ formatDate(review.date) }}
          </time>
        </div>
        <p class="review__text">{{ review.text }}</p>
      </article>
    </div>

    <form class="reviews__form" @submit.prevent="handleSubmit">
      <h3 class="reviews__form-title">Write a review</h3>

      <div class="reviews__form-group">
        <label for="review-name" class="reviews__label"> Your name </label>
        <input
          id="review-name"
          v-model="name"
          type="text"
          class="reviews__input"
          placeholder="Enter your name"
          :disabled="isSubmitting"
        />
      </div>

      <div class="reviews__form-group">
        <label class="reviews__label">Your rating</label>
        <StarRating :rating="rating" :interactive="true" @rating-change="setRating" />
      </div>

      <div class="reviews__form-group">
        <label for="review-text" class="reviews__label"> Your review </label>
        <textarea
          id="review-text"
          v-model="text"
          class="reviews__textarea"
          placeholder="Share your thoughts about this product..."
          rows="4"
          :disabled="isSubmitting"
        />
      </div>

      <div class="reviews__form-group">
        <label for="review-captcha" class="reviews__label">
          Verification: What is {{ captcha.question }}?
        </label>
        <input
          id="review-captcha"
          v-model="captchaAnswer"
          type="text"
          class="reviews__input reviews__input--captcha"
          placeholder="Enter answer"
          :disabled="isSubmitting"
        />
      </div>

      <p v-if="error" class="reviews__error">{{ error }}</p>

      <button type="submit" class="btn btn--primary reviews__submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StarRating from './StarRating.vue'

interface Props {
  productId: string
}

type Review = {
  id: string
  productId: string
  name: string
  text: string
  rating: number
  date: string
}

const props = defineProps<Props>()

const reviews = ref<Review[]>([])
const name = ref('')
const text = ref('')
const rating = ref(0)
const captcha = ref(generateCaptcha())
const captchaAnswer = ref('')
const error = ref('')
const isSubmitting = ref(false)

function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1
  const num2 = Math.floor(Math.random() * 10) + 1
  return { question: `${num1} + ${num2}`, answer: num1 + num2 }
}

const loadReviews = () => {
  const stored = localStorage.getItem(`reviews-${props.productId}`)
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Review[]
      // Filter out old reviews without ratings
      const validReviews = parsed.filter((review) => review.rating && review.rating > 0)
      reviews.value = validReviews
      // Update localStorage to remove old reviews
      if (validReviews.length !== parsed.length) {
        localStorage.setItem(`reviews-${props.productId}`, JSON.stringify(validReviews))
      }
    } catch {
      // Invalid JSON, ignore
    }
  }
}

onMounted(() => {
  loadReviews()
})

const handleSubmit = () => {
  error.value = ''

  if (!name.value.trim()) {
    error.value = 'Please enter your name'
    return
  }

  if (!text.value.trim()) {
    error.value = 'Please enter your review'
    return
  }

  if (rating.value === 0) {
    error.value = 'Please select a rating'
    return
  }

  const answer = parseInt(captchaAnswer.value, 10)
  if (isNaN(answer) || answer !== captcha.value.answer) {
    error.value = 'Incorrect captcha answer. Please try again.'
    captcha.value = generateCaptcha()
    captchaAnswer.value = ''
    return
  }

  isSubmitting.value = true

  // Simulate a brief delay for better UX
  setTimeout(() => {
    const newReview: Review = {
      id: Date.now().toString(),
      productId: props.productId,
      name: name.value.trim(),
      text: text.value.trim(),
      rating: rating.value,
      date: new Date().toISOString(),
    }

    const updatedReviews = [newReview, ...reviews.value]
    reviews.value = updatedReviews
    localStorage.setItem(`reviews-${props.productId}`, JSON.stringify(updatedReviews))

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('reviewAdded', { detail: { productId: props.productId } }))

    // Reset form
    name.value = ''
    text.value = ''
    rating.value = 0
    captchaAnswer.value = ''
    captcha.value = generateCaptcha()
    isSubmitting.value = false
    error.value = ''
  }, 300)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const setRating = (value: number) => {
  rating.value = value
}
</script>

<style scoped>
@import '../App.css';
</style>

