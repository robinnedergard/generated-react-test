import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import './App.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    try {
      await register(email, password, firstName, lastName)
      navigate('/account/orders', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="shop">
      <div className="checkout-page">
        <div className="checkout-page__content">
          <div className="checkout-page__form-section" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h1 className="checkout-page__title">Register</h1>

            <form className="checkout-form" onSubmit={handleSubmit}>
              {error && (
                <div className="checkout-form__error">
                  <p>{error}</p>
                </div>
              )}

              <div className="checkout-form__row">
                <div className="checkout-form__group">
                  <label htmlFor="firstName" className="checkout-form__label">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    className="checkout-form__input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    autoComplete="given-name"
                  />
                </div>

                <div className="checkout-form__group">
                  <label htmlFor="lastName" className="checkout-form__label">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="checkout-form__input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>

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
                  autoComplete="new-password"
                  minLength={6}
                />
                <small style={{ display: 'block', marginTop: '0.25rem', color: '#666' }}>
                  Must be at least 6 characters
                </small>
              </div>

              <button
                type="submit"
                className="btn btn--primary btn--full checkout-form__submit"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>

              <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'inherit', textDecoration: 'underline' }}>
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

