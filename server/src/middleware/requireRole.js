import prisma from '../prisma.js'

export default function requireRole(...allowedRoles) {
  return async function (request, response, next) {
    const userId = Number(request.auth?.userId)

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return response.status(401).json({
        error: 'Authentication required.'
      })
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          role: true
        }
      })

      if (!user) {
        return response.status(401).json({
          error: 'Authentication required.'
        })
      }

      if (!allowedRoles.includes(user.role)) {
        return response.status(403).json({
          error: 'Permission forbidden.'
        })
      }

      next()
    } catch {
      return response.status(500).json({
        error: 'User role could not be retrieved.'
      })
    }
  }
}