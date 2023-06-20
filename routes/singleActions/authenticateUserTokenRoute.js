// create user token auth route

const express = require('express')
const router = express.Router()
const {
  authenticateUserToken,
} = require('../../controllers/singleActions/authenticateUserToken')

router.route('/').get(authenticateUserToken)

module.exports = router
