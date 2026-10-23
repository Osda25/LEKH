
import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { apiFetch } from '../services/api.js'
import ManagementFaultReportCard from './ManagementFaultReportCard.jsx'

export default function ManageFaultReports() {
  const [faultReports, setFaultReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [showClosedFaultReports, setShowClosedFaultReports] = useState(false)

  useEffect(() => {
    async function loadFaultReports() {
      try {
        const result = await apiFetch('/api/fault-reports/')
        setFaultReports(result)
        setError('')
      } catch (error) {
        setError(
          error.status
            ? error.message
            : 'Fault reports could not be loaded. Please try again.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadFaultReports()
  }, [refreshKey])

  function renderFaultReports() {
    if (isLoading) {
      return (
        <li className="text-sm italic text-muted">
          Loading fault reports...
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

    const openFaultReports = faultReports.filter(
      (faultReport) => faultReport.status === 'OPEN'
    )

    const reviewedFaultReports = faultReports.filter(
      (faultReport) => faultReport.status === 'REVIEWED'
    )

    return (
      <>
        {openFaultReports.length === 0 ? (
          <li className="text-sm italic text-muted">
            No open fault reports.
          </li>
        ) : (
          openFaultReports.map((faultReport) => (
            <ManagementFaultReportCard
              key={faultReport.id}
              faultReport={faultReport}
              onUpdated={() => setRefreshKey((previous) => previous + 1)}
            />
          ))
        )}

        {reviewedFaultReports.length > 0 && (
          <li className="mt-4 border-t border-field-border pt-4">
            <button
              type="button"
              onClick={() => setShowClosedFaultReports((previous) => !previous)}
              aria-expanded={showClosedFaultReports}
              className="min-h-11 text-sm font-semibold text-brand hover:underline"
            >
              {showClosedFaultReports
                ? 'Hide reviewed fault reports '
                : `Show reviewed fault reports (${reviewedFaultReports.length})`}
            </button>

            {showClosedFaultReports && (
              <ul className="mt-4 flex flex-col gap-4">
                {reviewedFaultReports.map((faultReports) => (
                  <ManagementFaultReportCard
                    key={faultReports.id}
                    faultReport={faultReports}
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
    <section className="flex flex-1 items-center justify-center bg-brand px-4 py-8">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-body shadow-xl sm:p-10">
        <header className="mb-8">

          <Link
            to="/dashboard"
            className="mt-4 flex min-h-11 w-fit items-center gap-2 rounded text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <span aria-hidden="true">←</span>
            Management Dashboard
          </Link>

          <h1 className="mt-4 text-center text-2xl font-bold">
            Manage fault reports
          </h1>

        </header>

        <div className="border-t border-field-border pt-6">
          <p className="mt-3 text-center text-sm text-muted">
            Review and comment on open fault reports.
          </p>

          <ul className="mt-4 flex flex-col gap-4">
            {renderFaultReports()}
          </ul>
        </div>
      </div>
    </section>
  )
}
