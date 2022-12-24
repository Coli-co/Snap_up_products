const faker = require('faker')
const { Pool } = require('pg')
const configParams = require('../../config/pg')
const { db, Client } = require('../../models/index')

async function insertClientData(times) {
  const pool = await new Pool(configParams)
  try {
    for (let i = 0; i < times; i++) {
      const result = await Client.build({
        snapid: `${i + 1}`,
        name: `${faker.name.findName()}`,
        quantity: Math.floor(Math.random() * 3) + 1,
        amount: Math.floor(Math.random() * 10000)
      })
      await result.save()
    }
    console.log('All client data inserted successfully.')
  } catch (err) {
    console.log(err)
  }
  pool.end()
}

module.exports = { insertClientData }
