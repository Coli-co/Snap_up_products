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
const userAuth = require('./Middleware/userAuth')

const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(cookieParser(process.env.secret))
// check login status by cookies
app.use((req, res, next) => {
  const token = req.signedCookies.provesnpm
  if (token) {
    // return true for render views template
    res.locals.isAuthenticated = true
  }
  next()
})

// routes for the user API
app.use('/users', userRoutes)

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/products', db.getProducts)

app.get('/products/:id', userAuth.checkToken, db.getProductById)

app.put('/products/:id', userAuth.checkToken, db.updateProduct)

app.get('/users/register', (req, res) => {
  res.render('register')
})

app.get('/users/login', (req, res) => {
  res.render('login')
})

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}.`)
})
