import { BookOpen, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function EquipmentGuideCard({ guide }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <li className="w-full p-4 rounded-xl border border-field-border bg-field">
      <button
        type="button"
        onClick={() => setIsExpanded((previous) => !previous)}
        aria-expanded={isExpanded}
        aria-controls={`unit-details-${guide.id}`}
        className="flex min-h-12 w-full flex-wrap items-center justify-between gap-2 rounded text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <h2 className="flex items-center gap-2 text-lg font-bold text-body">
          <BookOpen size={18} className="shrink-0" aria-hidden="true"></BookOpen>
          {guide.title}
        </h2>
        <ChevronDown
            size={20}
            aria-hidden="true"
            className={`transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
      </button>

      <div
        id={`unit-details-${guide.id}`}
        className={`mt-4 flex-col gap-3 ${
          isExpanded ? 'flex' : 'hidden'
        }`}
      >
        <p className="mt-3 whitespace-pre-wrap text-body">
          {guide.content}
        </p>

        <h3 className="mt-6 text-base font-bold text-body">External source</h3>
        {guide.url && (
          <a
            href={guide.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center font-medium text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {guide.url}
            <span className="ml-1" aria-hidden="true"></span>
          </a>
        )}
      </div>
    </li>
  )
}