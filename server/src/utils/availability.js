export function isUnitAvailable(unit, today) {
  if (unit.condition !== 'IN_SERVICE') {
    return false
  }

  const hasBlockingLoan = unit.loans.some((loan) => {
    if (loan.status === 'APPROVED') {
      const startDate = loan.startDate.toISOString().slice(0, 10)
      const endDate = loan.endDate.toISOString().slice(0, 10)

      return startDate <= today && endDate >= today
    }

    return true
  })

  return !hasBlockingLoan
}