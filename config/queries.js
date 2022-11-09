const { Pool } = require('pg')
const configParams = require('./pg')

// GET all products
const getProducts = async (req, res) => {
  const pool = new Pool(configParams)
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
  const pool = new Pool(configParams)
  const query = `SELECT * FROM products WHERE id = $1`

  try {
    const results = await pool.query(query, [id])
    const data = results.rows
    return res.render('detail', { data })
  } catch (err) {
    console.log(err)
  }
}

// PUT updated data in an existing product quantity
const updateProduct = async (req, res) => {
  const pool = new Pool(configParams)
  const id = parseInt(req.params.id)
  const quantity = req.body.count
  // check rest of quantity of product
  let restStock = 0
  const query = `SELECT quantity FROM products WHERE id = $1`
  const updateQuery = `UPDATE products SET quantity = $1 WHERE id = $2`

  try {
    const results = await pool.query(query, [id])
    const data = results.rows
    restStock = results.rows[0].quantity - quantity
    await pool.query(updateQuery, [restStock, id])
    res.render('snapup')
  } catch (err) {
    console.log(err)
  }
}

module.exports = { getProducts, getProductById, updateProduct }
