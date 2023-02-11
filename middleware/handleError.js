module.exports = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'id used is malformed' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }

  response.status(500).end()
}
