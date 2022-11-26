const { Pool } = require('pg')
const configParams = require('../config/pg')

async function snapSequence(maxvalue) {
  const text = `
  DROP SEQUENCE IF EXISTS order_id;
  CREATE SEQUENCE order_id
  INCREMENT 1
  MINVALUE 1
  MAXVALUE ${maxvalue}
  START 1;
  `
  const pool = new Pool(configParams)
  await pool.query(text)
  console.log('Order id sequence created.')
  pool.end()
}

snapSequence(60)

module.exports = snapSequence
