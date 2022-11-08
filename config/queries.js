const pool = require('./pg')


// GET all products
const getProducts = (req, res) => {
  let featurebox = []
  return pool.query(
    'SELECT * FROM products ORDER BY id ASC',
    (error, results) => {
      if (error) {
        throw error
      }
      const data = results.rows
      return res.render('products', { data })
    }
  )
}

// GET product by ID
const getProductById = (req, res) => {
  const id = parseInt(req.params.id)
  let restStock = 0
  pool.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    const data = results.rows
    return res.render('detail', { data })
  })
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
