// models/modal.js

const mongoose = require('mongoose')

const modalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  // Add more fields as needed
})

const Modal = mongoose.model('Modal', modalSchema)

module.exports = Modal
