const faker = require('faker')
const { Pool } = require('pg')
const configParams = require('../../config/pg')
const { Client } = require('../../models/index')

async function insertClientData(times) {
  const pool = await new Pool(configParams)
  try {
    for (let i = 0; i < times; i++) {
      const result = await Client.build({
        name: `${faker.name.findName()}`.replace('.', '').replace("'", ''),
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

insertClientData(30)

module.exports = { insertClientData }
