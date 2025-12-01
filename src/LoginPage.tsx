import { useState, type FormEvent } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { FormField } from './components/FormField'
import { ErrorMessage } from './components/ErrorMessage'

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
    <div className="max-w-[500px] mx-auto">
      <h1 className="text-4xl mb-8 m-0">Login</h1>

      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        {error && <ErrorMessage message={error} />}

        <FormField
          id="email"
          name="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <FormField
          id="password"
          name="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <button
          type="submit"
          className="rounded-full px-6 py-3.5 text-sm font-semibold cursor-pointer transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 w-full text-center mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-inherit underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  )
}
