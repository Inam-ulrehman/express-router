const express = require('express')
const app = express()

app.get('/', (req, res) => {
  const clientIP = req.ip
  res.send(`Client IP: ${clientIP}`)
})

const server = app.listen(3000, () => {
  console.log('Server is listening on port 3000...')
})

module.exports = {
  app,
  server,
}
