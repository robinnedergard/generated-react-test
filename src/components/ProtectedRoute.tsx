import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="shop">
        <div className="checkout-page">
          <div className="checkout-page__empty">
            <h1>Loading...</h1>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login page, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

