const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

module.exports = mongoose.model('Person', personSchema)
