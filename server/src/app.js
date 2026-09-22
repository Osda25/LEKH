import express from 'express'
import cors from 'cors'
import { clientUrl } from './config.js'
import authRouter from './routes/auth.js'

const app = express()

app.use(cors({
  origin: clientUrl
}))

app.use(express.json())

app.get('/api/health', (request, response) => {
  response.json({
    status: 'ok'
  })
})

app.use('/api/auth', authRouter)

export default app