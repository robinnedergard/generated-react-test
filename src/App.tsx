import { useMemo } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { AuthProvider } from '#src/contexts/auth/AuthContext'
import { CartProvider } from '#src/contexts/cart/CartContext'
import { Layout } from '#src/components/layout/Layout'
import { GET_PRODUCTS } from '#src/graphql/queries'
import { routes } from '#src/routes'
import type { ProductsQueryResult } from '#src/types'

function AppRoutes() {
  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<Layout backLink={route.backLink}>{route.element}</Layout>}
        />
      ))}
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
