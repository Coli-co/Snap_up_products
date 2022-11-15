const express = require('express')
const router = express.Router()
const users = require('./modules/users')
const home = require('./modules/home')
const products = require('./modules/products')

router.use('/', home)
router.use('/users', users)
router.use('/products', products)

module.exports = router
