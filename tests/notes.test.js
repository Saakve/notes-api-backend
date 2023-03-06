const moongose = require('mongoose')

const { server} = require('../index.js')
const Note = require('../models/Note')
const { initialNotes, api, getAllContentsFromNotes} = require("./helpers") 

beforeEach(async () => {
    await Note.deleteMany({})

    for(const note of initialNotes) {
        const noteObject = new Note(note)
        await noteObject.save()
    }
})

test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
})

test('there are two notes', async () => {
    const { response } = await getAllContentsFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
})

test('the first note is about midudev', async () => {
    const { contents } = await getAllContentsFromNotes()
    expect(contents).toContain('Aprendiendo FullStack JS con midudev')
})

test('a valid note can be added ', async () => {
    const newNote = {
        content: 'Nota de prueba'
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const { contents } = await getAllContentsFromNotes()
    expect(contents).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain(newNote.content)
})

test('note without content is not added', async () => {
    const newNote = {
        important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)
    
    const { response } = await getAllContentsFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
})

test('a note can be deleted', async () => {
    const { response: firstResponse } = await getAllContentsFromNotes()
    const noteToDeleted = firstResponse.body[0]

    await api
      .delete(`/api/notes/${noteToDeleted.id}`)
      .expect(204)

    const { contents ,response: secondResponse} = await getAllContentsFromNotes()
    expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
    expect(contents).not.toContain(noteToDeleted.content)
})

test('a note that do not exits can not be deleted', async () => {
    await api
      .delete(`/api/notes/1234`)
      .expect(400)

    const { response } = await getAllContentsFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
})

afterAll(() => {
  moongose.connection.close()
  server.close()
})