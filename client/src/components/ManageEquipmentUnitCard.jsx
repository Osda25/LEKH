import { useState } from "react"
import { useParams } from "react-router"
import { apiFetch } from "../services/api"
import { Flag, X } from 'lucide-react'
import ProblemListItem from "./ProblemListItem.jsx"
import FaultReportForm from './FaultReportForm.jsx'

export default function ManageEquipmentUnitCard({ equipmentUnit, problems, onUpdated, conditions }) {
  const [unitCondition, setUnitCondition] = useState(equipmentUnit.condition)
  const [openForm, setOpenForm] = useState(false)
  const [conditionError, setConditionError] = useState('')
  const [successConditionMessage, setSuccessConditionMessage] = useState('')
  const [successFaultMessage, setSuccessFaultMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { id } = useParams()

  const availabilityText =
    equipmentUnit.available
      ? 'Available'
      : 'Unavailable'

  async function handleConditionSubmit(event) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const equipmentUnitData = {
      condition: unitCondition
    }

    setConditionError('')
    setSuccessConditionMessage('')

    if (
      !equipmentUnitData.condition
    ) {
      setConditionError('Please complete all mandatory fields with valid input.')
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

      setSuccessConditionMessage('Unit successfully updated.')
      onUpdated()
    } catch (error) {
      setConditionError(
        error.status
          ? error.message
          : 'Equipment unit could not be updated. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function renderKnownProblems() {
    if (problems.length === 0) {
      return (
        <li className="text-sm italic text-muted">
          No problems reported.
        </li>
      )
    }

    return problems.map((problem) => (
      <ProblemListItem
        key={problem.id}
        item={problem}
      />
    ))
  }

  function renderFaultReports() {
    if (equipmentUnit.faultReports.length === 0) {
      return (
        <li className="text-sm italic text-muted">
          No faults reported.
        </li>
      )
    }

    return equipmentUnit.faultReports.map((fault) => (
      <ProblemListItem
        key={fault.id}
        item={fault}
      />
    ))
  }

  return (
    <li className="w-full rounded-xl border border-field-border bg-field p-4">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-bold text-body">
          {equipmentUnit.identifier}
        </h3>

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
          <form onSubmit={handleConditionSubmit}>
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
                    setConditionError('')
                    setSuccessConditionMessage('')
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

              {conditionError && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-800"
                >
                  {conditionError}
                </p>
              )}

              {successConditionMessage && (
                <p
                  role="status"
                  className="rounded-lg bg-success-bg p-3 text-sm text-success"
                >
                  {successConditionMessage}
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || equipmentUnit.condition === unitCondition}
                  className="min-h-12 max-w-24 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </fieldset>
          </form>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium text-muted">
            Known problems
          </h3>

          <ul className="flex flex-col gap-2">
            {renderKnownProblems()}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium text-muted">
            Reported faults
          </h3>

          <ul className="flex flex-col gap-2">
            {renderFaultReports()}
          </ul>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              setOpenForm((previous) => !previous)
              setSuccessFaultMessage('')
            }}
            disabled={isSubmitting}
            aria-expanded={openForm}
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50 ${
              openForm
                ? 'border-field-border bg-white text-body hover:bg-field'
                : 'border-brand bg-brand text-white hover:bg-brand-hover'
            }`}
          >
            {openForm ? (
              <X size={18} aria-hidden="true" />
            ) : (
              <Flag size={18} aria-hidden="true" />
            )}

            {openForm ? 'Cancel' : 'Report a unit fault'}
          </button>
        </div>

        {openForm && (
          <FaultReportForm
            equipmentUnit={equipmentUnit}
            onSuccess={() => {
              setOpenForm(false)
              setSuccessFaultMessage('Fault report created.')
              onUpdated()
            }}
          />
          )}

        {successFaultMessage && (
          <p
            role="status"
            className="rounded-lg bg-success-bg p-3 text-sm text-success"
          >
            {successFaultMessage}
          </p>
        )}
      </div>
    </li>
  )
}