
export default function LoanHistory({ loans, isLoading, error }) {
  function formatDate(date, timeZone = 'UTC') {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone
    }).format(new Date(date))
  }

  function renderHistory() {
    if (isLoading) {
      return (
        <li className="text-sm italic text-muted">
          Loading borrowing history...
        </li>
      )
    }

    if (error) {
      return (
        <li
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-800"
        >
          {error}
        </li>
      )
    }

    if (loans.length === 0) {
      return (
        <li className="text-sm italic text-muted">
          No borrowing history available.
        </li>
      )
    }

    return loans.map((loan) => (
      <li
        key={loan.id}
        className="rounded-lg border border-field-border bg-white p-3"
      >
        <p className="font-semibold text-body">
          {loan.user.name}
        </p>

        <p className="break-words text-sm text-muted">
          {loan.user.email}
        </p>

        <div className="mt-3 flex flex-col gap-2 text-sm">
          <div>
            <p className="font-medium text-muted">
              Loan period
            </p>
            <p>
              {formatDate(loan.startDate)} – {formatDate(loan.endDate)}
            </p>
          </div>

          <div>
            <p className="font-medium text-muted">
              Returned on
            </p>
            <p>
              {loan.returnedAt
                ? formatDate(loan.returnedAt, 'Europe/Stockholm')
                : 'Not recorded'}
            </p>
          </div>
        </div>
      </li>
    ))
  }

  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-muted">
        Borrowing history
      </h3>

      <ul className="flex flex-col gap-2">
        {renderHistory()}
      </ul>
    </div>
  )
}
