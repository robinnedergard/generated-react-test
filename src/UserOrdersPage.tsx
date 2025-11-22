import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { useAuth } from './contexts/AuthContext'
import { MY_ORDERS } from './graphql/queries'
import './App.css'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

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

function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return '#22c55e'
    case 'processing':
      return '#3b82f6'
    case 'pending':
      return '#f59e0b'
    case 'failed':
      return '#ef4444'
    case 'cancelled':
      return '#6b7280'
    default:
      return '#6b7280'
  }
}

function getStatusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
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
    return (
      <div className="shop">
        <div className="checkout-page">
          <div className="checkout-page__empty">
            <h1>Loading your orders...</h1>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    console.error('Error loading orders:', error)
    const apolloError = error as {
      message: string
      networkError?: { message: string }
      graphQLErrors?: Array<{ message: string }>
    }
    return (
      <div className="shop">
        <div className="checkout-page">
          <div className="checkout-page__empty">
            <h1>Error loading orders</h1>
            <p>{apolloError.message}</p>
            {apolloError.networkError && (
              <p style={{ color: '#ef4444', marginTop: '0.5rem' }}>
                Network error: {apolloError.networkError.message}
              </p>
            )}
            {apolloError.graphQLErrors && apolloError.graphQLErrors.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                {apolloError.graphQLErrors.map((err: { message: string }, idx: number) => (
                  <p key={idx} style={{ color: '#ef4444' }}>
                    {err.message}
                  </p>
                ))}
              </div>
            )}
            <Link to="/products" className="btn btn--primary" style={{ marginTop: '1rem' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const orders = data?.myOrders || []

  if (orders.length === 0) {
    return (
      <div className="shop">
        <div className="checkout-page">
          <div className="checkout-page__empty">
            <h1>No orders yet</h1>
            <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <Link to="/products" className="btn btn--primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="shop">
      <div className="checkout-page">
        <Link to="/products" className="product-page__back">
          ← Back to products
        </Link>

        <div className="checkout-page__content">
          <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="checkout-page__title">My Orders</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    backgroundColor: '#fff',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem',
                    }}
                  >
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>
                        Order #{order.id.slice(0, 8)}
                      </h3>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          backgroundColor: getStatusColor(order.status) + '20',
                          color: getStatusColor(order.status),
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          marginBottom: '0.5rem',
                        }}
                      >
                        {getStatusLabel(order.status)}
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                        {currency.format(order.total)}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
                      Items:
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', listStyle: 'disc' }}>
                      {order.items.map((item, index) => (
                        <li key={index} style={{ marginBottom: '0.25rem' }}>
                          {item.name} × {item.quantity} -{' '}
                          {currency.format(item.price * item.quantity)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to={`/checkout/${order.id}/success`}
                    style={{
                      display: 'inline-block',
                      color: 'inherit',
                      textDecoration: 'underline',
                      fontSize: '0.875rem',
                    }}
                  >
                    View order details →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
