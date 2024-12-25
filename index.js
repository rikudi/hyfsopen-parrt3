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

app.get('/api/persons', (req, res) => {
  try {
    const filePath = path.join(__dirname, './persons.json')
    console.log('Attempting to read from:', filePath)
    
    const data = fs.readFileSync(filePath, 'utf8')
    console.log('Data read successfully')
    res.json(JSON.parse(data))
  } catch (err) {
    console.error('Error reading file:', err)
    res.status(500).send('Error reading data: ' + err.message)
  }
})

app.get('/', (req, res) => {
  res.send('Hello World')
})

//info endpoint displaing how many entries are in the phonebook
app.get('/info', (req, res) => { 
  const filePath = path.join(__dirname, './persons.json')
  const data = fs.readFileSync(filePath, 'utf8')
  const persons = JSON.parse(data)
  const date = new Date()
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

//get a single person by id, if empty return 404
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const filePath = path.join(__dirname, './persons.json')
  const data = fs.readFileSync(filePath, 'utf8')
  const persons = JSON.parse(data)
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
  const filePath = path.join(__dirname, './persons.json')
  const data = fs.readFileSync(filePath, 'utf8')
  const persons = JSON.parse(data)
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
  fs.writeFileSync(filePath, JSON.stringify(persons, null, 2))
  res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})