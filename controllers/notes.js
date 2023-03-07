const notesRouter = require('express').Router()
const Note = require('../models/Note')

notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({})
    response.json(notes)
})

notesRouter.get('/:id', (request, response, next) => {
    const { id } = request.params

    Note.findById(id).then(note => {
        if (note) {
            return response.json(note)
        } else {
            response.status(404).end()
        }
    }).catch(error => next(error))
})

notesRouter.delete('/:id', async (request, response, next) => {
    const { id } = request.params
    try {
        await Note.findByIdAndRemove(id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

notesRouter.post('/', async (request, response, next) => {
    const {
        content,
        important = false,
        userId
    } = request.body

    const newNote = new Note({
        content,
        important,
        date: new Date().toISOString()
    })

    try {
        const savedNote = await newNote.save()
        response.status(201).json(savedNote)
    } catch (error) {
        next(error)
    }
})

notesRouter.put('/:id', (request, response, next) => {
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


module.exports = notesRouter