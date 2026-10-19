import { useState } from 'react'

export default function ProblemListItem({ item }) {
  const [expanded, setExpanded] = useState(false)

  const formattedDate = new Date(item.createdAt).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })

  return (
    <li className="min-w-0 rounded-lg border border-field-border bg-white p-3">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-body">
          {item.title}
        </h3>

        <p className="text-xs text-muted">
          {formattedDate}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((previous) => !previous)}
        aria-expanded={expanded}
        className="mt-3 block w-full min-w-0 cursor-pointer rounded text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <span
          className={`block text-sm text-muted ${
            expanded
              ? 'whitespace-pre-wrap break-words'
              : 'truncate'
          }`}
        >
          {item.description}
        </span>

        <span className="mt-2 block text-xs font-semibold text-brand hover:underline">
          {expanded ? 'Show less ↑' : 'Show more ↓'}
        </span>
      </button>
    </li>
  )
}
