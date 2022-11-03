const express = require('express')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT
const exphbs = require('express-handlebars')
const path = require('path')
const pool = require('./config/pg')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/products', (req, res) => {
  res.render('products')
})

app.get('/products/:id', (req, res) => {
  res.render('detail')
})

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}.`)
})
