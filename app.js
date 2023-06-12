import express from 'express'
const app = express()

app.get('/', (req, res) => {
  const clientIP = req.ip
  res.send(`Client inam IP: ${clientIP}`)
})

const port = process.env.PORT || 3000
const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
