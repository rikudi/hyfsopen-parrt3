// Import required dependencies
const mongoose = require('mongoose')  // MongoDB object modeling tool
const path = require('path')         // Node.js path utility for handling file paths

// Look for .env in project root
require('dotenv').config({ path: path.join(__dirname, '../.env') })

// Function to establish connection with MongoDB database
const connectDB = () => {
  // Get the database URL from environment variables
  const url = process.env.MONGODB_URI

  // Safety check: make sure we have a database URL
  if (!url) {
    console.error('Database URL not defined. Please check:')
    console.error('1. .env file exists in project root')
    console.error('2. MONGODB_URI is set in .env')
    console.error('3. Environment variables are set in Render dashboard')
    process.exit(1)  // Exit the application if URL is missing
  }

  // Configure Mongoose to be less strict about queries
  mongoose.set('strictQuery', false)
  
  // Establish and return the database connection
  return mongoose.connect(url)
}

// Make the connection function available to other files
module.exports = connectDB
