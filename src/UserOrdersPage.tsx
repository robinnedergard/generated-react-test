import { useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { useAuth } from './hooks/useAuth'
import { MY_ORDERS } from './graphql/queries'
import { LoadingState } from './components/LoadingState'
import { EmptyState } from './components/EmptyState'
import { OrderCard } from './components/orders/OrderCard'

type OrderItem = {
  productId: string
  name: string
  quantity: number
  price: number
}

type Order = {
  id: string
  status: string
  total: number
  items: OrderItem[]
  paymentMethod: string
  createdAt: string
}

type MyOrdersQueryResult = {
  myOrders: Order[]
}

export default function UserOrdersPage() {
  const { isAuthenticated, token } = useAuth()
  const { loading, error, data } = useQuery<MyOrdersQueryResult>(MY_ORDERS, {
    skip: !isAuthenticated,
    errorPolicy: 'all',
  })

  // Debug: Log authentication state
  useEffect(() => {
    console.log(
      'UserOrdersPage - isAuthenticated:',
      isAuthenticated,
      'token:',
      token ? 'present' : 'missing',
    )
  }, [isAuthenticated, token])

  if (loading) {
    return <LoadingState message="Loading your orders..." />
  }

  if (error) {
    console.error('Error loading orders:', error)
    const apolloError = error as {
      message: string
      networkError?: { message: string }
      graphQLErrors?: Array<{ message: string }>
    }
    const errorMessage = [
      apolloError.message,
      apolloError.networkError?.message,
      ...(apolloError.graphQLErrors?.map((err) => err.message) || []),
    ]
      .filter(Boolean)
      .join('. ')

    return (
      <EmptyState
        title="Error loading orders"
        message={errorMessage}
        actionLabel="Continue Shopping"
        actionTo="/products"
      />
    )
  }

  const orders = data?.myOrders || []

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        message="You haven't placed any orders yet. Start shopping to see your orders here."
        actionLabel="Start Shopping"
        actionTo="/products"
      />
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
      <h1 className="text-4xl m-0">My Orders</h1>

      <div className="flex flex-col gap-6">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}
