import express from 'express'
import cors from 'cors'
import { clientUrl } from './config.js'

const app = express()

app.use(cors({
  origin: clientUrl
}))

app.get('/api/health', (request, response) => {
  response.json({
    status: 'ok'
  })
})

app.use(express.json())

export default app