import { useState, type FormEvent } from 'react'
import { useMutation } from '@apollo/client/react'
import { CREATE_PRODUCT, UPDATE_PRODUCT } from '#src/graphql/queries'

type Product = {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
  badge?: string
  featured: boolean
  colors: string[]
}

type ProductFormProps = {
  product?: Product | null
  onCancel: () => void
  onSuccess: () => void
}

export default function ProductForm({ product, onCancel, onSuccess }: ProductFormProps) {
  const [name, setName] = useState(product?.name || '')
  const [category, setCategory] = useState(product?.category || '')
  const [price, setPrice] = useState(product?.price.toString() || '')
  const [image, setImage] = useState(product?.image || '')
  const [description, setDescription] = useState(product?.description || '')
  const [badge, setBadge] = useState(product?.badge || '')
  const [featured, setFeatured] = useState(product?.featured || false)
  const [colors, setColors] = useState(product?.colors.join(', ') || '')

  const [createProduct, { loading: creating }] = useMutation(CREATE_PRODUCT)
  const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT)

  const loading = creating || updating

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const productInput = {
      name,
      category,
      price: parseFloat(price),
      image,
      description,
      badge: badge || undefined,
      featured,
      colors: colors
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
    }

    try {
      if (product) {
        await updateProduct({
          variables: {
            id: product.id,
            updateProductInput: productInput,
          },
        })
      } else {
        await createProduct({
          variables: {
            createProductInput: productInput,
          },
        })
      }
      onSuccess()
    } catch {
      alert('Failed to save product')
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-4xl mb-8 m-0">{product ? 'Edit Product' : 'Create Product'}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block mb-2 font-semibold">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-slate-200 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-4 py-2 border border-slate-200 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Price</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full px-4 py-2 border border-slate-200 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Image URL</label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            className="w-full px-4 py-2 border border-slate-200 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Badge (optional)</label>
          <input
            type="text"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg"
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            <span className="font-semibold">Featured</span>
          </label>
        </div>

        <div>
          <label className="block mb-2 font-semibold">Colors (comma-separated)</label>
          <input
            type="text"
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            required
            className="w-full px-4 py-2 border border-slate-200 rounded-lg"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full px-6 py-3.5 text-sm font-semibold cursor-pointer transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? 'Saving...' : product ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-6 py-3.5 text-sm font-semibold cursor-pointer transition-all bg-transparent border border-slate-200 text-slate-900 hover:-translate-y-0.5"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
