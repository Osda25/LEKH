import { Link, useParams, useLocation, useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import { apiFetch } from '../services/api'
import { Flag, X, BookOpen, Box } from 'lucide-react'
import ManageEquipmentUnitCard from './ManageEquipmentUnitCard.jsx'
import EquipmentGuideCard from './EquipmentGuideCard.jsx'
import KnownProblemForm from './KnownProblemForm.jsx'
import ProblemListItem from './ProblemListItem.jsx'

export default function ManageEquipmentDetails() {
  const { id } = useParams()
  const location = useLocation()
  const [equipmentType, setEquipmentType] = useState()
  const [error, setError] = useState('')
  const [successProblemMessage, setSuccessProblemMessage] = useState('')
  const [conditions, setConditions] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)
  const [openForm, setOpenForm] = useState(false)
  const [loans, setLoans] = useState([])
  const [isLoanHistoryLoading, setIsLoanHistoryLoading] = useState(true)
  const [loanHistoryError, setLoanHistoryError] = useState('')
  const [flashMessage, setFlashMessage] = useState(location.state?.message || '')
  const navigate = useNavigate()

  useEffect(() => {
    async function loadEquipmentType() {
      try {
        const result = await apiFetch(`/api/equipment/${id}`)

        setEquipmentType(result)
        setError('')
      } catch (error) {
        setError(
          error.status
            ? error.message
            : 'Equipment details could not be loaded. Please try again.'
        )
      }
    }

    loadEquipmentType()
  }, [id, refreshKey])

  useEffect(() => {
    async function loadLoans() {
      setIsLoanHistoryLoading(true)

      try {
        const result = await apiFetch('/api/loans')
        setLoans(result)
        setLoanHistoryError('')
      } catch (error) {
        setLoans([])
        setLoanHistoryError(
          error.status
            ? error.message
            : 'Borrowing history could not be loaded. Please try again.'
        )
      } finally {
        setIsLoanHistoryLoading(false)
      }
    }

    loadLoans()
  }, [refreshKey])

  useEffect(() => {
    async function getConditions() {
      try {
        const result = await apiFetch('/api/equipment/conditions')
        setConditions(result)
      } catch (error) {
        setError(
          error.status
            ? error.message
            : 'Equipment conditions could not be loaded. Please try again.'
        )
      }
    }

    getConditions()
  }, [])

  useEffect(() => {
    if (location.state?.message) {
      navigate(location.pathname, {
        replace: true,
        state: null
      })
    }
  }, [location.pathname, location.state?.message, navigate])

  function renderKnownProblems() {
    if (equipmentType.problems.length === 0) {
      return (
        <li className="text-sm italic text-muted">
          No problems reported.
        </li>
      )
    }

    return equipmentType.problems.map((problem) => (
      <ProblemListItem
        key={problem.id}
        item={problem}
      />
    ))
  }

  function renderUnits() {
    if (equipmentType.units.length === 0) {
      return (
        <li className="mt-4 w-full rounded-xl border border-field-border bg-field p-4">
          No equipment units to show.
        </li>
      )
    }

    return equipmentType.units.map((equipmentUnit) => (
      <ManageEquipmentUnitCard
        key={equipmentUnit.id}
        equipmentUnit={equipmentUnit}
        problems={equipmentType.problems}
        onUpdated={() => setRefreshKey((previous) => previous + 1)}
        conditions={conditions}
        loanHistory={loans.filter((loan) =>
          loan.equipmentUnitId === equipmentUnit.id &&
          loan.status === 'RETURNED'
        )}
        unitLoans={loans.filter((loan) =>
          loan.equipmentUnitId === equipmentUnit.id
        )}
        isLoanHistoryLoading={isLoanHistoryLoading}
        loanHistoryError={loanHistoryError}
      />
    ))
  }

  function renderGuides() {
    if (equipmentType.guides.length === 0) {
      return (
        <li className="w-full rounded-xl border border-field-border bg-field p-4">
          No equipment guides available.
        </li>
      )
    }

    return equipmentType.guides.map((guide) => (
      <EquipmentGuideCard
        key={guide.id}
        guide={guide}
      />
    ))
  }

  return (
    <section 
      onClick={() => setFlashMessage('')}
      className="flex flex-1 items-center justify-center bg-brand px-4 py-8"
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-body shadow-xl sm:p-10">
        <header className="mb-8">

        </header>

        <Link
          to="/dashboard/equipment"
          className="mb-6 inline-flex min-h-11 items-center gap-2 rounded text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <span aria-hidden="true">←</span>
          Manage Equipment
        </Link>

        <div className="mt-2 border-t border-field-border pt-6">
          <div className="flex flex-col gap-4">
            {error ? (
              <p role="alert">{error}</p>
            ) : equipmentType ? (
              <>
                {flashMessage && (
                  <p
                    role="status"
                    className="rounded-lg bg-success-bg p-3 text-sm text-success"
                  >
                    {flashMessage}
                  </p>
                )}
                                
                <h2 className="m-3 text-2xl font-bold text-center">{equipmentType.name}</h2>
                
                <h3 className="text-xl italic">{equipmentType.category?.trim() || 'Unknown category.'}</h3>
                
                <p>
                  {equipmentType.description?.trim() || 'No description available.'}
                </p>

                <div className="mt-2 border-t border-field-border pt-6">
                  <div className="flex flex-col gap-4">
                    <h2 className="mt-2 text-lg font-bold text-center">
                      Known problems
                    </h2>

                    <ul className="flex flex-col gap-2">
                      {renderKnownProblems()}
                    </ul>

                    <button
                      type="button"
                      onClick={() => {
                        setOpenForm((previous) => !previous)
                        setSuccessProblemMessage('')
                      }}
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

                      {openForm ? 'Cancel' : 'Add known problem'}
                    </button>

                    {openForm && (
                      <KnownProblemForm
                        onSuccess={() => {
                          setOpenForm(false)
                          setSuccessProblemMessage('Known problem created.')
                          setRefreshKey((previous) => previous + 1)
                        }}
                      />
                      )}
            
                    {successProblemMessage && (
                      <p
                        role="status"
                        className="rounded-lg bg-success-bg p-3 text-sm text-success"
                      >
                        {successProblemMessage}
                      </p>
                    )}

                  </div>
                </div>

                <div className="mt-2 border-t border-field-border pt-6">
                  <div className="flex flex-col gap-4">
                    <h2 className="mt-2 text-lg font-bold text-center">
                      Equipment units
                    </h2>

                    <ul className="flex flex-col gap-4">
                      {renderUnits()}
                    </ul>
                    
                    <div className="mt-4">
                      <Link
                        to={`/dashboard/equipment/${id}/units/new`}
                        className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        <span aria-hidden="true"><Box size={18} aria-hidden="true" /></span>
                        Add new equipment unit
                      </Link>
                    </div>

                  </div>
                </div>

                <div className="mt-2 border-t border-field-border pt-6">
                  <div className="flex flex-col gap-4">
                    <h2 className="mt-4 text-lg font-bold text-center">
                      Guides
                    </h2>

                    <ul className="flex flex-col gap-4">
                      {renderGuides()}
                    </ul>

                    <div className="mt-4">
                      <Link
                        to={`/dashboard/equipment/${id}/guides/new`}
                        className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        <span aria-hidden="true"><BookOpen size={18} aria-hidden="true"></BookOpen></span>
                        Add new equipment guide
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p>Loading equipment details...</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}