import type { UserPermission } from '../contexts/auth/AuthContext.types'

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  userPermissions: UserPermission[] | undefined,
  permission: UserPermission,
): boolean {
  if (!userPermissions) return false
  return userPermissions.includes(permission)
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  userPermissions: UserPermission[] | undefined,
  permissions: UserPermission[],
): boolean {
  if (!userPermissions) return false
  return permissions.some((permission) => userPermissions.includes(permission))
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(
  userPermissions: UserPermission[] | undefined,
  permissions: UserPermission[],
): boolean {
  if (!userPermissions) return false
  return permissions.every((permission) => userPermissions.includes(permission))
}

/**
 * Check if user has admin access (any admin-related permission)
 */
export function hasAdminAccess(userPermissions: UserPermission[] | undefined): boolean {
  if (!userPermissions) return false
  const adminPermissions: UserPermission[] = [
    'admin:read',
    'products:read',
    'products:write',
    'orders:read',
    'orders:write',
    'permissions:read',
    'permissions:write',
  ]
  return hasAnyPermission(userPermissions, adminPermissions)
}

