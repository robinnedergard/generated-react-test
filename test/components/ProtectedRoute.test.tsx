import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'

// Mock useAuth and Navigate before imports
const mockUseAuth = vi.fn()
const mockNavigate = vi.fn(({ to }) => <div data-testid="navigate" data-to={to} />)

vi.mock('#src/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Navigate: ({ to, ...props }: { to: string }) => mockNavigate({ to, ...props }),
    MemoryRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useLocation: () => ({
      pathname: '/protected',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    }),
  }
})

// Import after mocks
import { ProtectedRoute } from '#src/components/ProtectedRoute'

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      token: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isAuthenticated: false,
      loading: false,
    })

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    )

    // Should show Navigate component redirecting to /login
    const navigate = screen.getByTestId('navigate')
    expect(navigate).toBeInTheDocument()
    expect(navigate).toHaveAttribute('data-to', '/login')
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('shows loading state when loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      token: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isAuthenticated: false,
      loading: true,
    })

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    )

    // Should show loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('renders children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: '1',
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
      },
      token: 'mock-token',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isAuthenticated: true,
      loading: false,
    })

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    )

    // Content should be visible when authenticated
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument()
  })
})
