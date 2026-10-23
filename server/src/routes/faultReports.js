import express from 'express'
import prisma from '../prisma.js'
import requireAuth from '../middleware/requireAuth.js'
import requireRole from '../middleware/requireRole.js'

const router = express.Router()


router.get('/', requireAuth, requireRole('CARETAKER', 'ADMIN'), async (request, response) => {
  try {
    const faultReports = await prisma.faultReport.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        description: true,
        reviewNote: true,
        status: true,
        createdAt: true,
        reviewedAt: true,
        reportedBy: {
          select: {
            name: true,
            email: true
          }
        },
        equipmentUnit: {
          select: {
            id: true,
            identifier: true,
            location: true,
            condition: true,
            equipmentType: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    return response.status(200).json(faultReports)
  } catch (error) {
    console.error('Failed to load fault reports:', {
      name: error.name,
      code: error.code,
      message: error.message
    })

    return response.status(500).json({
      error: 'Fault reports could not be retrieved.'
    })
  }
})

router.patch('/:id/review', requireAuth, requireRole('CARETAKER', 'ADMIN'), async (request, response) => {
  const faultReportId = Number(request.params.id)
  const { reviewNote } = request.body ?? {}

  if (!Number.isSafeInteger(faultReportId) || faultReportId <= 0) {
    return response.status(400).json({
      error: 'Not a valid fault report ID.'
    })
  }

  if (
    reviewNote != null &&
    typeof reviewNote !== 'string'
  ) {
    return response.status(400).json({
      error: 'Review note must be provided as text.'
    })
  }

  const normalizedReviewNote =
    typeof reviewNote === 'string' ? reviewNote.trim() : null

  try {
    const faultReport = await prisma.faultReport.findUnique({
      where: {
        id: faultReportId
      },
      select: {
        status: true
      }
    })

    if (!faultReport) {
      return response.status(404).json({
        error: 'Fault report not found.'
      })
    }

    if (faultReport.status !== 'OPEN') {
      return response.status(409).json({
        error: 'Only open fault reports can be marked as reviewed.'
      })
    }

    const updatedReport = await prisma.faultReport.update({
      where: {
        id: faultReportId,
        status: 'OPEN'
      },
      data: {
        status: 'REVIEWED',
        reviewedAt: new Date(),
        reviewNote: normalizedReviewNote || null
      },
      select: {
        id: true,
        status: true,
        reviewedAt: true,
        reviewNote: true
      }
    })

    return response.status(200).json({
      message: 'Fault report successfully marked as reviewed.',
      data: updatedReport
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return response.status(409).json({
        error: 'Fault report could not be reviewed because its status has changed.'
      })
    }

    console.error('Fault report update failed:', {
      name: error.name,
      code: error.code,
      message: error.message
    })

    return response.status(500).json({
      error: 'Fault report could not be updated.'
    })
  }
})

export default router