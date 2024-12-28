const express = require('express')
const fs = require('fs')
const path = require('path')
const morgan = require('morgan')
const app = express()
const corse = require('cors')
const db = require('./models')

app.use(corse())
app.use(express.json())
app.use(express.static('dist'))

// Create custom token for logging POST request body
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ' '
})

// Use custom format that includes the body for POST requests
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', async (req, res) => {
  try {
    const persons = await db.getAllPersons()
    res.json(persons)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/', (req, res) => {
  res.send('Hello World')
})

//info endpoint displaing how many entries are in the phonebook
app.get('/info', (req, res) => { 
  const persons = getPersons()
  const date = new Date()
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

//get a single person by id, if empty return 404
app.get('/api/persons/:id', (req, res) => {
  const persons = getPersons()
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
    }
  } 
)

//http post to add a new person to the phonebook, generates a new id
app.post('/api/persons', async (req, res) => {
  try {
    const { name, number } = req.body
    const newPerson = await db.addPerson(name, number)
    res.json(newPerson)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

//DELETE endpoint to remove a person by id
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(deletedPerson => {
      if (deletedPerson) {
        response.status(204).end()
      } else {
        response.status(404).json({ error: 'person not found' })
      }
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})