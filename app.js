const express = require('express')
require('dotenv').config()
const connectDB = require('./db/connect')
const app = express()

app.get('/', (req, res) => {
  const clientIP = req.ip
  res.send(`Client inam IP: ${clientIP}`)
})

const port = process.env.PORT || 3000

const start = async () => {
  try {
    const result = await connectDB(process.env.MONGO_URI)
    console.log('Connected to MongoDB...', result.connections[0].name)
    app.listen(port, console.log(`Server is listening on port ${port}...`))
  } catch (error) {
    console.log(error)
  }
}

const server = start()

module.exports = {
  app,
  server,
}
