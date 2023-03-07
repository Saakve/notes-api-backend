const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({}).populate('user', {
        username: 1,
        name: 1
    })
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

notesRouter.delete('/:id', userExtractor, async (request, response, next) => {
    const { id } = request.params
    try {
        await Note.findByIdAndRemove(id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

notesRouter.post('/', userExtractor, async (request, response, next) => {
    const { userId } = request
    const {
        content,
        important = false,
    } = request.body

    try {
        const user = await User.findById(userId)

        const newNote = new Note({
            content,
            important,
            date: new Date().toISOString(),
            user: user._id
        })

        const savedNote = await newNote.save()

        user.notes = user.notes.concat(savedNote._id)
        await user.save()

        response.status(201).json(savedNote)
    } catch (error) {
        next(error)
    }
})

notesRouter.put('/:id', userExtractor, (request, response, next) => {
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