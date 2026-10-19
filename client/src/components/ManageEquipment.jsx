import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { apiFetch } from "../services/api.js"
import Logo from './Logo.jsx'
import EquipmentCard from './EquipmentCard.jsx'

export default function ManageEquipment() {
  const [equipmentTypes, setEquipmentTypes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadEquipment() {
      try {
        const result = await apiFetch('/api/equipment/')
        setEquipmentTypes(result)
      } catch {
        setError('Equipment could not be loaded')
      } finally {
        setIsLoading(false)
      }
    }
    loadEquipment()
  },[])

  function renderEquipment() {
    if (isLoading) {
      return <li className="italic">Loading equipment...</li>;
    }

    if (error) {
      return <li className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</li>;
    }

    if (equipmentTypes.length === 0) {
      return <li className="">No equipment to show.</li>;
    }

    return equipmentTypes.map((equipmentType) => (
      <EquipmentCard
        key={equipmentType.id}
        equipmentType={equipmentType}
        basePath='/dashboard/equipment'
        linkText='Manage equipment →'
      />
    ));
  } 

  return (
    <section className="flex min-h-dvh items-center justify-center bg-brand px-4 py-8">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-body shadow-xl sm:p-10">
        <header className="mb-8">
          <Logo />

          <Link
            to="/dashboard"
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <span aria-hidden="true">←</span>
            Management dashboard
          </Link>

          <h1 className="mt-4 text-2xl font-bold text-center">
            Manage equipment
          </h1>
        </header>

        <div className="mt-4">
          <Link
            to="/dashboard/equipment/new"
            className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <span aria-hidden="true">+</span>
            Add new equipment type
          </Link>
        </div>

        <div className="mt-8 border-t border-field-border pt-6">
          <h2 className="text-lg font-bold text-center">
            Existing equipment types
          </h2>

          <p className="mt-2 text-sm text-muted text-center">
            Select an equipment type to manage its units, condition, known problems or report faults.
          </p>

          <ul className="mt-4 flex flex-col gap-4">
            {renderEquipment()}
          </ul>
        </div>
      </div>
    </section>
  )
}