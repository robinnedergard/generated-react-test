import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { GET_ADMIN_PRODUCTS, DELETE_PRODUCT } from '#src/graphql/queries'
import { LoadingState } from '#src/components/LoadingState'
import { ErrorMessage } from '#src/components/ErrorMessage'
import { usePermissions } from '#src/hooks/usePermissions'
import { currency } from '#src/utils/constants'
import { Link } from 'react-router-dom'
import ProductForm from '#src/components/admin/ProductForm'

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
  createdAt: string
  updatedAt: string
}

type ProductsQueryResult = {
  adminProducts: Product[]
}

export default function AdminProductsPage() {
  const { hasPermission } = usePermissions()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { loading, error, data, refetch } = useQuery<ProductsQueryResult>(GET_ADMIN_PRODUCTS)
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => refetch(),
  })

  const canWrite = hasPermission('products:write')

  if (loading) return <LoadingState message="Loading products..." />
  if (error) return <ErrorMessage message={`Error loading products: ${error.message}`} />

  const products = data?.adminProducts || []

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await deleteProduct({ variables: { id } })
    } catch {
      alert('Failed to delete product')
    }
  }

  if (showCreateForm || editingProduct) {
    return (
      <ProductForm
        product={editingProduct}
        onCancel={() => {
          setEditingProduct(null)
          setShowCreateForm(false)
        }}
        onSuccess={() => {
          setEditingProduct(null)
          setShowCreateForm(false)
          refetch()
        }}
      />
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl m-0">Admin Products</h1>
        {canWrite && (
          <button
            type="button"
            className="rounded-full px-6 py-3.5 text-sm font-semibold cursor-pointer transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5"
            onClick={() => setShowCreateForm(true)}
          >
            + Create Product
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Featured</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-slate-200">
                <td className="p-4">{product.name}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">{currency.format(product.price)}</td>
                <td className="p-4">{product.featured ? 'Yes' : 'No'}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {canWrite && (
                      <>
                        <button
                          type="button"
                          className="text-orange-500 hover:underline"
                          onClick={() => setEditingProduct(product)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-red-500 hover:underline"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                    <Link to={`/product/${product.id}`} className="text-blue-500 hover:underline">
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="p-8 text-center text-slate-500">No products found</div>
        )}
      </div>
    </div>
  )
}
