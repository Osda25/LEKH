import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { apiFetch } from '../services/api.js'
import Logo from './Logo.jsx'
import { inputClasses } from '../styles/formClasses.js'

export default function Register() {
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const formData = new FormData(event.currentTarget)

    const registrationData = {
      name: formData.get('name').trim(),
      email: formData.get('email').trim().toLowerCase(),
      phone: formData.get('phone').trim(),
      password: formData.get('password')
    }

    setError('')

    if (
      !registrationData.name ||
      !registrationData.email ||
      !registrationData.phone ||
      !registrationData.password
    ) {
      setError('Please complete all fields with valid input.')
      return
    }

    setIsSubmitting(true)

    try {
      await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
      })

      navigate('/login', {
        replace: true,
        state: {
          message: 'Account created successfully. You can now log in.'
        }
      })
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.')
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
            Create account
          </h1>

          <p className="mt-2 text-sm text-muted">
            Register to explore and borrow lab equipment.
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <fieldset
            disabled={isSubmitting}
            className="flex min-w-0 flex-col gap-5"
          >
            <legend className="sr-only">Account details</legend>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Full name
              <input
                className={`${inputClasses} bg-field`}
                type="text"
                name="name"
                autoComplete="name"
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Email
              <input
                className={`${inputClasses} bg-field`}
                type="email"
                name="email"
                autoComplete="email"
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Phone number
              <input
                className={`${inputClasses} bg-field`}
                type="tel"
                name="phone"
                autoComplete="tel"
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Password
              <input
                className={`${inputClasses} bg-field`}
                type="password"
                name="password"
                autoComplete="new-password"
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
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </fieldset>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-accent underline underline-offset-4"
          >
            Log in
          </Link>
        </p>
      </div>
    </section>
  )
}