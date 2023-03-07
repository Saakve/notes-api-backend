const bcrypt = require('bcrypt') //Se usa para encriptar 
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('notes', {
        content: 1,
        date: 1
    })
    
    response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
    const {username, name, password } = request.body

    const saltRounds = 10 //La mayoria asigna el valor de 10 como complejidad algoritmítica
    const passwordHash = await bcrypt.hash(password, saltRounds) 

    const user = new User({
        username,
        name,
        passwordHash
    })

    try {
        const savedUser = await user.save()
        response.status(201).json(savedUser)
    } catch (error) {
        next(error)
    }
})

module.exports = usersRouter