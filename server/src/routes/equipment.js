import 'dotenv/config'
import express from 'express'
import prisma from '../prisma.js'
import requireAuth from '../middleware/requireAuth.js'

const router = express.Router()

router.get('/', requireAuth, async (request, response) => {
  try {
    const equipmentTypes = await prisma.equipmentType.findMany({
      orderBy: {
        name: 'asc'
      },
      select: {
        id: true,
        name: true,
        description: true,
        units: {
          select: {
            condition: true
          }
        }
      }
    })

    const result = equipmentTypes.map((type) => {
      let availableType = false

      for (const unit of type.units) {
        if (unit.condition === 'IN_SERVICE') {
          availableType = true
        }
      }

      return {
        id: type.id,
        name: type.name,
        description: type.description,
        available: availableType
      }
    })

    return response.status(200).json(result)
  } catch {
    return response.status(500).json({
      error: 'Equipment could not be retrieved.'
    })
  }
})

router.get('/:id', requireAuth, async (request, response) => {
  const id = Number(request.params.id)

  if (!Number.isSafeInteger(id) || id <= 0) {
    return response.status(400).json({
      error: 'Invalid equipment type ID.'
    })
  }

  try {
    const equipmentType = await prisma.equipmentType.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        units: {
          select: {
            id: true,
            identifier: true,
            location: true,
            condition: true
          }
        },
        guides: {
          select: {
            id: true,
            title: true,
            content: true,
            url: true
          }
        }
      }
    })

    if (!equipmentType) {
      return response.status(404).json({
        error: 'Equipment type not found.'
      })
    }

    let availableType = false

    for (const unit of equipmentType.units) {
      if (unit.condition === 'IN_SERVICE') {
        unit.available = true
        availableType = true
      } else {
        unit.available = false
      }
    }

    equipmentType.available = availableType

    return response.status(200).json(equipmentType)
  } catch {
    return response.status(500).json({
      error: 'Equipment type could not be retrieved.'
    })
  }
})

export default router