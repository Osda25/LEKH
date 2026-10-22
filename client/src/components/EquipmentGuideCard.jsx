import { BookOpen } from 'lucide-react'

export default function EquipmentGuideCard({ guide }) {
  return (
    <li className="w-full p-2">
      <h2 className="flex items-center gap-2 text-lg font-bold text-body">
        <BookOpen size={18} className="shrink-0" aria-hidden="true"></BookOpen>
        {guide.title}
      </h2>

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
    </li>
  )
}