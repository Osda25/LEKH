import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { apiFetch } from '../services/api.js'
import Logo from './Logo.jsx'
import { inputClasses } from '../styles/formClasses.js'

export default function AddEquipmentGuide() {
  const { id } = useParams()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const formData = new FormData(event.currentTarget)

    const guideData = {
      title: formData.get('title').trim(),
      content: formData.get('content').trim(),
      url: formData.get('url').trim()
    }

    setError('')

    if (
      !guideData.title ||
      !guideData.content
    ) {
      setError('Please complete all mandatory fields with valid input.')
      return
    }

    setIsSubmitting(true)

    try {
      await apiFetch(`/api/equipment/${id}/guides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(guideData)
      })

      navigate(`/dashboard/equipment/${id}`, {
        replace: true,
        state: {
          message: 'Equipment guide successfully added.'
        }
      })
    } catch (error) {
      setError(
        error.status
          ? error.message
          : 'Equipment guide could not be created. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="flex min-h-dvh items-center justify-center bg-brand px-4 py-8">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-body shadow-xl sm:p-10">
        <header className="mb-8">
          <Logo />

          <Link
            to={`/dashboard/equipment/${id}`}
            className="mb-6 mt-6 inline-flex min-h-11 items-center gap-2 rounded text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <span aria-hidden="true">←</span>
            Manage equipment type
          </Link>

          <h1 className="mt-4 text-2xl font-bold text-center">
            Add new equipment guide
          </h1>

        </header>

        <form onSubmit={handleSubmit}>
          <fieldset
            disabled={isSubmitting}
            className="flex min-w-0 flex-col gap-5"
          >
            <legend className="sr-only">Equipment guide details</legend>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Title*
              <input
                className={`${inputClasses} bg-field`}
                type="text"
                name="title"
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Content*
              <textarea
                className={`${inputClasses} bg-field`}
                rows={8}
                name="content"
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              External link (optional)
              <input
                className={`${inputClasses} bg-field`}
                type="url"
                name="url"
                placeholder="https://example.com"
              />
            </label>

            <p className="italic text-sm font-medium">*Required fields</p>

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
              className="min-h-12 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? 'Adding guide...' : 'Add guide'}
            </button>
          </fieldset>
        </form>

      </div>
    </section>
  )
}