import { ref, computed, provide, inject, type InjectionKey } from 'vue'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

interface AuthState {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
}

const AuthKey: InjectionKey<AuthState> = Symbol('auth')

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

export function provideAuth() {
  const initialState = getInitialAuthState()
  const user = ref<User | null>(initialState.user)
  const token = ref<string | null>(initialState.token)
  const loading = ref(initialState.loading)

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

    token.value = access_token
    user.value = userData
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

    token.value = access_token
    user.value = userData
    localStorage.setItem('auth_token', access_token)
    localStorage.setItem('auth_user', JSON.stringify(userData))
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Provide reactive state
  const authState: AuthState = {
    get user() {
      return user.value
    },
    get token() {
      return token.value
    },
    get isAuthenticated() {
      return isAuthenticated.value
    },
    get loading() {
      return loading.value
    },
    login,
    register,
    logout,
  }

  provide(AuthKey, authState)

  return authState
}

export function useAuth(): AuthState {
  const auth = inject(AuthKey)
  if (!auth) {
    throw new Error('useAuth must be used within a component that provides auth')
  }
  return auth
}
