import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { apiFetch } from '../services/api.js'
import Logo from './Logo.jsx'
import { inputClasses } from '../styles/formClasses.js'

export default function AddEquipmentUnit() {
  const { id } = useParams()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const [conditions, setConditions] = useState([])

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const formData = new FormData(event.currentTarget)

    const equipmentData = {
      location: formData.get('location').trim(),
      condition: formData.get('condition').trim(),
    }

    setError('')

    if (
      !equipmentData.location ||
      !equipmentData.condition
    ) {
      setError('Please complete all mandatory fields with valid input.')
      return
    }

    setIsSubmitting(true)

    try {
      await apiFetch(`/api/equipment/${id}/units`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(equipmentData)
      })

      navigate(`/dashboard/equipment/${id}`, {
        replace: true,
        state: {
          message: 'Equipment unit successfully added.'
        }
      })
    } catch (error) {
      setError(
        error.status
          ? error.message
          : 'Equipment unit could not be created. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    async function getConditions() {
      try {
        const result = await apiFetch('/api/equipment/conditions')
        setConditions(result)
      } catch (error) {
        setError(
          error.status
            ? error.message
            : 'Equipment conditions could not be loaded. Please try again.'
        )
      }
    }

    getConditions()
  }, [])

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
            Add new equipment unit
          </h1>

        </header>

        <form onSubmit={handleSubmit}>
          <fieldset
            disabled={isSubmitting}
            className="flex min-w-0 flex-col gap-5"
          >
            <legend className="sr-only">Equipment unit details</legend>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Location
              <input
                className={`${inputClasses} bg-field`}
                type="text"
                name="location"
                placeholder="Ex. 'Lab 2 Shelf 14A'"
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Condition
              <select
                className={`${inputClasses} bg-field`}
                name="condition"
                defaultValue="IN_SERVICE"
                required
              >
                <option value="" disabled>
                  Select condition
                </option>

                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition.replaceAll('_', ' ').toLowerCase()}
                  </option>
                ))}
              </select>
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
              disabled={isSubmitting || conditions.length === 0}
              className="min-h-12 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? 'Adding equipment unit...' : 'Add equipment unit'}
            </button>
          </fieldset>
        </form>

      </div>
    </section>
  )
}