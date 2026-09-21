import 'dotenv/config'

export const port = process.env.PORT || 3001
export const clientUrl =
  process.env.CLIENT_URL || 'http://localhost:5173'