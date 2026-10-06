import { Link, useParams } from 'react-router'
import { useState, useEffect } from 'react'
import { apiFetch } from '../services/api'
import Logo from './Logo'

export default function EquipmentDetails() {
  const { id } = useParams()
  const [equipmentType, setEquipmentType] = useState()
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadEquipmentType() {
      setError('')
      setEquipmentType(undefined)
      try {
        const result = await apiFetch(`/api/equipment/${id}`)
        setEquipmentType(result)
      } catch (error) {
        setError(
          error.status
            ? error.message
            : 'Equipment details could not be loaded. Please try again.'
        )
      }
    }
    loadEquipmentType()
  }, [id])

  return (
      <section className="flex min-h-dvh items-center justify-center bg-brand px-4 py-8">
        <div className="w-full max-w-md rounded-3xl bg-white p-6 text-body shadow-xl sm:p-10">
          <header className="mb-8">
            <Logo />

          </header>

          <Link
            to="/equipment"
            className="mb-6 inline-flex min-h-11 items-center gap-2 rounded text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <span aria-hidden="true">←</span>
            Equipment
          </Link>

          <div className="flex flex-col gap-4">
            {error ? (
              <p role="alert">{error}</p>
            ) : equipmentType ? (
              <div className="p-4 w-full rounded-xl border border-field-border bg-field">
                <h1 className=" m-3 text-xl font-bold text-center">{equipmentType.name}</h1>
                <p>
                  {equipmentType.description?.trim() || 'No description available.'}
                </p>
              </div>
            ) : (
              <p>Loading equipment details...</p>
            )}
          </div>
        </div>
      </section>
    )
}