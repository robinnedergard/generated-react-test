import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StarRating from './StarRating.vue'

describe('StarRating', () => {
  it('renders 5 stars', () => {
    const wrapper = mount(StarRating, {
      props: {
        rating: 3,
      },
    })

    const stars = wrapper.findAll('.star-rating__star')
    expect(stars).toHaveLength(5)
  })

  it('displays the correct number of filled stars', () => {
    const wrapper = mount(StarRating, {
      props: {
        rating: 3,
      },
    })

    const filledStars = wrapper.findAll('.star-rating__star--filled')
    expect(filledStars).toHaveLength(3)
  })

  it('emits rating-change when interactive and clicked', async () => {
    const wrapper = mount(StarRating, {
      props: {
        rating: 0,
        interactive: true,
      },
    })

    const firstStar = wrapper.findAll('.star-rating__star')[0]
    await firstStar.trigger('click')

    expect(wrapper.emitted('rating-change')).toBeTruthy()
    expect(wrapper.emitted('rating-change')?.[0]).toEqual([1])
  })
})

