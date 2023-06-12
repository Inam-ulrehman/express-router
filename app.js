const express = require('express')
const connectDB = require('./db/connect')
require('dotenv').config()

const app = express()

// Middleware

app.get('/', (req, res) => {
  res.sendStatus(200)
})

// Database connection and server startup
const port = process.env.PORT || 3000
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
