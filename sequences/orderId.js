const { Pool } = require('pg')
const configParams = require('../config/pg')

async function snapSequence(maxvalue) {
  const drop = `DROP SEQUENCE IF EXISTS order_id;`
  const text = `
  CREATE SEQUENCE order_id
  INCREMENT 1
  MINVALUE 1
  MAXVALUE ${maxvalue}
  START 1;
  `

  const pool = new Pool(configParams)
  await pool.query(drop)
  await pool.query(text)
  console.log('Order id sequence created.')
}

module.exports = snapSequence
