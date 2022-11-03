const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDB,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  // maximum number of clients the pool should contain,default:10
  max: 20,
  // number of milliseconds to wait before timing out when connecting a new client by default this is 0 which means no timeout
  idleTimeoutMillis: 30000,
  // number of milliseconds a client must sit idle in the pool and not be checked out before it is disconnected from the backend and discarded
  // default is 10000 (10 seconds)
  connectionTimeoutMillis: 10000
})

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }
  client.query('SELECT NOW()', (err, result) => {
    release()
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    console.log('Time with the pool:', result.rows[0]['now'])
  })
})

module.exports = pool
