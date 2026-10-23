import 'dotenv/config'
import express from 'express'
import prisma from '../prisma.js'
import requireAuth from '../middleware/requireAuth.js'
import { parseDate } from '../utils/date.js'
import requireRole from '../middleware/requireRole.js'

const router = express.Router()

router.post('/', requireAuth, async (request, response) => {
  if (!request.body) {
    return response.status(400).json({
      error: 'Request body is required.'
    })
  }

  const { equipmentUnitId, startDate, endDate } = request.body

  const userId = Number(request.auth.userId)

  if (
    !Number.isSafeInteger(equipmentUnitId) || 
    !Number.isSafeInteger(userId) ||
    equipmentUnitId <= 0 ||
    userId <= 0
  ) {
    return response.status(400).json({
      error: 'Not a valid equipment unit or user ID.'
    })
  }

  if (
    typeof startDate !== 'string' ||
    typeof endDate !== 'string'
  ) {
    return response.status(400).json({
      error: 'Start date and end date must be provided as text.'
    })
  }

  const normalizedStartDate = startDate.trim()
  const normalizedEndDate = endDate.trim()

  if (
    !normalizedStartDate ||
    !normalizedEndDate
  ) {
    return response.status(400).json({
      error: 'Start date and end date are required.'
    })
  }

  const parsedStartDate = parseDate(normalizedStartDate)
  const parsedEndDate = parseDate(normalizedEndDate)

  if (!parsedStartDate || !parsedEndDate) {
    return response.status(400).json({
      error: 'Invalid format or nonexisting date. Use YYYY-MM-DD and make sure the date exists.'
    })
  }

  if (parsedEndDate < parsedStartDate) {
    return response.status(400).json({
      error: 'End date cannot be before start date.'
    })
  }

  const maxLoanDays = 14

  const loanDays =
    Math.round(
      (parsedEndDate - parsedStartDate) / (1000 * 60 * 60 * 24)
    ) + 1

  if (loanDays > maxLoanDays) {
    return response.status(400).json({
      error: `Loan period cannot exceed ${maxLoanDays} days.`
    })
  }

  const today = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Stockholm',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date())

  if (normalizedStartDate < today) {
    return response.status(400).json({
      error: 'Start date cannot be in the past.'
    })
  }

  try {
    const equipmentUnit = await prisma.equipmentUnit.findUnique({
      where: {
        id: equipmentUnitId,
      },
      select: {
        id: true,
        condition: true
      }
    })

    if (!equipmentUnit) {
      return response.status(404).json({
        error: 'Equipment unit not found.'
      })
    }

    if (equipmentUnit.condition !== 'IN_SERVICE') {
      return response.status(409).json({
        error: 'This equipment unit is currently out of service.'
      })
    }

    const conflictingLoanDates = await prisma.loan.findFirst({
      where: {
        equipmentUnitId,
        status: {
          in: ['APPROVED', 'ACTIVE', 'RETURN_REQUESTED']
        },
        startDate: {
          lte: parsedEndDate
        },
        endDate: {
          gte: parsedStartDate
        }
      },
      select: {
        id: true
      }
    })

    if (conflictingLoanDates !== null) {
      return response.status(409).json({
        error: 'This equipment unit already have a reservation in the selected period.'
      })
    }

    const loan = await prisma.loan.create({
      data: {
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        equipmentUnitId,
        userId
      },
      select: {
        id: true,
        status: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        equipmentUnitId: true,
        userId: true
      }
    })

    return response.status(201).json({
      message: 'Loan request successfully created.',
      data: loan
    })
  } catch (error) {
    console.error('Loan request failed:', {
      name: error.name,
      code: error.code,
      message: error.message
    })

    return response.status(500).json({
      error: 'Loan request could not be created.'
    })
  }
})

router.get('/', requireAuth, requireRole('CARETAKER', 'ADMIN'), async (request, response) => {
  try {
    const loans = await prisma.loan.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        status: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        approvedAt: true,
        checkedOutAt: true,
        returnedAt: true,
        equipmentUnitId: true,
        userId: true,
        user: {
          select: {
            name: true,
            email: true
          }
        },
        equipmentUnit: {
          select: {
            identifier: true,
            location: true,
            equipmentType: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return response.status(200).json(loans)
  } catch (error) {
    console.error('Failed to load loans: ', {
      name: error.name,
      code: error.code,
      message: error.message
    })

    return response.status(500).json({
      error: 'Loans could not be retrieved.'
    })
  }
})


router.get('/my', requireAuth, async (request, response) => {
  const userId = Number(request.auth.userId)

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    return response.status(401).json({
      error: 'Invalid user authentication.'
    })
  }

  const today = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Stockholm',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date())

  try {
    const loans = await prisma.loan.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        status: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        checkedOutAt: true,
        returnedAt: true,
        equipmentUnit: {
          select: {
            identifier: true,
            location: true,
            condition: true,
            equipmentType: {
              select: {
                name: true
              }
            },
            loans: {
              where: {
                status: {
                  in: ['ACTIVE', 'RETURN_REQUESTED']
                }
              },
              select: {
                id: true
              }
            }
          }
        }
      }
    })

    const result = loans.map((loan) => {
      const startDate = loan.startDate.toISOString().slice(0, 10)
      const endDate = loan.endDate.toISOString().slice(0, 10)

      const isOverdue =
        ['ACTIVE', 'RETURN_REQUESTED'].includes(loan.status) &&
        endDate < today

      const { loans: blockingLoans, ...equipmentUnit } = loan.equipmentUnit

      let pickupStatus = null

      if (loan.status === 'APPROVED') {
        if (endDate < today) {
          pickupStatus = 'PERIOD_PASSED'
        } else if (startDate > today) {
          pickupStatus = 'SCHEDULED'
        } else if (
          equipmentUnit.condition !== 'IN_SERVICE' ||
          blockingLoans.length > 0
        ) {
          pickupStatus = 'NOT_READY'
        } else {
          pickupStatus = 'READY'
        }
      }

      return {
        ...loan,
        equipmentUnit,
        pickupStatus,
        isOverdue
      }
    })

    return response.status(200).json(result)
  } catch (error) {
    console.error('Failed to load user loans:', {
      name: error.name,
      code: error.code,
      message: error.message
    })

    return response.status(500).json({
      error: 'User loans could not be retrieved.'
    })
  }
})


router.get('/booked-periods/:unitId', requireAuth, async (request, response) => {
  const equipmentUnitId = Number(request.params.unitId)

  if (
    !Number.isSafeInteger(equipmentUnitId) || 
    equipmentUnitId <= 0
  ) {
    return response.status(400).json({
      error: 'Not a valid unit ID.'
    })
  }

  try {
    const equipmentUnit = await prisma.equipmentUnit.findUnique({
      where: {
        id: equipmentUnitId
      },
      select: {
        id: true,
        loans: {
          where: {
            status: {
              in: ['APPROVED', 'ACTIVE', 'RETURN_REQUESTED']
            }
          },
          orderBy: {
            startDate: 'asc'
          },
          select: {
            status: true,
            startDate: true,
            endDate: true
          }
        }
      }
    })

    if (!equipmentUnit) {
      return response.status(404).json({
        error: 'Equipment unit not found.'
      })
    }

    const today = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Europe/Stockholm',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date())

    let hasOverdueLoan = false

    const bookedPeriods = equipmentUnit.loans.map((loan) => {
      const startDate = loan.startDate.toISOString().slice(0, 10)
      const endDate = loan.endDate.toISOString().slice(0, 10)

      if (
        loan.status !== 'APPROVED' &&
        endDate < today
      ) {
        hasOverdueLoan = true
      }

      return {
        startDate,
        endDate
      }
    })

    return response.status(200).json({
      bookedPeriods, 
      hasOverdueLoan
    })
  } catch (error) {
    console.error('Failed to load booking periods:', {
      name: error.name,
      code: error.code,
      message: error.message
    })

    return response.status(500).json({
      error: 'Booking periods could not be retrieved.'
    })
  } 
})

router.patch('/:id/approve', requireAuth, requireRole('CARETAKER', 'ADMIN'), async (request, response) => {
  const loanId = Number(request.params.id)

  if (
    !Number.isSafeInteger(loanId) ||
    loanId <= 0
  ) {
    return response.status(400).json({
      error: 'Not a valid loan ID.'
    })
  }

  const maxAttempts = 3

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const loanRequest = await tx.loan.findUnique({
          where: {
            id: loanId
          },
          select: {
            status: true,
            startDate: true,
            endDate: true,
            equipmentUnitId: true,
            equipmentUnit: {
              select: {
                condition: true
              }
            }
          }
        })

        if (!loanRequest) {
          return {
            httpStatus: 404,
            error: 'Loan request not found.'
          }
        }

        if (loanRequest.equipmentUnit.condition !== 'IN_SERVICE') {
          return {
            httpStatus: 409,
            error: 'This equipment unit is currently out of service.'
          }
        }

        if (loanRequest.status !== 'PENDING') {
          return {
            httpStatus: 409,
            error: 'Only pending loan requests can be approved.'
          }
        }

        const today = new Intl.DateTimeFormat('sv-SE', {
          timeZone: 'Europe/Stockholm',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(new Date())

        const endDate = loanRequest.endDate.toISOString().slice(0, 10)

        if (endDate < today) {
          return {
            httpStatus: 409,
            error: 'This loan request cannot be approved because the requested period has expired.'
          }
        }

        const conflictingLoanDates = await tx.loan.findFirst({
          where: {
            equipmentUnitId: loanRequest.equipmentUnitId,
            status: {
              in: ['APPROVED', 'ACTIVE', 'RETURN_REQUESTED']
            },
            startDate: {
              lte: loanRequest.endDate
            },
            endDate: {
              gte: loanRequest.startDate
            }
          },
          select: {
            id: true
          }
        })

        if (conflictingLoanDates) {
          return {
            httpStatus: 409,
            error: 'This equipment unit is already booked for the selected period.'
          }
        }

        const updatedLoan = await tx.loan.update({
          where: {
            id: loanId
          },
          data: {
            status: 'APPROVED',
            approvedAt: new Date()
          },
          select: {
            id: true,
            status: true,
            approvedAt: true
          }
        })

        return {
          httpStatus: 200,
          data: updatedLoan
        }
      }, {
        isolationLevel: 'Serializable'
      })

      if (result.error) {
        return response.status(result.httpStatus).json({
          error: result.error
        })
      }

      return response.status(200).json({
        message: 'Loan request successfully approved.',
        data: result.data
      })
    } catch (error) {
      if (error.code === 'P2034' && attempt < maxAttempts) {
        continue
      }

      if (error.code === 'P2034') {
        return response.status(409).json({
          error: 'Loan approval conflicted with another update. Please try again.'
        })
      }

      if (error.code === 'P2025') {
        return response.status(404).json({
          error: 'Loan request not found.'
        })
      }

      console.error('Loan approval failed:', {
        name: error.name,
        code: error.code,
        message: error.message
      })

      return response.status(500).json({
        error: 'Loan request could not be approved.'
      })
    }
  }
})

router.patch('/:id/reject', requireAuth, requireRole('CARETAKER', 'ADMIN'), async (request, response) => {
  const loanId = Number(request.params.id)

  if (
    !Number.isSafeInteger(loanId) ||
    loanId <= 0
  ) {
    return response.status(400).json({
      error: 'Not a valid loan ID.'
    })
  }

  try {
    const loanRequest = await prisma.loan.findUnique({
      where: {
        id: loanId
      },
      select: {
        status: true
      }
    })

    if (!loanRequest) {
      return response.status(404).json({
        error: 'Loan request not found.'
      })
    }

    if (loanRequest.status !== 'PENDING') {
      return response.status(409).json({
        error: 'Only pending loan requests can be rejected.'
      })
    }

    const updatedLoan = await prisma.loan.update({
      where: {
        id: loanId,
        status: 'PENDING'
      },
      data: {
        status: 'REJECTED',
      },
      select: {
        id: true,
        status: true,
      }
    })
    
    return response.status(200).json({
      message: 'Loan request successfully rejected.',
      data: updatedLoan
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return response.status(404).json({
        error: 'Loan request could not be rejected because its status has changed.'
      })
    }

    console.error('Loan status update failed:', {
      name: error.name,
      code: error.code,
      message: error.message
    })

    return response.status(500).json({
      error: 'Loan status could not be updated.'
    })
  }
})


router.patch('/:id/checkout', requireAuth, requireRole('CARETAKER', 'ADMIN'), async (request, response) => {
  const loanId = Number(request.params.id)

  if (
    !Number.isSafeInteger(loanId) ||
    loanId <= 0
  ) {
    return response.status(400).json({
      error: 'Not a valid loan ID.'
    })
  }

  try {
    const loanRequest = await prisma.loan.findUnique({
      where: {
        id: loanId
      },
      select: {
        status: true,
        startDate: true,
        endDate: true,
        equipmentUnitId: true,
        equipmentUnit: {
          select: {
            condition: true
          }
        }
      }
    })

    if (!loanRequest) {
      return response.status(404).json({
        error: 'Loan request not found.'
      })
    }

    if (['ACTIVE', 'RETURN_REQUESTED', 'RETURNED'].includes(loanRequest.status)) {
      return response.status(409).json({
        error: 'This loan has already been checked out and cannot be checked out again.'
      })
    }

    if (loanRequest.status !== 'APPROVED') {
      return response.status(409).json({
        error: 'Only approved loan requests can be activated.'
      })
    }

    if (loanRequest.equipmentUnit.condition !== 'IN_SERVICE') {
      return response.status(409).json({
        error: 'This equipment unit is currently out of service.'
      })
    }

    const today = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Europe/Stockholm',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date())

    const startDate = loanRequest.startDate.toISOString().slice(0, 10)
    const endDate = loanRequest.endDate.toISOString().slice(0, 10)

    if (today < startDate || today > endDate) {
      return response.status(409).json({
        error: 'Equipment can only be checked out during the approved loan period.'
      })
    }

    const existingLoan = await prisma.loan.findFirst({
      where: {
        equipmentUnitId: loanRequest.equipmentUnitId,
        status: {
          in: ['ACTIVE', 'RETURN_REQUESTED']
        }
      },
      select: {
        id: true
      }
    })

    if (existingLoan) {
      return response.status(409).json({
        error: 'This equipment unit has not yet been returned from a previous loan.'
      })
    }

    const updatedLoan = await prisma.loan.update({
      where: {
        id: loanId,
        status: 'APPROVED'
      },
      data: {
        status: 'ACTIVE',
        checkedOutAt: new Date()
      },
      select: {
        id: true,
        status: true,
        checkedOutAt: true
      }
    })

    return response.status(200).json({
      message: 'Equipment checkout successfully registered.',
      data: updatedLoan
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return response.status(409).json({
        error: 'Loan could not be activated because its status has changed.'
      })
    }

    console.error('Loan checkout failed:', {
      name: error.name,
      code: error.code,
      message: error.message
    })

    return response.status(500).json({
      error: 'Equipment checkout could not be registered.'
    })
  }
})


router.patch('/:id/return', requireAuth, requireRole('CARETAKER', 'ADMIN'), async (request, response) => {
  const loanId = Number(request.params.id)

  if (
    !Number.isSafeInteger(loanId) ||
    loanId <= 0
  ) {
    return response.status(400).json({
      error: 'Not a valid loan ID.'
    })
  }

  try {
    const loanRequest = await prisma.loan.findUnique({
      where: {
        id: loanId
      },
      select: {
        status: true
      }
    })

    if (!loanRequest) {
      return response.status(404).json({
        error: 'Loan request not found.'
      })
    }

    if (loanRequest.status === 'RETURNED') {
      return response.status(409).json({
        error: 'This loan has already been returned.'
      })
    }

    if (!['ACTIVE', 'RETURN_REQUESTED'].includes(loanRequest.status)) {
      return response.status(409).json({
        error: 'Only checked out loans can be registered as returned.'
      })
    }

    const updatedLoan = await prisma.loan.update({
      where: {
        id: loanId,
        status: {
          in: ['ACTIVE', 'RETURN_REQUESTED']
        }
      },
      data: {
        status: 'RETURNED',
        returnedAt: new Date()
      },
      select: {
        id: true,
        status: true,
        returnedAt: true
      }
    })

    return response.status(200).json({
      message: 'Equipment return successfully registered.',
      data: updatedLoan
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return response.status(409).json({
        error: 'Loan could not be returned because its status has changed.'
      })
    }

    console.error('Loan return failed:', {
      name: error.name,
      code: error.code,
      message: error.message
    })

    return response.status(500).json({
      error: 'Equipment return could not be registered.'
    })
  }
})


router.patch('/:id/request-return', requireAuth, async (request, response) => {
  const loanId = Number(request.params.id)
  const userId = Number(request.auth.userId)

  if (
    !Number.isSafeInteger(loanId) ||
    loanId <= 0
  ) {
    return response.status(400).json({
      error: 'Not a valid loan ID.'
    })
  }

  if (
    !Number.isSafeInteger(userId) ||
    userId <= 0
  ) {
    return response.status(401).json({
      error: 'Invalid user authentication.'
    })
  }

  try {
    const loanRequest = await prisma.loan.findUnique({
      where: {
        id: loanId
      },
      select: {
        userId: true,
        status: true
      }
    })

    if (!loanRequest || loanRequest.userId !== userId) {
      return response.status(404).json({
        error: 'Loan not found.'
      })
    }

    if (loanRequest.status !== 'ACTIVE') {
      return response.status(409).json({
        error: 'Only active loans can request return confirmation.'
      })
    }

    const updatedLoan = await prisma.loan.update({
      where: {
        id: loanId,
        userId,
        status: 'ACTIVE'
      },
      data: {
        status: 'RETURN_REQUESTED'
      },
      select: {
        id: true,
        status: true
      }
    })

    return response.status(200).json({
      message: 'Equipment return confirmation successfully requested.',
      data: updatedLoan
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return response.status(409).json({
        error: 'Return confirmation could not be requested because the loan status has changed.'
      })
    }

    console.error('Loan return request failed:', {
      name: error.name,
      code: error.code,
      message: error.message
    })

    return response.status(500).json({
      error: 'Equipment return confirmation could not be requested.'
    })
  }
})


export default router