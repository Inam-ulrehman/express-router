// routes/userRoutes.js

const express = require('express')
const router = express.Router()

const {
  createUser,
  LoginUser,
  recoverPassword,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require('../controllers/userController')
const { authenticateUser } = require('../middleware/auth/userAuth')
const { authenticateAdmin } = require('../middleware/auth/adminAuth')

// ==========>>>>>> Create a user
router.post('/', createUser)

// ==========>>>>>> Login a user
router.post('/login', LoginUser)

// ==========>>>>>> Recover password
router.post('/recover', recoverPassword)

// ==========>>>>>> Retrieve all users
router.get('/', authenticateAdmin, getAllUsers)

// ==========>>>>>> Retrieve a user by ID
router.get('/:id', authenticateUser, getUserById)

// ==========>>>>>> Update a user by ID
router.put('/:id', updateUserById)

// ==========>>>>>> Delete a user by ID
router.delete('/:id', deleteUserById)

module.exports = router
