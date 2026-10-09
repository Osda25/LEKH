import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { apiFetch } from '../services/api.js'
import Logo from './Logo.jsx'

export default function AddEquipmentType() {
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])

  const inputClasses =
    'w-full rounded-lg border border-field-border bg-field px-3 py-3 text-base focus:outline-2 focus:outline-offset-2 focus:outline-brand'

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const formData = new FormData(event.currentTarget)

    const equipmentData = {
      name: formData.get('name').trim(),
      category: formData.get('category').trim(),
      description: formData.get('description').trim()
    }

    setError('')

    if (
      !equipmentData.name ||
      !equipmentData.category
    ) {
      setError('Please complete all mandatory fields with valid input.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await apiFetch('/api/equipment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(equipmentData)
      })

      navigate(`/equipment/${result.data.id}`, {
        replace: true,
        state: {
          message: 'Equipment type successfully added.'
        }
      })
    } catch (error) {
      setError(
        error.status
          ? error.message
          : 'Equipment type could not be created. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    async function getCategories() {
      try {
        const result = await apiFetch('/api/equipment/categories')
        setCategories(result)
      } catch (error) {
        setError(
          error.status
            ? error.message
            : 'Equipment categories could not be loaded. Please try again.'
        )
      }
    }

    getCategories()
  }, [])

  return (
    <section className="flex min-h-dvh items-center justify-center bg-brand px-4 py-8">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-body shadow-xl sm:p-10">
        <header className="mb-8">
          <Logo />

          <Link
            to="/dashboard"
            className="mb-6 mt-6 inline-flex min-h-11 items-center gap-2 rounded text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <span aria-hidden="true">←</span>
            Management dashboard
          </Link>

          <h1 className="mt-4 text-2xl font-bold text-center">
            Add new equipment type
          </h1>

        </header>

        <form onSubmit={handleSubmit}>
          <fieldset
            disabled={isSubmitting}
            className="flex min-w-0 flex-col gap-5"
          >
            <legend className="sr-only">Equipment details</legend>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Name
              <input
                className={inputClasses}
                type="text"
                name="name"
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Category
              <select
                className={inputClasses}
                name="category"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select category
                </option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Description
              <textarea
                className={inputClasses}
                name="description"
                rows={4}
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
              disabled={isSubmitting || categories.length === 0}
              className="min-h-12 rounded-lg bg-brand px-4 py-3 font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? 'Adding equipment...' : 'Add equipment'}
            </button>
          </fieldset>
        </form>

      </div>
    </section>
  )
}