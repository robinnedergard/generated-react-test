import { useState, type ReactNode } from 'react'
import { AuthContext } from './AuthContext.context'
import type { User } from './AuthContext.types'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

// Initialize state from localStorage
function getInitialAuthState() {
  const storedToken = localStorage.getItem('auth_token')
  const storedUser = localStorage.getItem('auth_user')

  if (storedToken && storedUser) {
    try {
      return {
        token: storedToken,
        user: JSON.parse(storedUser) as User,
        loading: false,
      }
    } catch (error) {
      console.error('Error parsing stored user:', error)
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  }

  return {
    token: null,
    user: null,
    loading: false,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initialState = getInitialAuthState()
  const [user, setUser] = useState<User | null>(initialState.user)
  const [token, setToken] = useState<string | null>(initialState.token)
  const [loading] = useState(initialState.loading)

  const login = async (email: string, password: string) => {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }))
      throw new Error(error.message || 'Login failed')
    }

    const data = await response.json()
    const { access_token, user: userData } = data

    setToken(access_token)
    setUser(userData)
    localStorage.setItem('auth_token', access_token)
    localStorage.setItem('auth_user', JSON.stringify(userData))
  }

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, firstName, lastName }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Registration failed' }))
      throw new Error(error.message || 'Registration failed')
    }

    const data = await response.json()
    const { access_token, user: userData } = data

    setToken(access_token)
    setUser(userData)
    localStorage.setItem('auth_token', access_token)
    localStorage.setItem('auth_user', JSON.stringify(userData))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
