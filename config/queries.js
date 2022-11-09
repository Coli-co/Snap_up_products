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
const updateProduct = (req, res) => {
  const id = parseInt(req.params.id)
  const { quantity } = req.body
  let restStock = 0
  pool.query(
    'SELECT quantity FROM products WHERE id = $1',
    [id],
    (error, results) => {
      if (error) {
        throw error
      }
      restStock = results.rows[0].quantity - quantity
      pool.query(
        'UPDATE products SET quantity = $1 WHERE id = $2',
        [restStock, id],
        (error, results) => {
          if (error) {
            throw error
          }
          res
            .status(200)
            .send(
              `Product modified with ID: ${id}, the rest of quantity is ${restStock}.`
            )
        }
      )
    }
  )
}

module.exports = { getProducts, getProductById, updateProduct }
