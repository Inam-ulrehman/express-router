const { StatusCodes } = require('http-status-codes')

class CustomAPIError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

class ResourceNotFoundError extends CustomAPIError {
  constructor(message) {
    super(message, 404)
  }
}

class BodyNotFoundError extends CustomAPIError {
  constructor(message) {
    super(message, StatusCodes.BAD_REQUEST)
  }
}

module.exports = {
  CustomAPIError,
  ResourceNotFoundError,
  BodyNotFoundError,
}
