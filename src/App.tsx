import { useMemo } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { Layout } from './components/layout/Layout'
import { GET_PRODUCTS } from './graphql/queries'
import { routes } from './routes'
import type { ProductsQueryResult } from './types'

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
