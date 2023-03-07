module.exports = (error, request, response, next) => {  
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'id used is malformed' })
  }
  
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token missing or invalid'})
  }

  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired'})
  }

  console.error(error.name, error.message)
  
  response.status(500).end()
}
