const { Pool } = require('pg')
require('dotenv').config()

const configParams = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDB,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  // maximum number of clients the pool should contain,default:10
  max: 20,
  // number of milliseconds to wait before timing out when connecting a new client
  // default : 0
  idleTimeoutMillis: 30000,
  // number of milliseconds a client must sit idle in the pool and not be checked out before it is disconnected from the backend and discarded
  // default is 10000 (10 seconds)
  connectionTimeoutMillis: 10000
}

// create pg connection
const pool = async function pgConnect() {
  const pool = new Pool(configParams)
  const client = await pool.connect()
  try {
    const res = await pool.query('SELECT NOW()')
    console.log('Time with the pool:', res.rows[0]['now'])
  } catch (err) {
    console.log(err.stack)
  } finally {
    client.release()
  }
}

module.exports = pool
