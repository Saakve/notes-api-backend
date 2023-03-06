const bcrypt = require('bcrypt') //Se usa para encriptar 
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.post('/', async (request, response) => {
    const {username, name, password } = request.body

    const saltRounds = 10 //La mayoria asigna el valor de 10 como complejidad algoritmítica
    const passwordHash = await bcrypt.hash(password, saltRounds) 

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()
    response.json(savedUser)
})

module.exports = usersRouter