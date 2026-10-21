
import { useState } from 'react'
import { apiFetch } from '../services/api.js'
import { Check, X, PackageCheck, PackageOpen } from 'lucide-react'

const statusClasses = {
  PENDING: 'bg-white text-body',
  APPROVED: 'bg-success-bg text-success',
  ACTIVE: 'bg-danger-bg text-danger',
  RETURN_REQUESTED: 'bg-danger-bg text-danger',
  RETURNED: 'bg-success-bg text-success',
  REJECTED: 'bg-white text-muted'
}

export default function ManagementLoanCard({ loan, onUpdated }) {
  const [isSubmitting, setIsSubmitting] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const today = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Stockholm',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date())

  const startDate = loan.startDate.slice(0, 10)
  const endDate = loan.endDate.slice(0, 10)

  const canCheckOut = startDate <= today && endDate >= today

  const statusText = loan.status.replaceAll('_', ' ').toLowerCase()

  function formatDate(date) {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(new Date(date))
  }

  async function handleAction(action) {
    if (isSubmitting) {
      return
    }

    setError('')
    setSuccessMessage('')
    setIsSubmitting(action)

    try {
      await apiFetch(`/api/loans/${loan.id}/${action}`, {
        method: 'PATCH'
      })

      const messages = {
        approve: 'Loan request approved.',
        reject: 'Loan request rejected.',
        checkout: 'Equipment checkout registered.',
        return: 'Equipment return registered.'
      }

      setSuccessMessage(messages[action])
      onUpdated()
    } catch (error) {
      setError(
        error.status
          ? error.message
          : 'Loan could not be updated. Please try again.'
      )
    } finally {
      setIsSubmitting('')
    }
  }

  function renderActions() {
    if (loan.status === 'PENDING') {
      return (
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => handleAction('approve')}
            disabled={Boolean(isSubmitting)}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
          >
            <Check size={18} aria-hidden="true" />
            {isSubmitting === 'approve' ? 'Approving...' : 'Approve'}
          </button>

          <button
            type="button"
            onClick={() => handleAction('reject')}
            disabled={Boolean(isSubmitting)}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-field-border bg-white px-4 py-3 text-sm font-semibold text-body hover:bg-field focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
          >
            <X size={18} aria-hidden="true" />
            {isSubmitting === 'reject' ? 'Rejecting...' : 'Reject'}
          </button>
        </div>
      )
    }

    if (loan.status === 'APPROVED') {
      return (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => handleAction('checkout')}
            disabled={Boolean(isSubmitting) || !canCheckOut}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
          >
            <PackageOpen size={18} aria-hidden="true" />
            {isSubmitting === 'checkout'
              ? 'Registering checkout...'
              : 'Register checkout'}
          </button>

          {!canCheckOut && (
            <p className="text-sm italic text-muted">
              Checkout is only available during the approved loan period.
            </p>
          )}
        </div>
      )
    }

    if (loan.status === 'ACTIVE' || loan.status === 'RETURN_REQUESTED') {
      return (
        <button
          type="button"
          onClick={() => handleAction('return')}
          disabled={Boolean(isSubmitting)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
        >
          <PackageCheck size={18} aria-hidden="true" />
          {isSubmitting === 'return'
            ? 'Registering return...'
            : loan.status === 'RETURN_REQUESTED'
              ? 'Confirm return'
              : 'Register return'}
        </button>
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
          className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${
            statusClasses[loan.status] || 'bg-white text-body'
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
            Requested by
          </p>
          <p>{loan.user.name}</p>
          <p className="break-words text-sm text-muted">
            {loan.user.email}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted">
            Loan period
          </p>
          <p>
            {formatDate(loan.startDate)} – {formatDate(loan.endDate)}
          </p>
        </div>

        {loan.status === 'RETURNED' && loan.returnedAt && (
          <div>
            <p className="text-sm font-medium text-muted">
              Returned on
            </p>
            <p>{formatDate(loan.returnedAt)}</p>
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
