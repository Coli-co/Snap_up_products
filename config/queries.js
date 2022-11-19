const { Pool } = require('pg')
const configParams = require('./pg')

const { sendRequest, getRequestTime } = require('../aws/producer')
const { receiveAndDeleteMsg, getResponseTime } = require('../aws/consumer')

// GET all products
const getProducts = async (req, res) => {
  const pool = new Pool(configParams)
  const query = `SELECT * FROM products ORDER BY id ASC`
  try {
    const results = await pool.query(query)
    const data = results.rows
    res.render('products', { data })
  } catch (err) {
    console.log(err)
  }
}

// GET each product by ID
const getProductById = async (req, res) => {
  const id = parseInt(req.params.id)
  const pool = new Pool(configParams)
  const query = `SELECT * FROM products WHERE id = $1`

  try {
    const results = await pool.query(query, [id])
    const data = results.rows
    return res.render('detail', { data })
  } catch (err) {
    console.log(err)
  }
}

// record request time
let recordTime = []
let snapUpResponse = [] // sqs回應消息
let getProductMsg = [] // 搶商品狀態消息
let renewDBtime = [] //更新 DB 時間
// PUT updated data in an existing product quantity
const updateProduct = async (req, res) => {
  const pool = new Pool(configParams)
  const id = parseInt(req.params.id)
  const quantity = parseInt(req.body.count)
  // check rest of quantity of product
  // let restStock = 0
  const query = `SELECT quantity FROM products WHERE id = $1`
  const updateQuery = `UPDATE products SET quantity = $1 WHERE id = $2`

  // 先檢查庫存是否還有
  const results = await pool.query(query, [id])
  let restStock = results.rows[0].quantity
  console.log('reststock is:', typeof restStock)
  console.log('quantity is:', typeof quantity)
  try {
    if (restStock > 0) {
      if (restStock < quantity) {
        recordTime.push('--')
        snapUpResponse.push('--')
        renewDBtime.push('--')
        getProductMsg.push('本商品數量不足 !')

        return res.render('snapup', {
          recordTime,
          snapUpResponse,
          getProductMsg,
          renewDBtime
        })
      }

      // record request time
      // start sqs
      const result = await sendRequest()
      const requestTime = await getRequestTime()
      const requestDate = requestTime[0]
      console.log('main requestDate is:', requestDate)

      // polling message
      await receiveAndDeleteMsg()

      const responseTime = await getResponseTime()
      const responseDate = responseTime[0]
      console.log('main responseDate is:', responseDate)
      const reqAndResDiff = new Date(responseDate - requestDate)
      const secDiff = reqAndResDiff.getSeconds()
      const millsecDiff = reqAndResDiff.getMilliseconds()
      console.log('secDiff is:', secDiff)
      console.log('millsecDiff is:', millsecDiff)
      recordTime.push(`${secDiff}:${millsecDiff}`)

      // 當收到 request 並處理完 queue 的 request 時
      // 先給予使用者回應
      snapUpResponse.push('您的訂單已送出，請耐心等候 !')

      // 處理完sqs訊息才能去 db 更動資料
      // update product stock
      // const results = await pool.query(query, [id])
      restStock = results.rows[0].quantity - quantity
      const updateDB = await pool.query(updateQuery, [restStock, id])
      //  db 更新完資料，給予使用者回應
      getProductMsg.push('恭喜您搶到商品 !')
      const time = new Date()
      const renewDBdate = new Date(time - reqAndResDiff)
      const DBsecDiff = renewDBdate.getSeconds()
      const DBmillsecDiff = renewDBdate.getMilliseconds()
      console.log('DBsecDiff is:', secDiff)
      console.log('DBmillsecDiff is:', millsecDiff)
      renewDBtime.push(`${DBsecDiff}:${DBmillsecDiff}`)

      return res.render('snapup', {
        recordTime,
        snapUpResponse,
        getProductMsg,
        renewDBtime
      })
    }

    if (restStock === 0) {
      recordTime.push('--')
      snapUpResponse.push('--')
      renewDBtime.push('--')
      getProductMsg.push('本商品已搶購一空 !')

      return res.render('snapup', {
        recordTime,
        snapUpResponse,
        getProductMsg,
        renewDBtime
      })
    }
  } catch (err) {
    console.log(err)
    return res.render('snapup', {
      recordTime,
      snapUpResponse,
      getProductMsg,
      renewDBtime
    })
    // error: new row for relation "products" violates check constraint "products_quantity_check"
  }
}

module.exports = { getProducts, getProductById, updateProduct }
