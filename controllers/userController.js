// controllers/userController.js

const { StatusCodes } = require('http-status-codes')
const User = require('../models/User')

// ==========>>>>>> Create operation - create a user
const createUser = async (req, res, next) => {
  const { name, email, password } = req.body
  const isFirstAccount = await User.countDocuments({})
  const role = isFirstAccount === 0 ? 'admin' : 'user'
  try {
    const user = await User.create({ name, email, password, role })
    const token = await user.createJWT()
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User created successfully',
      role: user.role,
      name: user.name,
      token,
    })
  } catch (err) {
    next(err)
  }
}

// ==========>>>>>> login operation - login user

const LoginUser = async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'Invalid credentials' })
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'Invalid credentials' })
  }
  const token = await user.createJWT()

  res
    .status(StatusCodes.OK)
    .json({ success: true, role: user.role, name: user.name, token })
}

// ==========>>>>>> Read operation: Get all users
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

// ==========>>>>>> Read operation: Get a user by ID
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'User not found', result: user })
    }
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'Single User ', result: user })
  } catch (err) {
    next(err)
  }
}

// ==========>>>>>> Update operation: Update a user by ID
const updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name } = req.body
    if (!name) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'Please provide name' })
      return
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

// ==========>>>>>> Delete operation: Delete a user by ID
const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findByIdAndDelete(id)
    if (!user) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'User not found', result: user })
      return
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
  LoginUser,
}
