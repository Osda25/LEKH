import Logo from './Logo.jsx'
import DashboardCard from './DashboardCard.jsx'
import {
  Boxes,
  BookOpen,
  CalendarCheck,
  Wrench
} from 'lucide-react'

export default function Dashboard() {
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
            description="Types, units and condition"
            icon={Boxes}
            to="/dashboard/equipment"
          />

          <DashboardCard
            title="Guides"
            description="Setup and usage instructions"
            icon={BookOpen}
          />

          <DashboardCard
            title="Loans & Requests"
            description="Borrowing and returns"
            icon={CalendarCheck}
          />

          <DashboardCard
            title="Fault Reports"
            description="Reported and known problems"
            icon={Wrench}
          />

        </div>
      </div>
    </section>
  )
}