require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')
const usersRouter = require('./controllers/users')
const notesRouter = require('./controllers/notes')
const loginRouter = require('./controllers/login')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.get('/', (request, response) => {
  response.send('<h1>Hello world</h1>')
})

app.use('/api/notes/', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(notFound)
app.use(handleError)

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = {app, server}