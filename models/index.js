require('dotenv').config()
const { Sequelize, DataTypes } = require('sequelize')

// Set up database with Sequelize

const sequelize = new Sequelize(
  `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDB}`,
  { dialect: 'postgres', logging: false }
)

// checking connection
sequelize
  .authenticate()
  .then(() => {
    console.log(`Database connected to ${process.env.PGDB}`)
  })
  .catch((err) => console.log(err))

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize
sequelize.sync() //synchorize all models

// connecting to model
db.users = require('./user')(sequelize, DataTypes)
db.products = require('./product')(sequelize, DataTypes)
db.clients = require('./client')(sequelize, DataTypes)
db.snapResults = require('./snapResult')(sequelize, DataTypes)

const User = db.users
const Product = db.products
const Client = db.clients
const snapResult = db.snapResults

module.exports = { db, Client, User, snapResult, Product }
