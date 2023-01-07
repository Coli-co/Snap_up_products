const AWS = require('aws-sdk')
require('dotenv').config()
const { Pool } = require('pg')

const configParams = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDB,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000
}

const config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.region
}
AWS.config.update(config)

const producerSQS = new AWS.SQS({ apiVersion: '2022/11/15' })
const queueURL = process.env.FifoQueue

const params = {}

let clientNumber = 0

// Calling the listQueues operation
producerSQS.listQueues(params, function (err, data) {
  if (err) {
    console.log('Error', err)
  } else {
    console.log('ListQueues is done.')
  }
})

async function getClients() {
  const pool = await new Pool(configParams)
  const query = `SELECT * FROM clients`
  try {
    const results = await pool.query(query)
    const data = results.rows
    // console.log('data is:', data)
    return data
  } catch (err) {
    console.log(err)
  }
}

// product info - 測試用
async function productInfo(productId) {
  const pool = await new Pool(configParams)
  const query = `SELECT * FROM products WHERE id = $1`

  // 先檢查商品庫存是否還有
  const results = await pool.query(query, [productId])
  // const originalStock = results.rows[0].quantity //原本庫存
  // let restStock = results.rows[0].quantity // 剩餘庫存
  let productName = results.rows[0].productname

  return [productName]
}

// send request
async function sendRequest(i, productId) {
  const client = await getClients()
  const product = await productInfo(productId)

  const posMsgParams = {
    DelaySeconds: 0,
    MessageAttributes: {
      Product: {
        DataType: 'String',
        StringValue: 'Snap Product '
      }
    },
    MessageBody: `${client[i]['name']}-${product[0]} `,
    MessageGroupId: `SnapGroupId0${i + 1}`,
    MessageDeduplicationId: `DeId${i + 1}`,
    QueueUrl: queueURL
  }
  const data = await producerSQS.sendMessage(
    posMsgParams,
    function (err, data) {
      if (err) {
        console.log('Error', err)
      } else {
        console.log('Send request to SQS is successful.')
      }
    }
  )
  console.log(data.params.MessageBody)
}

function multipleRequest(id) {
  sendRequest(clientNumber, id)
  clientNumber += 1
}

module.exports = { multipleRequest }
