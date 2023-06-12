const express = require('express')
const app = express()

app.get('/', (req, res) => {
  const clientIP = req.ip
  res.send(`Client IP: ${clientIP}`)
})

module.exports = app // Export the app for testing

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`)
})
