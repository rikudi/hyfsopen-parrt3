// Import our database connection and Person model
const connectDB = require('./db')
const Person = require('./person')

// Ensure user provides the correct command line arguments
// process.argv contains command line arguments: [node, script.js, ...userArguments]
if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <name> <number>')
  process.exit(1)
}

// Initialize database connection
connectDB()

// Command line interface logic:
// If only 2 arguments (node + script name), show all entries
// If more arguments, add new person to database
if (process.argv.length === 2) {
  // Find and display all persons in the database
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()  // Always close database connection when done
  })
} else {
  // Get name and number from command line arguments
  const name = process.argv[2]
  const number = process.argv[3]

  // Create a new person instance using our Person model
  const person = new Person({
    name: name,
    number: number,
  })

  // Save the new person to database and show confirmation
  person.save()
    .then(result => {
      console.log('added', result.name, 'number', result.number, 'to phonebook')
      mongoose.connection.close()
    })
    .catch(error => {
      console.error('Error saving person:', error)
      mongoose.connection.close()
    })
}
