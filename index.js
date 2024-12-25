const express = require('express')
const fs = require('fs')
const path = require('path')
const morgan = require('morgan')
const app = express()
const corse = require('cors')

app.use(corse())
app.use(express.json())
app.use(express.static('dist'))

// Create custom token for logging POST request body
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ' '
})

// Use custom format that includes the body for POST requests
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const getPersons = () => {
  const rawData = fs.readFileSync(path.join(__dirname, 'persons.json'), 'utf8')
  return JSON.parse(rawData)
}

const savePersons = (persons) => {
  fs.writeFileSync(
    path.join(__dirname, 'persons.json'),
    JSON.stringify(persons, null, 2)
  )
}

app.get('/api/persons', (req, res) => {
  const persons = getPersons()
  res.json(persons)
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
app.post('/api/persons', (req, res) => {
  const persons = getPersons()
  const person = req.body

  // Validate empty fields
  if (!person.name) {
    return res.status(400).json({ error: 'name cannot be blank' })
  }
  if (!person.number) {
    return res.status(400).json({ error: 'number cannot be blank' })
  }

  // Check for duplicate number
  const existingNumber = persons.find(p => p.number === person.number)
  if (existingNumber) {
    return res.status(400).json({ error: 'number must be unique' })
  }

  const maxId = persons.length > 0
    ? Math.max(...persons.map(person => person.id))
    : 0
  person.id = maxId + 1
  persons.push(person)
  savePersons(persons)
  res.json(person)
})

//DELETE endpoint to remove a person by id
app.delete('/api/persons/:id', (req, res) => {
  const persons = getPersons()
  const id = Number(req.params.id)
  const filteredPersons = persons.filter(person => person.id !== id)
  
  if (filteredPersons.length === persons.length) {
    return res.status(404).json({ error: 'person not found' })
  }

  savePersons(filteredPersons)
  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})