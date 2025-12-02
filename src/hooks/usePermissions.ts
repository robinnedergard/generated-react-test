import { useMemo } from 'react'
import { useAuth } from './useAuth'
import type { UserPermission } from '../contexts/auth/AuthContext.types'
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasAdminAccess,
} from '../utils/permissions'

export function usePermissions() {
  const { user } = useAuth()
  const permissions = user?.permissions || []

  return useMemo(
    () => ({
      permissions,
      hasPermission: (permission: UserPermission) => hasPermission(permissions, permission),
      hasAnyPermission: (permissionList: UserPermission[]) =>
        hasAnyPermission(permissions, permissionList),
      hasAllPermissions: (permissionList: UserPermission[]) =>
        hasAllPermissions(permissions, permissionList),
      hasAdminAccess: () => hasAdminAccess(permissions),
    }),
    [permissions],
  )
}

