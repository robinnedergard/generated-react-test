import { ProtectedRoute } from '#src/components/ProtectedRoute'
import { HomePage } from '#src/pages/HomePage'
import ProductsPage from '#src/ProductsPage'
import ProductPage from '#src/ProductPage'
import CheckoutPage from '#src/CheckoutPage'
import CheckoutSuccessPage from '#src/CheckoutSuccessPage'
import LoginPage from '#src/LoginPage'
import RegisterPage from '#src/RegisterPage'
import UserOrdersPage from '#src/UserOrdersPage'

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
]
