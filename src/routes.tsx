import { lazy } from 'react'
import { ProtectedRoute } from '#src/components/ProtectedRoute'
import { AdminProtectedRoute } from '#src/components/AdminProtectedRoute'
import { HomePage } from '#src/pages/HomePage'
import ProductsPage from '#src/ProductsPage'
import ProductPage from '#src/ProductPage'
import CheckoutPage from '#src/CheckoutPage'
import CheckoutSuccessPage from '#src/CheckoutSuccessPage'
import LoginPage from '#src/LoginPage'
import RegisterPage from '#src/RegisterPage'
import UserOrdersPage from '#src/UserOrdersPage'

// Lazy load admin pages
const AdminDashboardPage = lazy(() =>
  import('#src/pages/AdminDashboardPage').then((m) => ({ default: m.default })),
)
const AdminProductsPage = lazy(() =>
  import('#src/pages/AdminProductsPage').then((m) => ({ default: m.default })),
)
const AdminOrdersPage = lazy(() =>
  import('#src/pages/AdminOrdersPage').then((m) => ({ default: m.default })),
)

export const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/products',
    element: <ProductsPage />,
    backLink: { to: '/', label: '← Back to home' },
  },
  {
    path: '/product/:id',
    element: <ProductPage />,
    backLink: { to: '/products', label: '← Back to products' },
  },
  {
    path: '/checkout',
    element: <CheckoutPage />,
    backLink: { to: '/products', label: '← Back to products' },
  },
  {
    path: '/checkout/:id/success',
    element: <CheckoutSuccessPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/account/orders',
    element: (
      <ProtectedRoute>
        <UserOrdersPage />
      </ProtectedRoute>
    ),
    backLink: { to: '/products', label: '← Back to products' },
  },
  {
    path: '/admin',
    element: (
      <AdminProtectedRoute>
        <AdminDashboardPage />
      </AdminProtectedRoute>
    ),
    backLink: { to: '/', label: '← Back to main site' },
  },
  {
    path: '/admin/products',
    element: (
      <AdminProtectedRoute>
        <AdminProductsPage />
      </AdminProtectedRoute>
    ),
    backLink: { to: '/admin', label: '← Back to admin' },
  },
  {
    path: '/admin/orders',
    element: (
      <AdminProtectedRoute>
        <AdminOrdersPage />
      </AdminProtectedRoute>
    ),
    backLink: { to: '/admin', label: '← Back to admin' },
  },
]
