// routes/modalRoutes.js

const express = require('express')
const router = express.Router()

const {
  createModal,
  getAllModals,
  getModalById,
  updateModalById,
  deleteModalById,
} = require('../controllers/modalController')

// Create a modal
router.post('/', createModal)

// Retrieve all modals
router.get('/', getAllModals)

// Retrieve a modal by ID
router.get('/:id', getModalById)

// Update a modal by ID
router.put('/:id', updateModalById)

// Delete a modal by ID
router.delete('/:id', deleteModalById)

module.exports = router
