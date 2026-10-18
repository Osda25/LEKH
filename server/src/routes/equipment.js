import 'dotenv/config'
import express from 'express'
import prisma from '../prisma.js'
import crypto from 'node:crypto'
import requireAuth from '../middleware/requireAuth.js'
import requireRole from '../middleware/requireRole.js'
import equipmentCategories from '../constants/equipmentCategory.js'
import { UnitCondition } from '../generated/prisma/enums.ts'

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
        category: true,
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
        category: type.category,
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

router.get('/categories', requireAuth, (request, response) => {
  return response.status(200).json(equipmentCategories)
})

router.get('/conditions', requireAuth, (request, response) => {
  return response.status(200).json(Object.values(UnitCondition))
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
        category: true,
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
        error: 'Equipment type ID not found.'
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

router.post('/', requireAuth, requireRole('CARETAKER', 'ADMIN'), async (request, response) => {
  if (!request.body) {
    return response.status(400).json({
      error: 'Request body is required.'
    })
  }

  const { name, category, code, description } = request.body

  if (
    typeof name !== 'string' ||
    typeof category !== 'string' ||
    typeof code !== 'string' ||
    (description !== undefined && typeof description !== 'string')
  ) {
    return response.status(400).json({
      error: 'Name, category, code and description must be provided as text.'
    })
  }

  const normalizedName = name.trim()
  const normalizedCategory = category.trim()
  const normalizedCode = code.trim().toUpperCase()
  let normalizedDescription

  if (description !== undefined) {
    normalizedDescription = description.trim()
  }

  if (
    !normalizedName ||
    !normalizedCategory ||
    !normalizedCode
  ) {
    return response.status(400).json({
      error: 'Name, category and code are required.'
    })
  }

  const codePattern = /^[A-Z]{3}$/

  if (!codePattern.test(normalizedCode)) {
    return response.status(400).json({
      error: 'Code must contain exactly three letters.'
    })
  }

  if (!equipmentCategories.includes(normalizedCategory)) {
    return response.status(400).json({
      error: 'Enter a valid category.'
    })
  }

  try {
    const equipmentType = await prisma.equipmentType.create({
      data: {
        name: normalizedName,
        category: normalizedCategory,
        code: normalizedCode,
        description: normalizedDescription
      },
      select: {
        id: true,
        name: true,
        category: true,
        code: true,
        description: true
      }
    })

    return response.status(201).json({
      message: 'Equipment type successfully created.',
      data: equipmentType
    })
  } catch (error) {
    if (error.code === 'P2002') {
      return response.status(409).json({
        error: 'An equipment type with this name or code already exists.'
      })
    }

    console.error('Equipment type creation failed:', {
      name: error.name,
      code: error.code
    })

    return response.status(500).json({
      error: 'Equipment type could not be created.'
    })
  }
})

router.post('/:id/units', requireAuth, requireRole('CARETAKER', 'ADMIN'), async (request, response) => {
  if (!request.body) {
    return response.status(400).json({
      error: 'Request body is required.'
    })
  }

  const equipmentTypeId = Number(request.params.id)

  if (!Number.isSafeInteger(equipmentTypeId) || equipmentTypeId <= 0) {
    return response.status(400).json({
      error: 'Not a valid ID'
    })
  }

  const { location, condition } = request.body

  if (
    typeof location !== 'string' ||
    typeof condition !== 'string'
  ) {
    return response.status(400).json({
      error: 'Location and condition must be provided as text.'
    })
  }

  const normalizedLocation = location.trim()
  const normalizedCondition = condition.trim()

  if (
    !normalizedLocation ||
    !normalizedCondition
  ) {
    return response.status(400).json({
      error: 'Location and condition are required.'
    })
  }

  if (!Object.values(UnitCondition).includes(normalizedCondition)) {
    return response.status(400).json({
      error: 'Enter a valid condition.'
    })
  }

  try {
    const equipmentType = await prisma.equipmentType.findUnique({
      where: {
        id: equipmentTypeId
      },
      select: {
        code: true
      }
    })

    if (equipmentType === null) {
      return response.status(404).json({
        error: 'Equipment type not found.'
      })
    }

    const equipmentUnit = await prisma.$transaction(async (tx) => {
      const newUnit = await tx.equipmentUnit.create({
        data: {
          identifier: crypto.randomUUID(),
          location: normalizedLocation,
          condition: normalizedCondition,
          equipmentTypeId: equipmentTypeId
        },
        select: {
          id: true,
        }
      })

      const equipmentCode = equipmentType.code
      const unitId = newUnit.id

      const identifier = `${equipmentCode}-${String(unitId).padStart(3, '0')}`

      return await tx.equipmentUnit.update({
        where: {
          id: unitId
        },
        data: {
          identifier: identifier
        },
        select: {
          id: true,
          identifier: true,
          location: true,
          condition: true
        }
      })
    })

    return response.status(201).json({
      message: 'Equipment unit successfully created.',
      data: equipmentUnit
    })
  } catch (error) {
    if (error.code === 'P2002') {
      return response.status(409).json({
        error: 'An equipment unit with this identifier already exists.'
      })
    }

    console.error('Equipment unit creation failed:', {
      name: error.name,
      code: error.code
    })

    return response.status(500).json({
      error: 'Equipment unit could not be created.'
    })
  }
})

export default router