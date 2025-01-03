const personRouter = require('express').Router()
const Person = require('../models/person')

// get all persons
personRouter.get('/', async (request, response, next) => {
  try {
    const persons = await Person.find({})
    response.json(persons)
  } catch (error) {
    next(error)
  }
})

// add a new person
personRouter.post('/', async (request, response, next) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({ name, number })

  try {
    const savedPerson = await person.save()
    response.json(savedPerson)
  } catch (error) {
    next(error)
  }
})

// get a single person
personRouter.get('/:id', async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

// update a person
personRouter.put('/:id', async (request, response, next) => {
  const { name, number } = request.body

  const person = { name, number }

  try {
    const updatedPerson = await Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    response.json(updatedPerson)
  } catch (error) {
    next(error)
  }
})

// delete a person
personRouter.delete('/:id', async (request, response, next) => {
  try {
    await Person.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = personRouter