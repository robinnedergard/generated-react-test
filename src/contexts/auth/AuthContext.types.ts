export type UserPermission =
  | 'admin:read'
  | 'products:read'
  | 'products:write'
  | 'orders:read'
  | 'orders:write'
  | 'permissions:read'
  | 'permissions:write'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  permissions?: UserPermission[]
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
}
