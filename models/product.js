const { Pool } = require('pg')
const configParams = require('../config/pg')

const text = `CREATE TABLE products (
                id SERIAL ,
                productname TEXT NOT NULL,
                description TEXT NOT NULL,
                featureone TEXT NOT NULL,
                featuretwo TEXT NOT NULL,
                featurethree TEXT NOT NULL,
                originprice integer NOT NULL,
                sellprice integer NOT NULL,
                img TEXT NOT NULL,
                quantity integer NOT NULL,
                PRIMARY KEY (id)
                );`

const createTable = async function (query) {
  try {
    const pool = new Pool(configParams)
    await pool.query(text)
    console.log('Table is successfully created.')
    pool.end()
  } catch (err) {
    console.log(err)
  }
}

createTable(text)
