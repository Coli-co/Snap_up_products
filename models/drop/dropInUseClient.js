const { Pool } = require('pg')
const configParams = require('../../config/pg')

// Delete clients already in use
async function dropInUseClientTable() {
  const pool = await new Pool(configParams)
  const text = `DROP TABLE IF EXISTS clients`
  await pool.query(text)
  console.log('clients table dropped!')
  pool.end()
}

dropInUseClientTable()

module.exports = dropInUseClientTable
