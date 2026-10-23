import { useState } from 'react'
import { apiFetch } from '../services/api.js'
import { PackageCheck } from 'lucide-react'

const statusClasses = {
  PENDING: 'bg-amber-100 text-amber-800',
  APPROVED: 'bg-sky-100 text-sky-800',
  ACTIVE: 'bg-sky-100 text-sky-800',
  RETURN_REQUESTED: 'bg-amber-100 text-amber-800',
  RETURNED: 'bg-success-bg text-success',
  REJECTED: 'bg-danger-bg text-danger',
  READY: 'bg-success-bg text-success',
  SCHEDULED: 'bg-sky-100 text-sky-800',
  NOT_READY: 'bg-amber-100 text-amber-800',
  PERIOD_PASSED: 'bg-danger-bg text-danger',
  OVERDUE: 'bg-danger-bg text-danger'
}

const statusTexts = {
  PENDING: 'Pending approval',
  APPROVED: 'Approved',
  ACTIVE: 'On loan',
  RETURN_REQUESTED: 'Return pending',
  RETURNED: 'Returned',
  REJECTED: 'Rejected',
  READY: 'Ready for pickup',
  SCHEDULED: 'Scheduled',
  NOT_READY: 'Not ready for pickup',
  PERIOD_PASSED: 'Pickup period has passed',
  OVERDUE: 'Overdue'
}

export default function MyLoanCard({ loan, onUpdated }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  let displayStatus

  if (loan.isOverdue && loan.status === 'ACTIVE') {
    displayStatus = 'OVERDUE'
  } else if (loan.pickupStatus != null) {
    displayStatus = loan.pickupStatus
  } else {
    displayStatus = loan.status
  }

const statusText = statusTexts[displayStatus] ?? displayStatus

  function formatDate(date, timeZone = 'UTC') {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone
    }).format(new Date(date))
  }

  async function requestReturn() {
    if (isSubmitting) {
      return
    }

    setError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      await apiFetch(`/api/loans/${loan.id}/request-return`, {
        method: 'PATCH'
      })

      setSuccessMessage('Equipment return requested.')
      onUpdated()
    } catch (error) {
      setError(
        error.status
          ? error.message
          : 'Loan could not be updated. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function renderActions() {
    if (loan.status === 'ACTIVE') {
      return (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={requestReturn}
            disabled={isSubmitting}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
          >
            <PackageCheck size={18} aria-hidden="true" />
            {isSubmitting
              ? 'Requesting return...'
              : 'Register return'}
          </button>

          <p className="text-sm text-muted">
            A caretaker will check the equipment and confirm the return.
          </p>
        </div>
      )
    }

    return null
  }

  return (
    <li className="w-full rounded-xl border border-field-border bg-field p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-body">
          {loan.equipmentUnit.identifier}
        </h3>

        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            statusClasses[displayStatus] || 'bg-white text-body'
          }`}
        >
          {statusText}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div>
          <p className="text-sm font-medium text-muted">
            Equipment
          </p>
          <p>{loan.equipmentUnit.equipmentType.name}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted">
            Location
          </p>
          <p>{loan.equipmentUnit.location}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted">
            Loan period
          </p>
          <p>
            {formatDate(loan.startDate)} – {formatDate(loan.endDate)}
          </p>
        </div>

        {['ACTIVE', 'RETURN_REQUESTED', 'RETURNED'].includes(loan.status) && loan.checkedOutAt && (
          <div>
            <p className="text-sm font-medium text-muted">
              Checked out on
            </p>
            <p>{formatDate(loan.checkedOutAt, 'Europe/Stockholm')}</p>
          </div>
        )}

        {loan.status === 'RETURNED' && loan.returnedAt && (
          <div>
            <p className="text-sm font-medium text-muted">
              Returned on
            </p>
            <p>{formatDate(loan.returnedAt, 'Europe/Stockholm')}</p>
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

        {successMessage && (
          <p
            role="status"
            className="rounded-lg bg-success-bg p-3 text-sm text-success"
          >
            {successMessage}
          </p>
        )}
      </div>
    </li>
  )
}
