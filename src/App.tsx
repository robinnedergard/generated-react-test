import { useMemo } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import ProductPage from './ProductPage'
import ProductsPage from './ProductsPage'
import CheckoutPage from './CheckoutPage'
import CheckoutSuccessPage from './CheckoutSuccessPage'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import UserOrdersPage from './UserOrdersPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { GET_PRODUCTS } from './graphql/queries'
import type { ProductsQueryResult } from './types'

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/products"
        element={
          <Layout>
            <ProductsPage />
          </Layout>
        }
      />
      <Route
        path="/product/:id"
        element={
          <Layout>
            <ProductPage />
          </Layout>
        }
      />
      <Route
        path="/checkout"
        element={
          <Layout>
            <CheckoutPage />
          </Layout>
        }
      />
      <Route
        path="/checkout/:id/success"
        element={
          <Layout>
            <CheckoutSuccessPage />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          <Layout>
            <LoginPage />
          </Layout>
        }
      />
      <Route
        path="/register"
        element={
          <Layout>
            <RegisterPage />
          </Layout>
        }
      />
      <Route
        path="/account/orders"
        element={
          <Layout>
            <ProtectedRoute>
              <UserOrdersPage />
            </ProtectedRoute>
          </Layout>
        }
      />
    </Routes>
  )
}

function App() {
  return <AppRoutes />
}

function AppWithAuth() {
  const { data: productsData } = useQuery<ProductsQueryResult>(GET_PRODUCTS)
  const products = useMemo(() => productsData?.products || [], [productsData?.products])

  return (
    <AuthProvider>
      <CartProvider products={products}>
        <App />
      </CartProvider>
    </AuthProvider>
  )
}

export default AppWithAuth
