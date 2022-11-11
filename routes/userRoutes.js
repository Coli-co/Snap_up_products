const express = require('express')
// const userController = require('../Controllers/userController')
const { signup, login, logout } = require('../Controllers/userController')
const userAuth = require('../Middleware/userAuth')

const router = express.Router()

// check userName or paaword whether is duplicate
router.post('/register', userAuth.saveUser, signup)

router.post('/login', login)

router.get('/logout', userAuth.checkToken, logout)

module.exports = router
