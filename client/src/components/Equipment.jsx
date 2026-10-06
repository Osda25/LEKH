import { useState, useEffect } from 'react'
import { apiFetch } from "../services/api.js"
import Logo from './Logo.jsx'
import EquipmentCard from './EquipmentCard.jsx'

export default function Equipment() {
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
      />
    ));
  } 

  return (
    <section className="flex min-h-dvh items-center justify-center bg-brand px-4 py-8">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-body shadow-xl sm:p-10">
        <header className="mb-8">
          <Logo />

          <h1 className="mt-4 text-2xl font-bold text-center">
            Equipment
          </h1>
        </header>
          <ul className="flex flex-col gap-4">{renderEquipment()}</ul>
      </div>
    </section>
  )
}