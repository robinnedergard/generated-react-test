import type { Product } from '../../data/products'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

type ProductMetaProps = {
  product: Product
  averageRating: number | null
  className?: string
  priceClassName?: string
  ratingClassName?: string
}

export function ProductMeta({
  product,
  averageRating,
  className = '',
  priceClassName = '',
  ratingClassName = '',
}: ProductMetaProps) {
  return (
    <div className={`flex items-center gap-6 text-2xl font-semibold ${className}`}>
      <span className={`text-slate-900 ${priceClassName}`}>{currency.format(product.price)}</span>
      {averageRating !== null && (
        <span className={`text-slate-600 text-lg ${ratingClassName}`}>★ {averageRating.toFixed(1)}</span>
      )}
    </div>
  )
}

