import { useState } from 'react'
import { useParams } from 'react-router'
import { apiFetch } from '../services/api.js'
import { inputClasses } from '../styles/formClasses.js'

export default function KnownProblemForm({ onSuccess }) {
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { id } = useParams()

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const formData = new FormData(event.currentTarget)

    const equipmentData = {
      title: formData.get('title').trim(),
      description: formData.get('description').trim()
    }

    setError('')

    if (
      !equipmentData.title ||
      !equipmentData.description
    ) {
      setError('Please complete all mandatory fields with valid input.')
      return
    }

    setIsSubmitting(true)

    try {
      await apiFetch(`/api/equipment/${id}/problems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(equipmentData)
      })

      onSuccess()
    } catch (error) {
      setError(
        error.status
          ? error.message
          : 'Known problem could not be created. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <fieldset
          className="flex min-w-0 flex-col gap-5"
          disabled={isSubmitting}
        >
          <legend className="sr-only">Known problem details</legend>

          <label className="flex flex-col gap-2 text-sm font-medium">
            Title
            <input
              className={`${inputClasses} bg-field`}
              type="text"
              name="title"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium">
            Description
            <textarea
              className={`${inputClasses} bg-field`}
              name="description"
              rows={4}
              required
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-12 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? 'Adding problem...' : 'Add known problem'}
          </button>
        </fieldset>
      </form>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-800"
        >
          {error}
        </p>
      )}
    </div>
  )
}