const pool = require('./pg')

// GET all products
const getProducts = (req, res) => {
  let featurebox = []
  pool.query('SELECT * FROM products ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }

    const data = results.rows

    res.render('products', { data })
  })
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
    res.render('detail', { data })
  })
}

module.exports = { getProducts, getProductById }
