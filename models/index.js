require('dotenv').config()
const { Sequelize, DataTypes } = require('sequelize')

// Set up database with Sequelize

const sequelize = new Sequelize(
  `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@localhost:${process.env.PGPORT}/${process.env.PGDB}`,
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

// connecting to user model
db.users = require('./user')(sequelize, DataTypes)

module.exports = db
