type Review = {
  id: string
  productId: string
  name: string
  text: string
  rating: number
  date: string
}

export function getAverageRating(productId: string): number | null {
  const stored = localStorage.getItem(`reviews-${productId}`)
  if (!stored) return null

  try {
    const reviews = JSON.parse(stored) as Review[]
    const validReviews = reviews.filter((review) => review.rating && review.rating > 0)
    if (validReviews.length === 0) return null

    const sum = validReviews.reduce((acc, review) => acc + review.rating, 0)
    return sum / validReviews.length
  } catch {
    return null
  }
}

