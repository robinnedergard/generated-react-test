import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import FormField from './components/FormField'
import ErrorMessage from './components/ErrorMessage'
import PageContainer from './components/PageContainer'

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
    <PageContainer>
      <div className="max-w-[500px] mx-auto">
        <h1 className="text-4xl mb-8 m-0">Register</h1>

        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          {error && <ErrorMessage message={error} />}

          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="firstName"
              name="firstName"
              label="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoComplete="given-name"
            />

            <FormField
              id="lastName"
              name="lastName"
              label="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              autoComplete="family-name"
            />
          </div>

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
            autoComplete="new-password"
            minLength={6}
            small="Must be at least 6 characters"
          />

          <button
            type="submit"
            className="rounded-full px-6 py-3.5 text-sm font-semibold cursor-pointer transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 w-full text-center mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          <p className="text-center mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-inherit underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </PageContainer>
  )
}
