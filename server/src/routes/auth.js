import express from "express"
import bcrypt from 'bcrypt'
import prisma from "../prisma.js"

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

  const validName = name.trim()
  const validEmail = email.trim().toLowerCase()
  const validPhone = phone.trim()

  if (
    !validName ||
    !validEmail ||
    !validPhone ||
    !password
  ) {
    return response.status(400).json({
      error: 'All fields are required'
    })
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(validEmail)) {
    return response.status(400).json({
      error: 'Enter a valid email address.'
    })
  }

  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = await prisma.user.create({
      data: {
        name: validName,
        email: validEmail,
        phone: validPhone,
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

export default router