import { useState } from "react"
import { useParams } from "react-router"
import { apiFetch } from "../services/api"

export default function ManageEquipmentUnitCard({ equipmentUnit, onUpdated, conditions }) {
  const [unitCondition, setUnitCondition] = useState(equipmentUnit.condition)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { id } = useParams()

  const availabilityText =
    equipmentUnit.available
      ? 'Available'
      : 'Unavailable'

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const equipmentUnitData = {
      condition: unitCondition
    }

    setError('')
    setSuccessMessage('')

    if (
      !equipmentUnitData.condition
    ) {
      setError('Please complete all mandatory fields with valid input.')
      return
    }

    setIsSubmitting(true)

    try {
      await apiFetch(`/api/equipment/${id}/units/${equipmentUnit.id}/condition`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(equipmentUnitData)
      })

      setSuccessMessage('Unit successfully updated.')
      onUpdated()
    } catch (error) {
      setError(
        error.status
          ? error.message
          : 'Equipment unit could not be updated. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <li className="w-full rounded-xl border border-field-border bg-field p-4">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-bold text-body">
          {equipmentUnit.identifier}
        </h2>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${
            equipmentUnit.available
              ? 'bg-success-bg text-success'
              : 'bg-danger-bg text-danger'
          }`}
        >
          {availabilityText}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div>
          <p className="text-sm font-medium text-muted">Location</p>
          <p>{equipmentUnit.location}</p>
        </div>

        <div>
          <form onSubmit={handleSubmit}>
            <fieldset
              disabled={isSubmitting}
              className="flex min-w-0 flex-col gap-5"
            >
              <label className="flex flex-col gap-2 text-sm font-medium text-muted">
                Condition
                <select
                  className='w-full rounded-lg border border-field-border bg-field px-3 py-3 text-base focus:outline-2 focus:outline-offset-2 focus:outline-brand'
                  name="condition"
                  value={unitCondition}
                  onChange={(event) => {
                    setUnitCondition(event.target.value)
                    setError('')
                    setSuccessMessage('')
                  }}
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

              {successMessage && (
                <p
                  role="status"
                  className="rounded-lg bg-success-bg p-3 text-sm text-success"
                >
                  {successMessage}
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || equipmentUnit.condition === unitCondition}
                  className="min-h-12 max-w-24 rounded-lg bg-brand px-4 py-3 font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </li>
  )
}