const express = require('express')
const router = express.Router()
const db = require('../../config/queries')
const userAuth = require('../../Middleware/userAuth')

router.get('/', db.getProducts)

router.get('/:id', userAuth.checkToken, db.getProductById)

router.get('/:id', db.getProductById)

router.put('/:id', userAuth.checkToken, db.updateProduct)

module.exports = router
