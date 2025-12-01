import { Link } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useCart } from '../../../hooks/useCart'

export function AuthSection() {
  const { isAuthenticated, user, logout } = useAuth()
  const { isCartOpen, toggleCart } = useCart()

  if (isAuthenticated) {
    return (
      <>
        <Link to="/account/orders" className="text-inherit no-underline text-sm mr-2">
          {user?.email}
        </Link>
        <button
          type="button"
          className="rounded-full px-4 py-2 text-sm font-semibold cursor-pointer transition-all bg-transparent border border-slate-200 text-slate-900 hover:-translate-y-0.5"
          onClick={logout}
        >
          Logout
        </button>
      </>
    )
  }

  return (
    <Link
      to="/login"
      className="text-inherit no-underline text-sm mr-2"
      onClick={() => {
        if (isCartOpen) {
          toggleCart()
        }
      }}
    >
      Login
    </Link>
  )
}

