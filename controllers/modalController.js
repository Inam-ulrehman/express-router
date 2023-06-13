// controllers/modalController.js

const { StatusCodes } = require('http-status-codes')
const Modal = require('../modals/modal')
const {
  ResourceNotFoundError,
  BodyNotFoundError,
} = require('../middleware/errors/customErrors')

// Create operation
const createModal = async (req, res, next) => {
  try {
    const { name } = req.body
    const modal = await Modal.create({ name })
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Modal created successfully',
      result: modal,
    })
  } catch (err) {
    next(err)
  }
}

// Read operation: Get all modals
const getAllModals = async (req, res, next) => {
  try {
    const modals = await Modal.find()
    const count = await Modal.countDocuments()
    res
      .status(200)
      .json({ success: true, message: 'All modals', count, result: modals })
  } catch (err) {
    next(err)
  }
}

// Read operation: Get a modal by ID
const getModalById = async (req, res, next) => {
  try {
    const { id } = req.params
    const modal = await Modal.findById(id)
    if (!modal) {
      throw new ResourceNotFoundError('Modal not found')
    }
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'Single Modal ', result: modal })
  } catch (err) {
    next(err)
  }
}

// Update operation: Update a modal by ID
const updateModalById = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name } = req.body
    if (!name) {
      throw new BodyNotFoundError('Name is required')
    }
    const modal = await Modal.findByIdAndUpdate(id, { name }, { new: true })
    if (!modal) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: 'Modal not found' })
      return
    }
    res
      .status(StatusCodes.ACCEPTED)
      .json({ success: true, message: 'Updated!', result: modal })
  } catch (err) {
    next(err)
  }
}

// Delete operation: Delete a modal by ID
const deleteModalById = async (req, res, next) => {
  try {
    const { id } = req.params
    const modal = await Modal.findByIdAndDelete(id)
    if (!modal) {
      throw new ResourceNotFoundError(`Modal with id ${id} not found`)
    }
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'Deleted!', result: modal })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createModal,
  getAllModals,
  getModalById,
  updateModalById,
  deleteModalById,
}
