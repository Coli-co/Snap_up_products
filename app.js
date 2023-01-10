const express = require('express')
require('dotenv').config()
const PORT = process.env.PORT
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const path = require('path')

const routes = require('./routes')
const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(flash())
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(cookieParser(process.env.secret))

// setup session by enabling cookieParser
app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false
  })
)

// check login status by cookies
app.use((req, res, next) => {
  const token = req.signedCookies.provesnpm
  if (token) {
    // return true for render views template
    res.locals.isAuthenticated = true
  }
  // set message to remind user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}.`)
})
