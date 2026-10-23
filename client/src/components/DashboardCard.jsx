
import { Link } from 'react-router'

export default function DashboardCard({
  title,
  description,
  icon: Icon,
  to,
  badgeCount,
  badgeLabel = 'new'
}) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <Icon
          size={24}
          strokeWidth={1.8}
          className="text-brand"
          aria-hidden="true"
        />

        {badgeCount > 0 && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            {badgeCount} {badgeLabel}
          </span>
        )}
      </div>

      <h2 className="font-bold text-body">
        {title}
      </h2>

      <p className="text-sm text-muted">
        {description}
      </p>
    </>
  )

  const classes =
    'flex h-full flex-col gap-2 rounded-xl border border-field-border bg-field p-4'

  if (!to) {
    return (
      <div className={`${classes} opacity-60`}>
        {content}
        <span className="mt-auto pt-2 text-xs text-muted">
          Coming soon
        </span>
      </div>
    )
  }

  return (
    <Link
      to={to}
      className={`${classes} transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`}
    >
      {content}
    </Link>
  )
}
