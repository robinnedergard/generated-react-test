import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '#src/hooks/useAuth'
import { usePermissions } from '#src/hooks/usePermissions'
import { LoadingState } from '#src/components/LoadingState'
import { EmptyState } from '#src/components/EmptyState'

interface AdminProtectedRouteProps {
  children: React.ReactNode
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()
  const { hasAdminAccess } = usePermissions()
  const location = useLocation()

  if (loading) {
    return <LoadingState />
  }

  if (!isAuthenticated) {
    // Redirect to login page, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!hasAdminAccess()) {
    return (
      <EmptyState
        title="Access Denied"
        message="You don't have permission to access this page."
        actionLabel="Go Home"
        onAction={() => {
          window.location.href = '/'
        }}
      />
    )
  }

  return <>{children}</>
}

