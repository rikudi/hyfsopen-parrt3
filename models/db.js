const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const connectDB = () => {
  const url = process.env.MONGODB_URI

  if (!url) {
    console.error('Database URL not defined in .env file')
    process.exit(1)
  }

  mongoose.set('strictQuery', false)
  return mongoose.connect(url)
}

module.exports = connectDB
