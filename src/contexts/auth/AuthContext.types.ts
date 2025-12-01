export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
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
