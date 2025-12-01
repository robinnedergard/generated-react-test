import type { Product } from '#src/data/products'

type ProductImageProps = {
  product: Product
  className?: string
}

export function ProductImage({ product, className = '' }: ProductImageProps) {
  return (
    <div className={`relative rounded-3xl overflow-hidden aspect-[4/3] bg-white border border-slate-200 ${className}`}>
      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      {product.badge && (
        <span className="absolute top-4 left-4 bg-black/65 text-white px-3 py-1.5 rounded-full text-xs">
          {product.badge}
        </span>
      )}
    </div>
  )
}

