const { Pool } = require('pg')
const configParams = require('../config/pg')

async function dropSequence() {
  const drop = `DROP SEQUENCE IF EXISTS order_id;`
  const pool = new Pool(configParams)
  await pool.query(drop)
  console.log('Order id sequence dropped.')
}

async function snapSequence(maxvalue) {
  const text = `
  CREATE SEQUENCE order_id
  INCREMENT 1
  MINVALUE 1
  MAXVALUE ${maxvalue}
  START 1;
  `

  const pool = new Pool(configParams)

  await pool.query(text)
  console.log('Order id sequence created.')
}

module.exports = { dropSequence, snapSequence }
