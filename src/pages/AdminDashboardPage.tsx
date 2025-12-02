import { Link } from 'react-router-dom'
import { usePermissions } from '#src/hooks/usePermissions'

export default function AdminDashboardPage() {
  const { hasPermission } = usePermissions()

  const canManageProducts = hasPermission('products:read') || hasPermission('products:write')
  const canManageOrders = hasPermission('orders:read') || hasPermission('orders:write')

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl mb-8 m-0">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {canManageProducts && (
          <Link
            to="/admin/products"
            className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl mb-4 m-0">Products</h2>
            <p className="text-slate-600 m-0">
              Manage products, create new items, and update existing ones.
            </p>
            <div className="mt-4 text-orange-500 font-semibold">Manage Products →</div>
          </Link>
        )}

        {canManageOrders && (
          <Link
            to="/admin/orders"
            className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl mb-4 m-0">Orders</h2>
            <p className="text-slate-600 m-0">
              View and manage orders, update statuses, and track fulfillment.
            </p>
            <div className="mt-4 text-orange-500 font-semibold">Manage Orders →</div>
          </Link>
        )}
      </div>

      {!canManageProducts && !canManageOrders && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center">
          <p className="text-slate-600 m-0">
            You don't have access to any admin features. Contact an administrator to request
            permissions.
          </p>
        </div>
      )}
    </div>
  )
}

