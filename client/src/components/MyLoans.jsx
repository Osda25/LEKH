
import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { apiFetch } from '../services/api.js'
import Logo from './Logo.jsx'
import MyLoanCard from './MyLoanCard.jsx'

export default function MyLoans() {
  const [loans, setLoans] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [showClosedLoans, setShowClosedLoans] = useState(false)

  useEffect(() => {
    async function loadLoans() {
      try {
        const result = await apiFetch('/api/loans/my')
        setLoans(result)
        setError('')
      } catch (error) {
        setError(
          error.status
            ? error.message
            : 'Loans could not be loaded. Please try again.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadLoans()
  }, [refreshKey])

  function renderLoans() {
    if (isLoading) {
      return (
        <li className="text-sm italic text-muted">
          Loading loans...
        </li>
      )
    }

    if (error) {
      return (
        <li
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-800"
        >
          {error}
        </li>
      )
    }

    const activeLoans = loans
      .filter((loan) => !['RETURNED', 'REJECTED'].includes(loan.status))
      .sort((a, b) => {
        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1
        if (a.status !== 'PENDING' && b.status === 'PENDING') return 1
        return 0
      })

    const closedLoans = loans.filter((loan) =>
      ['RETURNED', 'REJECTED'].includes(loan.status)
    )

    return (
      <>
        {activeLoans.length === 0 ? (
          <li className="text-sm italic text-muted">
            No active loans or requests.
          </li>
        ) : (
          activeLoans.map((loan) => (
            <MyLoanCard
              key={loan.id}
              loan={loan}
              onUpdated={() => setRefreshKey((previous) => previous + 1)}
            />
          ))
        )}

        {closedLoans.length > 0 && (
          <li className="mt-4 border-t border-field-border pt-4">
            <button
              type="button"
              onClick={() => setShowClosedLoans((previous) => !previous)}
              aria-expanded={showClosedLoans}
              className="min-h-11 text-sm font-semibold text-brand hover:underline"
            >
              {showClosedLoans
                ? 'Hide closed loans and requests '
                : `Show closed loans and requests (${closedLoans.length})`}
            </button>

            {showClosedLoans && (
              <ul className="mt-4 flex flex-col gap-4">
                {closedLoans.map((loan) => (
                  <MyLoanCard
                    key={loan.id}
                    loan={loan}
                    onUpdated={() => setRefreshKey((previous) => previous + 1)}
                  />
                ))}
              </ul>
            )}
          </li>
        )}
      </>
    )
  }

  return (
    <section className="flex min-h-dvh items-center justify-center bg-brand px-4 py-8">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-body shadow-xl sm:p-10">
        <header className="mb-8">
          <Logo />

          <Link
            to="/equipment"
            className="mt-4 flex min-h-11 w-fit items-center gap-2 rounded text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <span aria-hidden="true">←</span>
            Equipment
          </Link>

          <h1 className="mt-4 text-center text-2xl font-bold">
            My loans
          </h1>

        </header>

        <div className="border-t border-field-border pt-6">
          <p className="mt-3 text-center text-sm text-muted">
            Review your loan requests, active loans and returns.
          </p>

          <ul className="mt-4 flex flex-col gap-4">
            {renderLoans()}
          </ul>
        </div>
      </div>
    </section>
  )
}
