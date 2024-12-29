const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phoneValidator = {
  validator: function(v) {
    return /^\d{2,3}-\d{5,}$/.test(v);
  },
  message: props => `${props.value} is not a valid phone number!`
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minLength: [5, 'Name must be at least 5 characters long']
  },
  number: {
    type: String,
    required: [true, 'Number is required'],
    validate: phoneValidator
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)