const { Pool } = require('pg')
const configParams = require('./pg')
const { multipleRequest } = require('../aws/producer')

const {
  hasDBProcessTimeKey,
  dbTimeFormatTrans,
  notEnoughAmountCount,
  snapperSuccessCount
} = require('../helper/handlebarsHelper')

const {
  productDetail,
  addAmountAndQuantityToSnapper,
  getSnappers,
  sendRequestToQueue
} = require('../snap/snapStatus')

// GET all products
const getProducts = async (req, res) => {
  const pool = await new Pool(configParams)
  const query = `SELECT * FROM products ORDER BY id ASC`
  try {
    const results = await pool.query(query)
    const data = results.rows
    res.render('products', { data })
  } catch (err) {
    console.log(err)
  }
}

// GET each product by ID
const getProductById = async (req, res) => {
  const id = parseInt(req.params.id)
  const pool = await new Pool(configParams)
  const query = `SELECT * FROM products WHERE id = $1`

  try {
    const results = await pool.query(query, [id])
    const data = results.rows
    return res.render('detail', { data })
  } catch (err) {
    console.log(err)
  }
}

// Sned multiple request at the same time
const sendMultipleRequest = async (req, res) => {
  const productId = req.params.id
  multipleRequest(productId)
}

// PUT updated data in an existing product quantity
const updateProduct = async (req, res) => {
  const productId = req.params.id
  const pool = await new Pool(configParams)
  // check restStock of the product
  const query = `SELECT * FROM products WHERE id = $1`
  const results = await pool.query(query, [productId])
  const originalStock = results.rows[0].quantity

  // send multiple request to the queue
  sendRequestToQueue(productId, 10)

  // allow enough time to process snap data
  setTimeout(async () => {
    console.log('Processing data done!')
    // get snapper data
    const allSnapper = await getSnappers()
    const totalSnapperCount = allSnapper.length
    const wholePropertiesSnapper = await addAmountAndQuantityToSnapper(
      allSnapper
    )

    // check rest of quantity of product
    const product = await productDetail(productId)
    const restStock = product.quantity

    return res.render('snapup', {
      wholePropertiesSnapper,
      totalSnapperCount,
      originalStock,
      restStock,
      product,
      notEnoughAmountCount,
      snapperSuccessCount,
      hasDBProcessTimeKey,
      dbTimeFormatTrans
    })
  }, 18000)
}

module.exports = {
  getProducts,
  getProductById,
  sendMultipleRequest,
  updateProduct
}
