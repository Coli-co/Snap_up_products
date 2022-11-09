const { Pool } = require('pg')
const configParams = require('../config/pg')

const text = `CREATE TABLE products (
                id SERIAL ,
                productname VARCHAR(60) NOT NULL,
                description VARCHAR(330) NOT NULL,
                featureone VARCHAR(100) NOT NULL,
                featuretwo VARCHAR(100) NOT NULL,
                featurethree VARCHAR(100) NOT NULL,
                originprice integer NOT NULL,
                sellprice integer NOT NULL,
                img VARCHAR(100) NOT NULL,
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
