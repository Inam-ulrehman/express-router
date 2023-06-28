// controllers/userController.js

const { StatusCodes } = require('http-status-codes')
const User = require('../models/User')
var bcrypt = require('bcryptjs')
const {
  sendPasswordResetEmail,
} = require('../lib/sendGrid/sendPasswordResetEmail')

// ==========>>>>>> Create operation - create a user
const createUser = async (req, res, next) => {
  const { firstName, email, password } = req.body
  //  check if user count is 0 then role will be admin else user
  const isFirstAccount = await User.countDocuments({})
  const role = isFirstAccount === 0 ? 'admin' : 'user'
  try {
    const user = await User.create({ firstName, email, password, role })
    const token = await user.createJWT()
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User created successfully!',
      role: user.role,
      firstName: user.firstName,
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

  // check if user exists

  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'Invalid credentials!' })
  }
  const isPasswordCorrect = await user.comparePassword(password)

  //  check if password is correct

  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'Invalid credentials!' })
  }
  //  create token and send to client

  const token = await user.createJWT()
  const { role, firstName } = user
  res.status(StatusCodes.OK).json({ success: true, role, firstName, token })
}

// ==========>>>>>> Update operation: Recover password by email

const recoverPassword = async (req, res, next) => {
  const { email } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'User not found!', result: user })
  }
  //  create token and send to client

  const resetToken = await user.createPasswordResetToken()

  //  send email to user with token link to reset password

  const emailSent = await sendPasswordResetEmail(user.email, resetToken)
  if (emailSent) {
    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully!',
    })
  } else {
    res.status(500).json({
      success: false,
      message: 'Failed to send password reset email SendGrid Error!',
    })
  }
}
// ==========>>>>>> Update operation: Update password by token (reset password) by link sent to email
const updatePasswordByToken = async (req, res, next) => {
  const { userId } = req.user
  const { password } = req.body

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  try {
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { password: hashedPassword },
      { runValidators: true }
    )
    const token = await user.createJWT()
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Password updated successfully!',
      name: user.firstName.replace(/\s/g, '-'),
      role: user.role,
      token,
      result: 'completed',
    })
  } catch (err) {
    next(err)
  }
}

// ==========>>>>>> get user by token
const getUserByToken = async (req, res, next) => {
  const { userId } = req.user

  try {
    const user = await User.findById(userId, '-password')
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'Single User!', result: user })
  } catch (err) {
    next(err)
  }
}

// ==========>>>>>> Update User Profile by token
const updateUserProfileByToken = async (req, res, next) => {
  const { userId } = req.user

  let {
    firstName,
    lastName,
    cellPhone,
    homePhone,
    email,
    password,
    gender,
    dob,
    location,
    address,
    verified,
  } = req.body

  // check if user want to update password then hash it and update it

  if (password) {
    const salt = await bcrypt.genSalt(10)
    password = await bcrypt.hash(password, salt)
  }
  if (location) {
    location = JSON.parse(location)
  }
  if (address) {
    address = JSON.parse(address)
  }
  // update user
  try {
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      {
        firstName,
        lastName,
        cellPhone,
        homePhone,
        email,
        password,
        gender,
        dob,
        address,
        location,
        verified,
      },
      { new: true },
      { runValidators: true }
    )
    user.password = undefined

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Profile updated successfully!',
      result: user,
    })
  } catch (err) {
    next(err)
  }
}

// ==========>>>>>> Read operation: Get all users admin only
const getAllUsers = async (req, res, next) => {
  try {
    const searchQuery = req.query.search // Get the search query from the request query parameters
    const page = parseInt(req.query.page) || 1 // Get the page number from the request query parameters, default is 1
    const limit = parseInt(req.query.limit) || 10 // Get the limit from the request query parameters, default is 10
    const sort = req.query.sort || '-createdAt' // Get the sort parameter from the request query parameters, default is -createdAt

    // Create a regex pattern to match the search query case-insensitively
    const regexPattern = new RegExp(searchQuery, 'i')

    const query = {
      $or: [
        { name: regexPattern },
        { lastName: regexPattern },
        { email: regexPattern },
        { cellPhone: regexPattern },
      ],
    }
    const totalCount = await User.countDocuments(query) // Get the total count of matching users
    const totalData = await User.countDocuments()

    const totalPages = Math.ceil(totalCount / limit) // Calculate the total number of pages based on the limit

    const offset = (page - 1) * limit // Calculate the offset based on the page and limit

    const users = await User.find(
      query,
      '-password -__v -updatedAt -dob -location -gender -address.apartment -address.house -address.street -address.region -address.province -address.postalCode'
    )
      .sort(sort) // Sort the users based on the provided sort parameter
      .skip(offset)
      .limit(limit)

    res.status(200).json({
      success: true,
      message: 'All users',
      totalData,
      totalCount,
      countOnPage: users.length,
      totalPages,
      currentPage: page,
      result: users,
    })
  } catch (err) {
    next(err)
  }
}

// ==========>>>>>> Read operation: Get a user by ID admin only
const getUserById = async (req, res, next) => {
  console.log('updateUserById')
  // check if params and token id are same or user is admin then only allow to access this route

  if (req.params.id !== req.user.userId && req.user.role !== 'admin') {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Not authorized to access this route!',
      result: 'Token Id is different then params Id',
    })
  }

  try {
    const { id } = req.params
    const user = await User.findById(id, '-password')

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'Single User ', result: user })
  } catch (err) {
    next(err)
  }
}

// ==========>>>>>> Update operation: Update a user by ID admin only
const updateUserById = async (req, res, next) => {
  const { id } = req.params
  const { userId } = req.user
  // check if params and token id are same or user is admin then only allow to access this route

  if (id !== userId && req.user.role !== 'admin') {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Not authorized to access this route!',
      result: 'Token Id is different then params Id',
    })
  }
  let {
    name,
    lastName,
    mobile,
    email,
    password,
    role,
    gender,
    dob,
    active,
    location,
    apartment,
    house,
    street,
    city,
    province,
    country,
    postalCode,
    verified,
  } = req.body

  // check if user want to update password then hash it and update it

  if (password) {
    const salt = await bcrypt.genSalt(10)
    password = await bcrypt.hash(password, salt)
  }

  // check if user want to change role then check if user is admin then only allow to change role

  if (role && req.user.role !== 'admin') {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Not authorized to access this route!',
      result: 'Only admin can change role',
    })
  }
  // update user
  try {
    const user = await User.findByIdAndUpdate(
      { _id: id },
      {
        name,
        lastName,
        mobile,
        email,
        password,
        role,
        gender,
        dob,
        active,
        location,
        apartment,
        house,
        street,
        city,
        province,
        country,
        postalCode,
        verified,
      },
      { new: true },
      { runValidators: true }
    )
    user.password = undefined

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Profile updated successfully!',
      result: user,
    })
  } catch (err) {
    next(err)
  }
}

// ==========>>>>>> Delete operation: Delete a user by ID
const deleteUserById = async (req, res, next) => {
  // rule: only admin can delete user & admin can't delete himself or herself

  try {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `No item found with this ID ${id}!`,
        result: user,
      })
    }

    if (user?.role === 'admin') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Not authorized to access this route!',
        result: 'Admin can not delete himself or herself',
      })
    }

    const result = await User.findByIdAndDelete(id)
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Deleted successfully!',
      result,
    })
  } catch (err) {
    next(err)
  }
}

// ==========>>>>>> Delete operation: Delete multiple users by ID array in body admin only

const deleteMultipleUsers = async (req, res, next) => {
  let { userIds } = req.body
  userIds = userIds.split(',')

  try {
    // Exclude users with the "admin" role
    const result = await User.deleteMany({
      _id: { $in: userIds },
      role: { $ne: 'admin' },
    })

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found with the given IDs!',
        result: result,
      })
    }

    res.status(200).json({
      success: true,
      message: 'Users deleted successfully!',
      result: result,
    })
  } catch (error) {
    next(error) // Pass errors to Express.
  }
}

// ==========>>>>>> Export module

module.exports = {
  createUser,
  LoginUser,
  recoverPassword,
  getUserByToken,
  updateUserProfileByToken,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  deleteMultipleUsers,
  updatePasswordByToken,
}
