import type { Product } from '../../data/products'
import ProductMeta from './ProductMeta'
import ColorSelector from './ColorSelector'
import AddToCartButton from './AddToCartButton'

type ProductDetailsProps = {
  product: Product
  averageRating: number | null
  selectedColor: string | null
  onColorSelect: (color: string) => void
  onAddToCart: () => void
  isHighlighted: boolean
}

export default function ProductDetails({
  product,
  averageRating,
  selectedColor,
  onColorSelect,
  onAddToCart,
  isHighlighted,
}: ProductDetailsProps) {
  return (
    <div className="flex flex-col gap-6">
      <p className="uppercase tracking-widest text-xs text-slate-400 m-0">{product.category}</p>
      <h1 className="text-4xl lg:text-5xl leading-tight m-0">{product.name}</h1>
      <p className="text-lg leading-relaxed text-slate-600 m-0">{product.description}</p>

      <ProductMeta product={product} averageRating={averageRating} />

      <ColorSelector
        colors={product.colors}
        selectedColor={selectedColor}
        onColorSelect={onColorSelect}
      />

      <AddToCartButton onClick={onAddToCart} isHighlighted={isHighlighted} />

      <div className="mt-4 pt-8 border-t border-slate-200">
        <h3 className="text-xl mb-4 m-0">Product details</h3>
        <ul className="list-none p-0 m-0 flex flex-col gap-3 text-slate-600">
          <li className="pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-orange-500 before:font-bold">
            Premium materials and craftsmanship
          </li>
          <li className="pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-orange-500 before:font-bold">
            30-day return policy
          </li>
          <li className="pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-orange-500 before:font-bold">
            Complimentary shipping on orders over $150
          </li>
          <li className="pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-orange-500 before:font-bold">
            Design consultation available
          </li>
        </ul>
      </div>
    </div>
  )
}

