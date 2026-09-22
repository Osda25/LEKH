import 'dotenv/config'
import express, { request } from 'express'
import bcrypt from 'bcrypt'
import prisma from '../prisma.js'
import jwt from 'jsonwebtoken'
import requireAuth from '../middleware/requireAuth.js'

const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret) {
  throw new Error('JWT_SECRET is missing.')
}

const router = express.Router()

router.post('/register', async (request, response) => {
  if (!request.body) {
    return response.status(400).json({
      error: 'Request body is required.'
    })
  }

  const { name, email, phone, password } = request.body

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof phone !== 'string' ||
    typeof password !== 'string'
  ) {
    return response.status(400).json({
      error: 'Name, email, phone and password must be provided as text.'
    })
  }

  if (Buffer.byteLength(password, 'utf8') > 72) {
    return response.status(400).json({
      error: 'Password is too long. Please use a shorter password.'
    })
  }

  const normalizedName = name.trim()
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedPhone = phone.trim()

  if (
    !normalizedName ||
    !normalizedEmail ||
    !normalizedPhone ||
    !password
  ) {
    return response.status(400).json({
      error: 'All fields are required'
    })
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(normalizedEmail)) {
    return response.status(400).json({
      error: 'Enter a valid email address.'
    })
  }

  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = await prisma.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        phone: normalizedPhone,
        passwordHash: passwordHash,
        role: 'USER'
      },
      select: {
        id: true
      }
    })

    return response.status(201).json({
      message: 'Account successfully created',
      userId: user.id
    })
  } catch (error) {
    if (error.code === 'P2002') {
      return response.status(409).json({
        error: 'An account with this email address already exists.'
      })
    }

    console.error('Registration failed:', {
      name: error.name,
      code: error.code
    })

    return response.status(500).json({
      error: 'Registration could not be completed.'
    })
  }
})

router.post('/login', async (request, response) => {
  if (!request.body) {
    return response.status(400).json({
      error: 'Request body is required.'
    })
  }

  const { email, password } = request.body

  if (
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return response.status(400).json({
      error: 'Email and password must be provided as text.'
    })
  }

  const normalizedEmail = email.trim().toLowerCase()

  if (
    !normalizedEmail ||
    !password
  ) {
    return response.status(400).json({
      error: 'All fields are required'
    })
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(normalizedEmail)) {
    return response.status(400).json({
      error: 'Enter a valid email address.'
    })
  }

  if (Buffer.byteLength(password, 'utf8') > 72) {
    return response.status(400).json({
      error: 'Password is too long. Please use a shorter password.'
    })
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      }
    })

    if (user === null) {
      return response.status(401).json({
        error: 'Incorrect email or password'
      })
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash)

    if (!passwordMatch) {
      return response.status(401).json({
        error: 'Incorrect email or password'
      })
    }

    const token = jwt.sign({ sub: String(user.id) }, jwtSecret, { expiresIn: '24h', algorithm: 'HS256' })

    return response.status(200).json({
      message: 'Credentials verified',
      userId: user.id,
      token: token
    })

  } catch (error){
    return response.status(500).json({
      error: 'Login could not be completed.'
    })
  }
})

router.get('/me', requireAuth, (request, response) => {
  return response.status(200).json({
    userId: request.auth.userId
  })
})

export default router