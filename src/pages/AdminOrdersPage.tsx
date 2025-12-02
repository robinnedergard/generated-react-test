import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { GET_ADMIN_CHECKOUTS, UPDATE_CHECKOUT_STATUS } from '#src/graphql/queries'
import { LoadingState } from '#src/components/LoadingState'
import { ErrorMessage } from '#src/components/ErrorMessage'
import { usePermissions } from '#src/hooks/usePermissions'
import { currency } from '#src/utils/constants'

type CheckoutStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

type CheckoutItem = {
  productId: string
  name: string
  quantity: number
  price: number
}

type Address = {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

type Checkout = {
  id: string
  status: CheckoutStatus
  total: number
  subtotal: number
  tax: number
  shipping: number
  items: CheckoutItem[]
  shippingAddress: Address
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

type CheckoutsQueryResult = {
  adminCheckouts: Checkout[]
}

export default function AdminOrdersPage() {
  const { hasPermission } = usePermissions()
  const [statusFilter, setStatusFilter] = useState<CheckoutStatus | null>(null)
  const { loading, error, data, refetch } = useQuery<CheckoutsQueryResult>(GET_ADMIN_CHECKOUTS, {
    variables: statusFilter ? { status: statusFilter } : {},
  })
  const [updateStatus] = useMutation(UPDATE_CHECKOUT_STATUS, {
    onCompleted: () => refetch(),
  })

  const canWrite = hasPermission('orders:write')

  if (loading) return <LoadingState message="Loading orders..." />
  if (error) return <ErrorMessage message={`Error loading orders: ${error.message}`} />

  const checkouts = data?.adminCheckouts || []

  const handleStatusChange = async (id: string, newStatus: CheckoutStatus) => {
    try {
      await updateStatus({
        variables: { id, status: newStatus },
      })
    } catch {
      alert('Failed to update order status')
    }
  }

  const statuses: CheckoutStatus[] = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED']

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl m-0">Admin Orders</h1>
        <div>
          <select
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter((e.target.value as CheckoutStatus | null) || null)}
            className="px-4 py-2 border border-slate-200 rounded-lg"
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {checkouts.map((checkout) => (
          <div key={checkout.id} className="bg-white border border-slate-200 rounded-3xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl m-0">Order #{checkout.id.slice(0, 8)}</h3>
                <p className="text-slate-600 m-0">
                  {checkout.shippingAddress.firstName} {checkout.shippingAddress.lastName}
                </p>
                <p className="text-slate-600 m-0">
                  {new Date(checkout.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold">{currency.format(checkout.total)}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      checkout.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : checkout.status === 'FAILED'
                          ? 'bg-red-100 text-red-800'
                          : checkout.status === 'CANCELLED'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {checkout.status}
                  </span>
                  {canWrite && (
                    <select
                      value={checkout.status}
                      onChange={(e) =>
                        handleStatusChange(checkout.id, e.target.value as CheckoutStatus)
                      }
                      className="px-3 py-1 border border-slate-200 rounded-lg text-sm"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Items:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    {checkout.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} × {item.quantity} -{' '}
                        {currency.format(item.price * item.quantity)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Shipping Address:</strong>
                  <p className="m-0 mt-1">
                    {checkout.shippingAddress.address}
                    <br />
                    {checkout.shippingAddress.city}, {checkout.shippingAddress.state}{' '}
                    {checkout.shippingAddress.zipCode}
                    <br />
                    {checkout.shippingAddress.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {checkouts.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500">
            No orders found
          </div>
        )}
      </div>
    </div>
  )
}
