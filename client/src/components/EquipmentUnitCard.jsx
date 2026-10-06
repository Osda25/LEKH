export default function EquipmentUnitCard({ equipmentUnit }) {
  const conditionText =
    equipmentUnit.condition === 'IN_SERVICE'
      ? 'In service'
      : 'Out of service'

  const availabilityText =
    equipmentUnit.available
      ? 'Available'
      : 'Unavailable'

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
          <p className="text-sm font-medium text-muted">Location</p>
          <p>{equipmentUnit.location}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted">Condition</p>
          <p>{conditionText}</p>
        </div>
      </div>
    </li>
  )
}