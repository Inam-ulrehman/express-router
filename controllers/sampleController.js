// controllers/sampleController.js

const { StatusCodes } = require('http-status-codes')
const Sample = require('../models/Sample')

// Create operation
const createSample = async (req, res, next) => {
  try {
    const { name } = req.body
    const sample = await Sample.create({ name })
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Sample created successfully',
      result: sample,
    })
  } catch (err) {
    next(err)
  }
}

// Read operation: Get all samples
const getAllSamples = async (req, res, next) => {
  try {
    const samples = await Sample.find()
    const count = await Sample.countDocuments()
    res
      .status(200)
      .json({ success: true, message: 'All samples', count, result: samples })
  } catch (err) {
    next(err)
  }
}

// Read operation: Get a sample by ID
const getSampleById = async (req, res, next) => {
  try {
    const { id } = req.params
    const sample = await Sample.findById(id)
    if (!sample) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'Sample not found', result: sample })
    }
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'Single Sample ', result: sample })
  } catch (err) {
    next(err)
  }
}

// Update operation: Update a sample by ID
const updateSampleById = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name } = req.body
    if (!name) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'Please provide name' })
      return
    }
    const sample = await Sample.findByIdAndUpdate(id, { name }, { new: true })
    if (!sample) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'Sample not found', result: sample })
      return
    }
    res
      .status(StatusCodes.ACCEPTED)
      .json({ success: true, message: 'Updated!', result: sample })
  } catch (err) {
    next(err)
  }
}

// Delete operation: Delete a sample by ID
const deleteSampleById = async (req, res, next) => {
  try {
    const { id } = req.params
    const sample = await Sample.findByIdAndDelete(id)
    if (!sample) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'Sample not found', result: sample })
    }
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'Deleted!', result: sample })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createSample,
  getAllSamples,
  getSampleById,
  updateSampleById,
  deleteSampleById,
}
