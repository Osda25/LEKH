import { Link } from "react-router"

export default function EquipmentCard({ equipmentType, basePath = '/equipment', linkText = 'View details →' }) {
  const availabilityText =
    equipmentType.available
      ? 'Available'
      : 'Unavailable'

  return (
    <li className="w-full rounded-xl border border-field-border bg-field">
      <Link
        to={`${basePath}/${equipmentType.id}`}
        className="block rounded-3xl p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <h2 className="min-h-12 line-clamp-2 text-center text-xl font-bold leading-6">{equipmentType.name}</h2>

        <h3 className="mt-2 text-lg italic">{equipmentType.category?.trim() || 'Unknown category'}</h3>

        <p className="mt-2 min-h-[4.5rem] line-clamp-3 leading-6">{equipmentType.description}</p>

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
            {linkText}
          </span>
        </div>
      </Link>
    </li>
  )
}