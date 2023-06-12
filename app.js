const express = require('express')
// const app = express()

app.get('/', (req, res) => {
  const clientIP = req.ip
  res.send(`Client inam IP: ${clientIP}`)
})

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  console.log('Server is listening on port 3000...')
})

module.exports = {
  app,
  server,
}
