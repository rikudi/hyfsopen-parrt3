const connectDB = require('./db')
const Person = require('./person')

// Check if the correct number of arguments is provided
if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <name> <number>')
  process.exit(1)
}

// Connect to database
connectDB()

// If no name and number are provided, retrieve and log all persons
if (process.argv.length === 2) {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  // Retrieve the name and number from the command line arguments
  const name = process.argv[2]
  const number = process.argv[3]

  // create and save a new person
  const person = new Person({
    name: name,
    number: number,
  })

  // save the person object to the database
  person.save().then(result => {
    console.log('added', result.name, 'number', result.number, 'to phonebook')
    mongoose.connection.close()
  })
}

