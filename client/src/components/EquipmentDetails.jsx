import { Link, useParams, useLocation } from 'react-router'
import { useState, useEffect } from 'react'
import { apiFetch } from '../services/api'
import Logo from './Logo'
import EquipmentUnitCard from './EquipmentUnitCard'
import EquipmentGuideCard from './EquipmentGuideCard'

export default function EquipmentDetails() {
  const { id } = useParams()
  const location = useLocation()
  const [equipmentType, setEquipmentType] = useState()
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

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

  function renderUnits() {
    if (equipmentType.units.length === 0) {
      return <li className="mt-4 p-4 w-full rounded-xl border border-field-border bg-field">No equipment units to show.</li>;
    }

    return equipmentType.units.map((equipmentUnit) => (
      <EquipmentUnitCard
        key={equipmentUnit.id}
        equipmentUnit={equipmentUnit}
        problems={equipmentType.problems}
        onUpdated={() => setRefreshKey((previous) => previous + 1)}
      />
    ));
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

          <div className="mt-2 border-t border-field-border pt-6">
            <div className="flex flex-col gap-4">
              {error ? (
                <p role="alert">{error}</p>
              ) : equipmentType ? (
                <>
                  {location.state?.message && (
                    <p
                      role="status"
                      className="rounded-lg bg-success-bg p-3 text-sm text-success"
                    >
                      {location.state.message}
                    </p>
                  )}
                  <h2 className="m-3 text-2xl font-bold text-center">{equipmentType.name}</h2>
                  <h3 className="text-xl italic">{equipmentType.category?.trim() || 'Unknown category.'}</h3>
                  <p>
                    {equipmentType.description?.trim() || 'No description available.'}
                  </p>

                  <div className="mt-2 border-t border-field-border pt-6">
                    <div className="flex flex-col gap-4">
                      <h2 className="mt-4 text-lg font-bold text-center">
                        Equipment units
                      </h2>

                      <ul className="flex flex-col gap-4">
                        {renderUnits()}
                      </ul>
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