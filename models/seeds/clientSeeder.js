const configParams = require('../../config/pg')
const { Pool } = require('pg')
const faker = require('faker')
const db = require('../../models/index')

//client schema
const Client = db.clients

async function insertData() {
  const pool = await new Pool(configParams)
  for (let i = 0; i < 100; i++) {
    const client = await Client.build({
      name: `${faker.name.findName()}`,
      quantity: Math.floor(Math.random() * 3) + 1,
      amount: `${faker.finance.account(4)}`
    })
    await client.save()
  }

  await pool.end()
}

async function confirmInsert() {
  try {
    await insertData()
    console.log('All client data inserted successfully.')
  } catch (err) {
    console.log(err)
  }
}

confirmInsert()
