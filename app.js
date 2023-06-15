const express = require('express')
const connectDB = require('./db/connect')
require('dotenv').config()
const sanitizeInput = require('./middleware/xss')
const helmet = require('helmet')
const cors = require('cors')
const rateLimiter = require('express-rate-limit')
const sampleRoutes = require('./routes/sampleRoutes')
const userRoutes = require('./routes/userRoutes')
const morgan = require('morgan')
const {
  mongooseErrorHandler,
  notFoundErrorHandler,
} = require('./middleware/errors')

const app = express()
app.use(express.json())

// extra security packages and middleware to prevent attacks
app.use(sanitizeInput)
app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
  })
)
app.use(helmet())
app.use(cors())
// morgan.token('client-ip', (req) => req.ip)
// app.use(morgan(':client-ip :method :url :response-time ms'))

// Routes

app.get('/', (req, res) => {
  res.send(`<h1>API is running...</h1>`)
})

app.use('/api/v1/samples', sampleRoutes)
app.use('/api/v1/users', userRoutes)

// Register the global error handlers
app.use(mongooseErrorHandler)
app.use(notFoundErrorHandler)

// Database connection and server startup
const port = process.env.PORT || 5000
const startServer = async () => {
  try {
    await connectDB() // Connect to the database
    const server = app.listen(port, () => {
      if (process.env.NODE_ENV !== 'test') {
        console.log(`Server is listening on port ${port}...`)
      }
    })
    return server
  } catch (error) {
    console.error('Failed to connect to the database:', error)
    throw error
  }
}

startServer()

module.exports = {
  app,
  startServer,
}
