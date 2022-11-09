const express = require('express')
// const userController = require('../Controllers/userController')
const { signup, login } = require('../Controllers/userController')
const userAuth = require('../Middleware/userAuth')

const router = express.Router()

router.post('/signup', userAuth.saveUser, signup)

router.post('/login', login)

module.exports = router
