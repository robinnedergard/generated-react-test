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
import { GET_PRODUCTS } from './graphql/queries'
import { useCart } from './hooks/useCart'
import type { ProductsQueryResult } from './types'

function App() {
  const { data: productsData } = useQuery<ProductsQueryResult>(GET_PRODUCTS)
  const products = useMemo(() => productsData?.products || [], [productsData?.products])

  const {
    cartItems,
    cartCount,
    subtotal,
    shipping,
    total,
    freeShippingMessage,
    isCartOpen,
    toggleCart,
    updateQuantity,
    addToCart,
    clearCart,
    isHighlighted,
  } = useCart(products)

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            cartItems={cartItems}
            cartCount={cartCount}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            freeShippingMessage={freeShippingMessage}
            isCartOpen={isCartOpen}
            toggleCart={toggleCart}
            updateQuantity={updateQuantity}
          >
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/products"
        element={
          <Layout
            cartItems={cartItems}
            cartCount={cartCount}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            freeShippingMessage={freeShippingMessage}
            isCartOpen={isCartOpen}
            toggleCart={toggleCart}
            updateQuantity={updateQuantity}
          >
            <ProductsPage addToCart={addToCart} isHighlighted={isHighlighted} />
          </Layout>
        }
      />
      <Route
        path="/product/:id"
        element={
          <Layout
            cartItems={cartItems}
            cartCount={cartCount}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            freeShippingMessage={freeShippingMessage}
            isCartOpen={isCartOpen}
            toggleCart={toggleCart}
            updateQuantity={updateQuantity}
          >
            <ProductPage onAddToCart={addToCart} isHighlighted={isHighlighted} />
          </Layout>
        }
      />
      <Route
        path="/checkout"
        element={
          <Layout
            cartItems={cartItems}
            cartCount={cartCount}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            freeShippingMessage={freeShippingMessage}
            isCartOpen={isCartOpen}
            toggleCart={toggleCart}
            updateQuantity={updateQuantity}
          >
            <CheckoutPage
              cartItems={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
            />
          </Layout>
        }
      />
      <Route
        path="/checkout/:id/success"
        element={
          <Layout
            cartItems={cartItems}
            cartCount={cartCount}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            freeShippingMessage={freeShippingMessage}
            isCartOpen={isCartOpen}
            toggleCart={toggleCart}
            updateQuantity={updateQuantity}
          >
            <CheckoutSuccessPage onClearCart={clearCart} />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          <Layout
            cartItems={cartItems}
            cartCount={cartCount}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            freeShippingMessage={freeShippingMessage}
            isCartOpen={isCartOpen}
            toggleCart={toggleCart}
            updateQuantity={updateQuantity}
          >
            <LoginPage />
          </Layout>
        }
      />
      <Route
        path="/register"
        element={
          <Layout
            cartItems={cartItems}
            cartCount={cartCount}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            freeShippingMessage={freeShippingMessage}
            isCartOpen={isCartOpen}
            toggleCart={toggleCart}
            updateQuantity={updateQuantity}
          >
            <RegisterPage />
          </Layout>
        }
      />
      <Route
        path="/account/orders"
        element={
          <Layout
            cartItems={cartItems}
            cartCount={cartCount}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            freeShippingMessage={freeShippingMessage}
            isCartOpen={isCartOpen}
            toggleCart={toggleCart}
            updateQuantity={updateQuantity}
          >
            <ProtectedRoute>
              <UserOrdersPage />
            </ProtectedRoute>
          </Layout>
        }
      />
    </Routes>
  )
}

function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}

export default AppWithAuth
