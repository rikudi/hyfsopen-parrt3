const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const personRouter = require('./controllers/persons')
const { requestLogger, unknownEndpoint, errorHandler } = require('./utils/middlewares')

// MongoDB connection
const url = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json()) // parse JSON request bodies
app.use(requestLogger)

// use personRouter for /api/persons routes
app.use('/api/persons', personRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app