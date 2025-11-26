type Review = {
  id: string
  productId: string
  userName: string
  text: string
  rating: number
  createdAt: string
}

export function getAverageRating(reviews: Review[]): number | null {
  if (!reviews || reviews.length === 0) return null

  const validReviews = reviews.filter((review) => review.rating && review.rating > 0)
  if (validReviews.length === 0) return null

  const sum = validReviews.reduce((acc, review) => acc + review.rating, 0)
  return sum / validReviews.length
}
