const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const path = require('path')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/products', (req, res) => {
  res.render('products')
})

app.listen(port, () => {
  console.log(`App is listening on port ${port}.`)
})
