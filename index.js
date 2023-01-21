const connect   = require("./db")
const express = require('express')
var cors = require('cors')
connect()
const app = express()
const port = 5000
app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.get('/', (req, res) => {
  res.send('Hello Adi!')
})

app.listen(port, () => {
  console.log(`iNotebook listening on port ${port}`)
})
