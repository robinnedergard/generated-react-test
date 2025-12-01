import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import ProductsPage from './ProductsPage'
import ProductPage from './ProductPage'
import CheckoutPage from './CheckoutPage'
import CheckoutSuccessPage from './CheckoutSuccessPage'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import UserOrdersPage from './UserOrdersPage'

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
