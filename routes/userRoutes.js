// routes/userRoutes.js

const express = require('express')
const router = express.Router()

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require('../controllers/userController')

// Create a user
router.post('/', createUser)

// Retrieve all users
router.get('/', getAllUsers)

// Retrieve a user by ID
router.get('/:id', getUserById)

// Update a user by ID
router.put('/:id', updateUserById)

// Delete a user by ID
router.delete('/:id', deleteUserById)

module.exports = router
