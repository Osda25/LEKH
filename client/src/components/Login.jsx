import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { apiFetch } from '../services/api.js'
import Logo from './Logo.jsx'
import { saveToken } from '../services/token.js'

export default function Login() {
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const inputClasses =
    'w-full rounded-lg border border-field-border bg-field px-3 py-3 text-base focus:outline-2 focus:outline-offset-2 focus:outline-brand'

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const formData = new FormData(event.currentTarget)

    const loginData = {
      email: formData.get('email').trim().toLowerCase(),
      password: formData.get('password')
    }

    setError('')

    if (
      !loginData.email ||
      !loginData.password
    ) {
      setError('Please enter your email and password.')
      return
    }

    setIsSubmitting(true)

    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      })

      saveToken(data.token)

      if (data.role === 'CARETAKER' || data.role === 'ADMIN') {
        navigate('/dashboard', {
          replace: true,
          state: {
            message: 'Login successful.'
          }
        })

        return
      }

      navigate('/equipment', {
        replace: true,
        state: {
          message: 'Login successful.'
        }
      })
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="flex min-h-dvh items-center justify-center bg-brand px-4 py-8">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-body shadow-xl sm:p-10">
        <header className="mb-8 text-center">
          <Logo />

          <h1 className="mt-4 text-2xl font-bold">
            Log in to your account
          </h1>

          <p className="mt-2 text-sm text-muted">
            Log in to explore and borrow lab equipment.
          </p>
        </header>

        {location.state?.message && (
          <p role="status" className="mb-4 text-sm text-muted">
            {location.state.message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <fieldset
            disabled={isSubmitting}
            className="flex min-w-0 flex-col gap-5"
          >
            <legend className="sr-only">Account details</legend>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Email
              <input
                className={inputClasses}
                type="email"
                name="email"
                autoComplete="email"
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Password
              <input
                className={inputClasses}
                type="password"
                name="password"
                autoComplete="current-password"
                required
              />
            </label>

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-800"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-12 rounded-lg bg-brand px-4 py-3 font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? 'Logging in...' : 'Log in'}
            </button>
          </fieldset>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-accent underline underline-offset-4"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  )
}