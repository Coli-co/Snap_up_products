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

module.exports = { getProducts }
