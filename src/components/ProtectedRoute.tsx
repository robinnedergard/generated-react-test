import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LoadingState } from './LoadingState'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingState />
  }

  if (!isAuthenticated) {
    // Redirect to login page, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
