import { Link } from "react-router"

export default function EquipmentCard({ equipmentType }) {
  const availabilityText =
    equipmentType.available
      ? 'Available'
      : 'Unavailable'

  return (
    <li className="mt-4 w-full rounded-xl border border-field-border bg-field">
      <Link
        to={`/equipment/${equipmentType.id}`}
        className="block rounded-3xl p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <h2 className="text-xl font-bold text-center">{equipmentType.name}</h2>

        <p className="mt-2">{equipmentType.description}</p>

        <div className="flex items-start justify-between gap-4 mt-4">
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${
              equipmentType.available
                ? 'bg-success-bg text-success'
                : 'bg-danger-bg text-danger'
            }`}
          >
            {availabilityText}
          </span>

          <span className="block text-right font-bold">
            View details
          </span>
        </div>
      </Link>
    </li>
  )
}