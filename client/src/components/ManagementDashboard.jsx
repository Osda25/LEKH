import { useState, useEffect } from 'react'
import { apiFetch } from '../services/api.js'
import Logo from './Logo.jsx'
import DashboardCard from './DashboardCard.jsx'
import {
  Boxes,
  CalendarCheck,
  Flag
} from 'lucide-react'

export default function ManagementDashboard() {
  const [actionRequiredLoanCount, setActionRequiredLoanCount] = useState(null)
  const [openFaultReportCount, setOpenFaultReportCount] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadLoanCount() {
      try {
        const loans = await apiFetch('/api/loans')

        const actionRequiredCount = loans.filter((loan) =>
          ['PENDING', 'RETURN_REQUESTED'].includes(loan.status)
        ).length

        if (!cancelled) {
          setActionRequiredLoanCount(actionRequiredCount)
        }
      } catch (error) {
        console.error('Failed to load loan count:', error)
      }
    }

    loadLoanCount()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadFaultReportCount() {
      try {
        const faultReports = await apiFetch('/api/fault-reports')

        const openCount = faultReports.filter(
          (faultReport) => faultReport.status === 'OPEN'
        ).length

        if (!cancelled) {
          setOpenFaultReportCount(openCount)
          setError('')
        }
      } catch {
        if (!cancelled) {
          setError('Fault report count could not be loaded.')
        }
      }
    }

    loadFaultReportCount()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="flex min-h-dvh items-center justify-center bg-brand px-4 py-8">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-6 text-body shadow-xl sm:p-10">
        <header className="mb-8">
          <Logo />

          <h1 className="mt-6 text-center text-2xl font-bold">
            Management Dashboard
          </h1>

          <p className="mt-3 text-center text-muted">
            Manage laboratory equipment, guides, loans and reported faults.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DashboardCard
            title="Equipment"
            description="Manage equipment, units and guides"
            icon={Boxes}
            to="/dashboard/equipment"
          />

          <DashboardCard
            title="Loans & Requests"
            description="Review loan requests and manage returns"
            icon={CalendarCheck}
            to="/dashboard/loans"
            badgeCount={actionRequiredLoanCount}
            badgeLabel="to handle"
          />

          <DashboardCard
            title="Fault Reports"
            description="Review submitted fault reports"
            icon={Flag}
            to="/dashboard/fault-reports"
            badgeCount={openFaultReportCount}
          />
        </div>

        {error && (
          <p role="status" className="mt-4 text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    </section>
  )
}
