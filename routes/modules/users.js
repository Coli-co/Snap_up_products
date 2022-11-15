const express = require('express')
const { signup, login, logout } = require('../../Controllers/userController')
const userAuth = require('../../Middleware/userAuth')

const router = express.Router()

router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/login', (req, res) => {
  res.render('login')
})

// check userName or paaword whether is duplicate
router.post('/register', userAuth.saveUser, signup)

router.post('/login', login)

router.get('/logout', logout)

module.exports = router
