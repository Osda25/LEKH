import 'dotenv/config'
import express from 'express'
import prisma from '../prisma.js'
import requireAuth from '../middleware/requireAuth.js'
import { parseDate } from '../utils/date.js'

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

export default router