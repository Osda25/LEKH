import { useState } from 'react'
import { apiFetch } from '../services/api.js'
import { inputClasses } from '../styles/formClasses.js'

const statusClasses = {
  OPEN: 'bg-danger-bg text-danger',
  REVIEWED: 'bg-success-bg text-success'
}

export default function ManagementFaultReportCard({ faultReport, onUpdated }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const statusText = faultReport.status.replaceAll('_', ' ').toLowerCase()

  function formatDate(date) {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Europe/Stockholm'
    }).format(new Date(date))
  }

  async function handleReview(event) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const formData = new FormData(event.currentTarget)
    const reviewNote = formData.get('reviewNote').trim()

    setError('')
    setIsSubmitting(true)

    try {
      await apiFetch(`/api/fault-reports/${faultReport.id}/review`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reviewNote })
      })

      onUpdated()
    } catch (error) {
      setError(
        error.status
          ? error.message
          : 'Fault report could not be updated. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }


  function renderActions() {
    if (faultReport.status === 'OPEN') {
      return (
        <div className="flex flex-col gap-2">
          <form
            onSubmit={handleReview}
          >
            <fieldset
              className="flex min-w-0 flex-col gap-5"
              disabled={isSubmitting}
            >
              <legend className="sr-only">Review details</legend>
    
              <label className="flex flex-col gap-2 text-sm font-medium">
                Add a review note (optional)
                <textarea
                  name='reviewNote'
                  className={`${inputClasses} bg-white`}
                  rows={4}
                />
              </label>
    
              <button
                type="submit"
                disabled={isSubmitting}
                className="mb-4 min-h-12 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-60"
              >
                {isSubmitting ? 'Confirming review...' : 'Confirm review'}
              </button>
            </fieldset>
          </form>
        </div>
      )
    }

    return null
  }

  return (
    <li className="w-full rounded-xl border border-field-border bg-field p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-body">
          {faultReport.title}
        </h3>

        <span
          className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${
            statusClasses[faultReport.status] || 'bg-white text-body'
          }`}
        >
          {statusText}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div>
          <p className="text-sm font-medium text-muted">
            Description
          </p>
          <p className="italic">{faultReport.description}</p>
        </div>

        {faultReport.status === 'REVIEWED' && faultReport.reviewNote && (
          <div>
            <p className="text-sm font-medium text-muted">
              Note by caretaker
            </p>
            <p className="italic">{faultReport.reviewNote}</p>
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-muted">
            Equipment type
          </p>
          <p>{faultReport.equipmentUnit.equipmentType.name}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted">
            Unit identifier
          </p>
          <p>{faultReport.equipmentUnit.identifier}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted">
            Reported by
          </p>
          <p>{faultReport.reportedBy.name}</p>
          <p className="break-words text-sm text-muted">
            {faultReport.reportedBy.email}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted">
            Reported on
          </p>
          <p>
            {formatDate(faultReport.createdAt)}
          </p>
        </div>

        {faultReport.status === 'REVIEWED' && faultReport.reviewedAt && (
          <div>
            <p className="text-sm font-medium text-muted">
              Reviewed on
            </p>
            <p>{formatDate(faultReport.reviewedAt)}</p>
          </div>
        )}

        {renderActions()}

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-800"
          >
            {error}
          </p>
        )}

      </div>
    </li>
  )
}
