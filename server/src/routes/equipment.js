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
      }
    })

    return response.status(200).json(equipmentTypes)
  } catch {
    return response.status(500).json({
      error: 'Equipment could not be retrieved.'
    })
  }
})

export default router