require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')
const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.get('/', (request, response) => {
  response.send('<h1>Hello world</h1>')
})

app.get('/api/notes', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  Note.findById(id).then(note => {
    if (note) {
      return response.json(note)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/notes/:id', async (request, response, next) => {
  const { id } = request.params
  try {
    await Note.findByIdAndRemove(id) 
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.post('/api/notes', async (request, response, next) => {
  const note = request.body

  const newNote = new Note({
    content: note.content,
    important: note.important || false,
    date: new Date().toISOString()
  })

  try {
    const savedNote = await newNote.save()
    response.status(201).json(savedNote)
  } catch (error) {
    next(error)
  }    
})

app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  const { content, important } = request.body

  Note.findByIdAndUpdate(
    id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(noteUpdated => {
      response.json(noteUpdated)
    })
    .catch(error => next(error))
})

app.use(notFound)
app.use(handleError)

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = {app, server}