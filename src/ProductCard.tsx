import { Link } from 'react-router-dom'
import { type Product } from './data/products'
import ProductImage from './components/product/ProductImage'
import ProductMeta from './components/product/ProductMeta'
import AddToCartButton from './components/product/AddToCartButton'

type ProductCardProps = {
  product: Product
  onAdd: () => void
  isHighlighted: boolean
}

export default function ProductCard({ product, onAdd, isHighlighted }: ProductCardProps) {
  // Use product.rating from database (which should be kept up to date)
  const averageRating = product.rating || null

  return (
    <Link
      to={`/product/${product.id}`}
      className={`bg-white rounded-3xl overflow-hidden border border-slate-200 flex flex-col min-h-full transition-all no-underline text-inherit cursor-pointer hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/10 ${
        isHighlighted ? 'shadow-lg shadow-orange-500/10' : ''
      }`}
      data-testid="product-card"
    >
      <ProductImage
        product={product}
        className="relative overflow-hidden aspect-[4/3] group-hover:scale-105 transition-transform"
      />
      <div className="p-7 flex flex-col gap-3 flex-1">
        <p className="uppercase tracking-widest text-xs text-slate-400">{product.category}</p>
        <h3 className="m-0">{product.name}</h3>
        <p className="text-slate-600 m-0 flex-1">{product.description}</p>
        <ProductMeta
          product={product}
          averageRating={averageRating}
          className="flex justify-between items-center font-semibold"
          priceClassName="text-lg"
          ratingClassName="text-amber-500"
        />
        <div className="flex flex-wrap gap-2 text-sm text-slate-600">
          {product.colors.map((color) => (
            <span key={color}>{color}</span>
          ))}
        </div>
        <div
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <AddToCartButton
            onClick={() => onAdd()}
            isHighlighted={isHighlighted}
            className="px-5 py-2 text-xs"
          />
        </div>
      </div>
    </Link>
  )
}
