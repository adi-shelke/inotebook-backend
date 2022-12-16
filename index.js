const connect   = require("./db")
const express = require('express')

connect()

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello Adi!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})