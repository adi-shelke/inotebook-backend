const connect   = require("./db")
const express = require('express')
var cors = require('cors')
connect()
const app = express()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())

app.use('https://noted-aaej.onrender.com/api/auth', require('./routes/auth'))
app.use('https://noted-aaej.onrender.com/api/notes', require('./routes/notes'))

app.get('/', (req, res) => {
  res.send('Hello Adi!')
})

app.listen(port, () => {
  console.log(`iNotebook listening on port ${port}`)
})
