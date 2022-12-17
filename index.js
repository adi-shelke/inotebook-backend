const connect   = require("./db")
const express = require('express')
const app = express()
app.use(express.json())

connect()

const port = 3000

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.get('/', (req, res) => {
  res.send('Hello Adi!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
