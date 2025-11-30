import { StarRating } from './StarRating'

type Review = {
  id: string
  productId: string
  userName: string
  text: string
  rating: number
  createdAt: string
}

type ReviewItemProps = {
  review: Review
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function ReviewItem({ review }: ReviewItemProps) {
  return (
    <article className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col gap-3">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div className="flex flex-col gap-2">
          <p className="font-semibold m-0 text-slate-900">{review.userName}</p>
          <StarRating rating={review.rating} />
        </div>
        <time className="text-sm text-slate-600" dateTime={review.createdAt}>
          {formatDate(review.createdAt)}
        </time>
      </div>
      <p className="m-0 leading-relaxed text-slate-600">{review.text}</p>
    </article>
  )
}

