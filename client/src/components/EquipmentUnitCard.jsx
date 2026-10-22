import { useState } from 'react'
import { Flag, X, CalendarPlus, Box, ChevronDown } from 'lucide-react'
import ProblemListItem from './ProblemListItem.jsx'
import FaultReportForm from './FaultReportForm.jsx'
import LoanRequestForm from './LoanRequestForm.jsx'

export default function EquipmentUnitCard({ equipmentUnit, problems, onUpdated }) {
  const [openFaultForm, setOpenFaultForm] = useState(false)
  const [openLoanForm, setOpenLoanForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [successLoanMessage, setSuccessLoanMessage] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const conditionText =
    equipmentUnit.condition === 'IN_SERVICE'
      ? 'In service'
      : 'Out of service'

  const availabilityText =
    equipmentUnit.available
      ? 'Available'
      : 'Unavailable'

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
      <button
        type="button"
        onClick={() => setIsExpanded((previous) => !previous)}
        aria-expanded={isExpanded}
        aria-controls={`unit-details-${equipmentUnit.id}`}
        className="flex min-h-12 w-full flex-wrap items-center justify-between gap-2 rounded text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <span className="flex min-w-0 items-center gap-2 text-lg font-bold text-body">
          <Box size={18} className="shrink-0" aria-hidden="true" />
          <span className="break-words">
            {equipmentUnit.identifier}
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              equipmentUnit.available
                ? 'bg-success-bg text-success'
                : 'bg-danger-bg text-danger'
            }`}
          >
            {availabilityText}
          </span>

          <ChevronDown
            size={20}
            aria-hidden="true"
            className={`transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </span>
      </button>

      <div>
        <p className="text-sm font-medium text-muted">Location</p>
        <p>{equipmentUnit.location}</p>
      </div>

      <div
        id={`unit-details-${equipmentUnit.id}`}
        className={`mt-4 flex-col gap-3 ${
          isExpanded ? 'flex' : 'hidden'
        }`}
      >
        <div>
          <h3 className="text-sm font-medium text-muted">
            Condition
          </h3>

          <p>{conditionText}</p>
        </div>

        <div className="my-4 flex flex-col gap-3">
          {equipmentUnit.condition === 'OUT_OF_SERVICE' && (
            <p className="text-sm text-muted italic">
              Loan requests are unavailable while this unit is out of service.
            </p>
          )}

          <button
            type="button"
            disabled={equipmentUnit.condition === 'OUT_OF_SERVICE'}
            onClick={() => {
              setOpenLoanForm((previous) => !previous)
              setOpenFaultForm(false)
              setSuccessMessage('')
              setSuccessLoanMessage('')
            }}
            aria-expanded={openLoanForm}
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50 ${
              openLoanForm
                ? 'border-field-border bg-white text-body hover:bg-field'
                : 'border-brand bg-brand text-white hover:bg-brand-hover'
            }`}
          >
            {openLoanForm ? (
              <X size={18} aria-hidden="true" />
            ) : (
              <CalendarPlus size={18} aria-hidden="true" />
            )}

            {openLoanForm ? 'Cancel' : 'Request loan'}
          </button>
        </div>

        {openLoanForm && (
          <LoanRequestForm
            equipmentUnit={equipmentUnit}
            onSuccess={() => {
              setOpenLoanForm(false)
              setSuccessLoanMessage('Loan request successfully created.')
            }}
          />
          )}

        {successLoanMessage && (
          <p
            role="status"
            className="rounded-lg bg-success-bg p-3 text-sm text-success"
          >
            {successLoanMessage}
          </p>
        )}
        
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
              setOpenFaultForm((previous) => !previous)
              setOpenLoanForm(false)
              setSuccessLoanMessage('')
              setSuccessMessage('')
            }}
            aria-expanded={openFaultForm}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50 ${
              openFaultForm
                ? 'border-field-border bg-white text-body hover:bg-field'
                : 'border-brand bg-brand text-white hover:bg-brand-hover'
            }`}
          >
            {openFaultForm ? (
              <X size={18} aria-hidden="true" />
            ) : (
              <Flag size={18} aria-hidden="true" />
            )}

            {openFaultForm ? 'Cancel' : 'Report a fault'}
          </button>
        </div>

        {openFaultForm && (
          <FaultReportForm
            equipmentUnit={equipmentUnit}
            onSuccess={() => {
              setOpenFaultForm(false)
              setSuccessMessage('Fault report created.')
              onUpdated()
            }}
          />
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