export default function EquipmentGuideCard({ guide }) {
  return (
    <li className="w-full p-2">
      <h2 className="text-lg font-bold text-body">
        - {guide.title}
      </h2>

      <p className="mt-3 whitespace-pre-wrap text-body">
        {guide.content}
      </p>

      {guide.url && (
        <a
          href={guide.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-11 items-center font-medium text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Read more
          <span className="ml-1" aria-hidden="true"></span>
        </a>
      )}
    </li>
  )
}