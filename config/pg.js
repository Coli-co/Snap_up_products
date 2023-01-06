const { Pool } = require('pg')
require('dotenv').config()

const configParams = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDB,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000
}

// create pg connection
async function pgConnect() {
  const pool = new Pool(configParams)
  try {
    const now = await pool.query('SELECT NOW()')
    await pool.end()
    return now
  } catch (err) {
    console.log(err.stack)
  }
}

const connect = (async () => {
  const res = await pgConnect()
  console.log('Connect with the pool:', res.rows[0]['now'])
})()

module.exports = configParams
