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
  deleteMultipleUsers,
} = require('../controllers/userController')
const { authenticateUser } = require('../middleware/auth/userAuth')
const { authenticateAdmin } = require('../middleware/auth/adminAuth')

// ==========>>>>>> Create a user
router.post('/', createUser) // No authentication required

// ==========>>>>>> Login a user (admin & user)
router.post('/login', LoginUser) // No authentication required

// ==========>>>>>> Recover password (forgot password)
router.post('/recover', recoverPassword) // No authentication required

// ==========>>>>>> Retrieve all users (admin only)
router.get('/', authenticateAdmin, getAllUsers)

// ==========>>>>>> Retrieve a user by ID  (admin & user)
router.get('/:id', authenticateUser, getUserById)

// ==========>>>>>> Update a user by ID (admin & user)
router.put('/:id', authenticateUser, updateUserById)

// ==========>>>>>> Delete a user by ID (admin only)
router.delete('/:id', authenticateAdmin, deleteUserById)

// ==========>>>>>> Delete multiple users by ID array in body (admin only)
router.patch('/', authenticateAdmin, deleteMultipleUsers)

module.exports = router
