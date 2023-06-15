// controllers/userController.js

const { StatusCodes } = require('http-status-codes')
const User = require('../models/User')

const {
  ResourceNotFoundError,
  BodyNotFoundError,
} = require('../middleware/errors/customErrors')

// Create operation
const createUser = async (req, res, next) => {
  try {
    const { name } = req.body
    const user = await User.create({ name })
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User created successfully',
      result: user,
    })
  } catch (err) {
    next(err)
  }
}

// Read operation: Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
    const count = await User.countDocuments()
    res
      .status(200)
      .json({ success: true, message: 'All users', count, result: users })
  } catch (err) {
    next(err)
  }
}

// Read operation: Get a user by ID
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user) {
      throw new ResourceNotFoundError('User not found')
    }
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'Single User ', result: user })
  } catch (err) {
    next(err)
  }
}

// Update operation: Update a user by ID
const updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name } = req.body
    if (!name) {
      throw new BodyNotFoundError('Name is required')
    }
    const user = await User.findByIdAndUpdate(id, { name }, { new: true })
    if (!user) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: 'User not found' })
      return
    }
    res
      .status(StatusCodes.ACCEPTED)
      .json({ success: true, message: 'Updated!', result: user })
  } catch (err) {
    next(err)
  }
}

// Delete operation: Delete a user by ID
const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findByIdAndDelete(id)
    if (!user) {
      throw new ResourceNotFoundError(`User with id ${id} not found`)
    }
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'Deleted!', result: user })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
}
