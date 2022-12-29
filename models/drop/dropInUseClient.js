const { Pool } = require('pg')
const configParams = require('../../config/pg')

// Delete clients already in use
async function dropInUseClientTable() {
  const pool = await new Pool(configParams)
  const text = `DELETE FROM clients`
  await pool.query(text)
  console.log('clients table data cleared!')
  pool.end()
}

module.exports = dropInUseClientTable
