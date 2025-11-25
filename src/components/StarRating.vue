<template>
  <div
    :class="['star-rating', { 'star-rating--interactive': interactive }]"
    :role="interactive ? 'radiogroup' : 'img'"
    :aria-label="`Rating: ${rating} out of 5 stars`"
  >
    <button
      v-for="value in 5"
      :key="value"
      type="button"
      :class="[
        'star-rating__star',
        { 'star-rating__star--filled': value <= displayRating },
        { 'star-rating__star--interactive': interactive },
      ]"
      :disabled="!interactive"
      :aria-label="`${value} star${value !== 1 ? 's' : ''}`"
      @click="handleClick(value)"
      @mouseenter="handleMouseEnter(value)"
      @mouseleave="handleMouseLeave"
    >
      ★
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  rating: number
  interactive?: boolean
}

interface Emits {
  (e: 'rating-change', rating: number): void
}

const props = withDefaults(defineProps<Props>(), {
  interactive: false,
})

const emit = defineEmits<Emits>()

const hoverRating = ref(0)

const displayRating = computed(() => hoverRating.value || props.rating)

const handleClick = (value: number) => {
  if (props.interactive) {
    emit('rating-change', value)
  }
}

const handleMouseEnter = (value: number) => {
  if (props.interactive) {
    hoverRating.value = value
  }
}

const handleMouseLeave = () => {
  if (props.interactive) {
    hoverRating.value = 0
  }
}
</script>

<style scoped>
@import '../App.css';
</style>

