import { Link } from "react-router"

export default function EquipmentCard({ equipmentType }) {
  return (
    <li className="mt-4 w-full rounded-xl border border-field-border bg-field">
      <Link
        to={`/equipment/${equipmentType.id}`}
        className="block rounded-3xl p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <h2 className="text-xl font-bold text-center">{equipmentType.name}</h2>

        <p className="mt-2">{equipmentType.description}</p>

        <span className="mt-4 block text-right font-bold">
          View details
        </span>
      </Link>
    </li>
  )
}