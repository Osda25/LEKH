import express from 'express'
import cors from 'cors'
import { clientUrl } from './config.js'
import authRouter from './routes/auth.js'
import equipmentRouter from './routes/equipment.js'
import loansRouter from './routes/loans.js'
import faultReportRouter from './routes/faultReports.js'

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

app.use('/api/equipment', equipmentRouter)

app.use('/api/loans', loansRouter)

app.use('/api/fault-reports', faultReportRouter)

export default app