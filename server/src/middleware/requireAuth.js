import 'dotenv/config'
import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret) {
  throw new Error('JWT_SECRET is missing.')
}

export default function requireAuth(request, response, next) {
  const auth = request.headers.authorization

  if (!auth) {
    return response.status(401).json({
      error: 'Authentication required.'
    })
  }

  const parts = auth.split(' ')

  if (parts.length !== 2) {
    return response.status(401).json({
      error: 'Invalid authorization header.'
    })
  }

  const [scheme, token] = parts

  if (
    scheme.toLowerCase() !== 'bearer' ||
    !token
  ) {
    return response.status(401).json({
      error: 'Invalid authorization header.'
    })
  }

  try {
    const payload = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] })

    if (
      payload === null || 
      typeof payload !== 'object' || 
      typeof payload.sub !== 'string' || 
      payload.sub.trim() === ''
    ) {
      return response.status(401).json({
        error: 'Invalid or expired token. Please log in again.'
      })
    }

    request.auth = {
      userId: payload.sub
    }
  } catch {
    return response.status(401).json({
        error: 'Invalid or expired token. Please log in again.'
      })
  }

  next()
}