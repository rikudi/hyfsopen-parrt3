const connectDB = require('./db')
const Person = require('./person')

// Initialize database connection
connectDB()
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
  })

// Database operations
const getAllPersons = async () => {
  return await Person.find({})
}

const addPerson = async (name, number) => {
  const person = new Person({
    name,
    number
  })
  return await person.save()
}

const findPerson = async (id) => {
  return await Person.findById(id)
}

const updatePerson = async (id, newData) => {
  return await Person.findByIdAndUpdate(id, newData, { new: true })
}

const deletePerson = async (id) => {
  return await Person.findByIdAndDelete(id)
}

module.exports = {
  getAllPersons,
  addPerson,
  findPerson,
  updatePerson,
  deletePerson
}
