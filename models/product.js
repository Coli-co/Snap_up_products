const { Pool } = require('pg')
const configParams = require('../config/pg')

const textone = `DROP TABLE IF EXISTS products`
const texttwo = `CREATE TABLE products (
                id SERIAL ,
                productname TEXT NOT NULL,
                description TEXT NOT NULL,
                featureone TEXT NOT NULL,
                featuretwo TEXT NOT NULL,
                featurethree TEXT NOT NULL,
                originprice integer NOT NULL,
                sellprice integer NOT NULL,
                img TEXT NOT NULL,
                quantity integer NOT NULL CHECK (quantity >= 0),
                PRIMARY KEY (id)
                );`

const createTable = async function (queryone, querytwo) {
  try {
    const pool = new Pool(configParams)
    await pool.query(queryone)
    await pool.query(querytwo)
    console.log('Table is successfully created.')
    pool.end()
  } catch (err) {
    console.log(err)
  }
}

createTable(textone, texttwo)
