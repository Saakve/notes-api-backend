const supertest = require('supertest')
const { app } = require('../index.js')
const User = require('../models/User')

const api = supertest(app)

const getAllContentsFromNotes = async () => {
    const response = await api.get('/api/notes')
    return {
        contents: response.body.map(note => note.content),
        response
    }
}

const getUsers = async () => {
    const usersDB  = await User.find({})
    return usersDB.map(user => user.toJSON())
}

const initialNotes = [
    {
        content: 'Aprendiendo FullStack JS con midudev',
        important: true,
        date: new Date()
    },
    {
        content: 'Nota de prueba 2',
        important: false,
        date: new Date()
    }
]

module.exports = { initialNotes, api, getAllContentsFromNotes, getUsers }