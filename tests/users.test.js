const moongose = require('mongoose')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { api, getUsers } = require('./helpers')
const { server } = require('../index.js')

describe.only('creating a new user', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('pswd',10)
        const user = new User({username: 'root', passwordHash})

        await user.save()
    })

    test('work as expectec creating a fresh username', async () => {
        const usersAtStart = await getUsers()

        const newUser = {
            username: 'saakve',
            name: 'kevin',
            password: 'lalala'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-type',/application\/json/)
        
        const usersAtEnd = await getUsers()

        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username is alredy taken', async () => {
        const usersAtStart = await getUsers()

        const newUser = {
            username: 'root',
            name: 'kevin',
            password: 'lalala'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-type', /application\/json/)
        
        expect(result.body.error).toContain('`username` to be unique')
        
        const usersAtEnd = await getUsers()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    afterAll(() => {
        moongose.connection.close()
        server.close()
    })
})