const express = require('express')

require('dotenv').config()
const PORT = process.env.PORT
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')

const path = require('path')
const db = require('./config/queries')
const userDB = require('./models/index')
const userRoutes = require('./routes/userRoutes')

const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(cookieParser())


// routes for the user API
app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/products', db.getProducts)

app.get('/products/:id', db.getProductById)

app.put('/products/:id', db.updateProduct)

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}.`)
})
