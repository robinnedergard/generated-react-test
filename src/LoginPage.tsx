import { useState, type FormEvent } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import './App.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/account/orders'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="shop">
      <div className="checkout-page">
        <div className="checkout-page__content">
          <div
            className="checkout-page__form-section"
            style={{ maxWidth: '500px', margin: '0 auto' }}
          >
            <h1 className="checkout-page__title">Login</h1>

            <form className="checkout-form" onSubmit={handleSubmit}>
              {error && (
                <div className="checkout-form__error">
                  <p>{error}</p>
                </div>
              )}

              <div className="checkout-form__group">
                <label htmlFor="email" className="checkout-form__label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="checkout-form__input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="checkout-form__group">
                <label htmlFor="password" className="checkout-form__label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="checkout-form__input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn--primary btn--full checkout-form__submit"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: 'inherit', textDecoration: 'underline' }}>
                  Register here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
