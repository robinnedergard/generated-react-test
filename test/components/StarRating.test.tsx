import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StarRating } from '#src/components/reviews/StarRating'

describe('StarRating', () => {
  it('renders correct number of stars', () => {
    render(<StarRating rating={3} />)
    const stars = screen.getAllByText('★')
    expect(stars).toHaveLength(5) // Always shows 5 stars
  })

  it('highlights correct number of stars based on rating', () => {
    const { container } = render(<StarRating rating={4} />)
    const filledStars = container.querySelectorAll('.text-amber-400')
    const emptyStars = container.querySelectorAll('.text-slate-200')
    
    expect(filledStars.length).toBe(4)
    expect(emptyStars.length).toBe(1)
  })

  it('calls onRatingChange when interactive and star is clicked', async () => {
    const handleRatingChange = vi.fn()
    const user = userEvent.setup()
    
    render(<StarRating rating={0} onRatingChange={handleRatingChange} interactive />)
    
    const stars = screen.getAllByText('★')
    await user.click(stars[2]) // Click 3rd star (rating 3)
    
    expect(handleRatingChange).toHaveBeenCalledWith(3)
  })

  it('does not call onRatingChange when not interactive', async () => {
    const handleRatingChange = vi.fn()
    const user = userEvent.setup()
    
    render(<StarRating rating={3} onRatingChange={handleRatingChange} />)
    
    const stars = screen.getAllByText('★')
    await user.click(stars[0])
    
    expect(handleRatingChange).not.toHaveBeenCalled()
  })
})

