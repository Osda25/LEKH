import { useState, useEffect } from 'react'
import { apiFetch } from '../services/api.js'
import { inputClasses } from '../styles/formClasses.js'

export default function LoanRequestForm({ equipmentUnit, onSuccess }) {
  const [error, setError] = useState('')
  const [bookingPeriodError, setBookingPeriodError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingPeriods, setIsLoadingPeriods] = useState(true)
  const [bookedPeriods, setBookedPeriods] = useState([])
  const [isOverdue, setIsOverdue] = useState(false)

  const maxLoanDays = 14

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const formData = new FormData(event.currentTarget)

    const loanData = {
      equipmentUnitId: equipmentUnit.id,
      startDate: formData.get('startDate').trim(),
      endDate: formData.get('endDate').trim()
    }

    setError('')

    if (
      !loanData.startDate ||
      !loanData.endDate
    ) {
      setError('Please complete all mandatory fields with valid input.')
      return
    }

    if (loanData.startDate > loanData.endDate) {
      setError(
        'End date cannot be before start date. Please choose another period.'
      )
      return
    }

    const hasConflict = bookedPeriods.some((period) => (
      loanData.startDate <= period.endDate &&
      loanData.endDate >= period.startDate
    ))

    if (hasConflict) {
      setError(
        'The selected dates overlap an existing booking. Please choose another period.'
      )
      return
    }

    const loanDays =
      Math.round(
        (Date.parse(loanData.endDate) - Date.parse(loanData.startDate)) /
        (1000 * 60 * 60 * 24)
      ) + 1

    if (loanDays > maxLoanDays) {
      setError(
        `Loan period cannot exceed ${maxLoanDays} days.`
      )
      return
    }

    setIsSubmitting(true)

    try {
      await apiFetch(`/api/loans/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loanData)
      })

      onSuccess()
    } catch (error) {
      setError(
        error.status
          ? error.message
          : 'Loan request could not be created. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(new Date(`${date}T00:00:00Z`))
  }

  function renderBookedPeriods() {
    if (isLoadingPeriods) {
      return (
        <li className="text-sm text-muted">
          Loading booked periods...
        </li>
      )
    }

    if (bookedPeriods.length === 0) {
      return (
        <li className="text-sm italic text-muted">
          No booked periods.
        </li>
      )
    }

    return bookedPeriods.map((period) => (
      <li
        key={`${period.startDate}-${period.endDate}`}
        className="text-sm font-semibold text-body"
      >
        {formatDate(period.startDate)} – {formatDate(period.endDate)}
      </li>
    ))
  }

  useEffect(() => {
    let ignore = false

    async function getBookedPeriods() {
      try {
        const result = await apiFetch(
          `/api/loans/booked-periods/${equipmentUnit.id}`
        )

        if (!ignore) {
          setBookedPeriods(result.bookedPeriods)
          setIsOverdue(result.hasOverdueLoan)
        }
      } catch (error) {
        if (!ignore) {
          setBookingPeriodError(
            error.status
              ? error.message
              : 'Booked periods could not be loaded.'
          )
        }
      } finally {
        if (!ignore) {
          setIsLoadingPeriods(false)
        }
      }
    }

    getBookedPeriods()

    return () => {
      ignore = true
    }
  }, [equipmentUnit.id])

  return (
    <div>
      <h4 className="mb-2 text-base font-semibold text-center text-body">Booked periods</h4>

      <p className="mt-1 mb-2 text-sm text-muted">
            These dates are already reserved. Please request a period that does not overlap.
      </p>

      {bookingPeriodError ? (
        <p role="alert" className="mt-3 text-sm text-danger">
          {bookingPeriodError}
        </p>
      ) : (
        <ul className="rounded-lg border border-field-border bg-white px-3 py-2 mt-3 flex flex-col gap-2">
          {renderBookedPeriods()}
        </ul>
      )}

      {isOverdue && (
        <p className="mt-1 mb-2 p-2 italic text-sm text-red-900">
          An existing loan is overdue. The unit's future availability may be affected.
        </p>
      )}

      <h4 className="mb-2 mt-4 text-base font-semibold text-center text-body">Select dates</h4>

      <p className="mt-1 mb-2 text-sm text-center text-muted">Maximum loan period is {maxLoanDays} days.</p>

      <form
        onSubmit={handleSubmit}
      >
        <fieldset
          className="flex min-w-0 flex-col gap-5"
          disabled={isSubmitting}
        >
          <legend className="sr-only">Loan request details</legend>

          <label className="flex flex-col gap-2 text-sm font-medium">
            Start date
            <input
              className={`${inputClasses} bg-white`}
              type="date"
              name="startDate"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium">
            End date
            <input
              className={`${inputClasses} bg-white`}
              type="date"
              name="endDate"
              required
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mb-4 min-h-12 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? 'Submitting request...' : 'Submit loan request'}
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