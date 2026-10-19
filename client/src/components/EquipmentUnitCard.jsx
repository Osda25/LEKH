import { useState } from 'react'
import { Flag, X } from 'lucide-react'
import FaultReportList from './FaultReportList.jsx'
import FaultReportForm from './FaultReportForm.jsx'

export default function EquipmentUnitCard({ equipmentUnit, onUpdated }) {
  const [openForm, setOpenForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const conditionText =
    equipmentUnit.condition === 'IN_SERVICE'
      ? 'In service'
      : 'Out of service'

  const availabilityText =
    equipmentUnit.available
      ? 'Available'
      : 'Unavailable'

  function renderFaultReports() {
    if (equipmentUnit.faultReports.length === 0) {
      return (
        <li className="text-sm italic text-muted">
          No faults reported.
        </li>
      )
    }

    return equipmentUnit.faultReports.map((fault) => (
      <FaultReportList
        key={fault.id}
        fault={fault}
      />
    ))
  }

  return (
    <li className="w-full rounded-xl border border-field-border bg-field p-4">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-bold text-body">
          {equipmentUnit.identifier}
        </h2>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${
            equipmentUnit.available
              ? 'bg-success-bg text-success'
              : 'bg-danger-bg text-danger'
          }`}
        >
          {availabilityText}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-medium text-muted">Location</h3>
          <p>{equipmentUnit.location}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted">
            Condition
          </h3>

          <p>{conditionText}</p>
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
              setOpenForm((previous) => !previous)
              setSuccessMessage('')
            }}
            aria-expanded={openForm}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50 ${
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

            {openForm ? 'Cancel' : 'Report a fault'}
          </button>
        </div>

        {openForm && (
          <FaultReportForm
            equipmentUnit={equipmentUnit}
            onSuccess={() => {
              setOpenForm(false)
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