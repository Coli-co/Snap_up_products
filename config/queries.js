const { Pool, Client } = require('pg')
const configParams = require('./pg')
// const CronJob = require('cron').CronJob
const snapSequence = require('../sequences/orderId')
const { sendRequest, getRequestTime } = require('../aws/producer')
const { receiveAndDeleteMsg, getResponseTime } = require('../aws/consumer')
const { emptyStock } = require('../helper/emptyStock')
const {
  generateSnapNumber,
  randomIdDistribute,
  getSnapNumber
} = require('../snap/snapProcedure')
const {
  productDetail,
  snapperStatusCheck,
  qualifiedSnapperSort,
  updateProductStock
} = require('../snap/snapStatus')

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
let productStock = [] //紀錄商品庫存
let recordTime = []
let snapUpResponse = [] // sqs回應消息
let productMsg = [] // 搶商品狀態消息
let renewDBtime = [] //更新 DB 時間

// PUT updated data in an existing product quantity
const updateProduct = async (req, res) => {
  const pool = new Pool(configParams)
  // we don't need to dispose of the client
  const client = await pool.connect()
  const productId = parseInt(req.params.id)

  // const quantity = parseInt(req.body.count)
  // check rest of quantity of product
  const query = `SELECT quantity FROM products WHERE id = $1`

  // 先檢查商品庫存是否還有
  const results = await pool.query(query, [productId])
  let restStock = results.rows[0].quantity
  console.log('original stock is:', restStock)

  try {
    if (restStock > 0) {
      // record request time
      // start sqs
      // const result = await sendRequest()
      // const requestTime = await getRequestTime()
      const requestTime = getRequestTime()
      const requestDate = requestTime[0]
      // console.log('main requestDate is:', requestDate)

      // // polling message
      // await receiveAndDeleteMsg()

      // const responseTime = await getResponseTime()
      const responseTime = getResponseTime()
      const responseDate = responseTime[0]
      // console.log('main responseDate is:', responseDate)
      const reqAndResDiff = new Date(responseDate - requestDate)
      const secDiff = reqAndResDiff.getSeconds()
      const millsecDiff = reqAndResDiff.getMilliseconds()
      // console.log('secDiff is:', secDiff)
      // console.log('millsecDiff is:', millsecDiff)
      recordTime.push(`${secDiff}:${millsecDiff}`)

      //產生要分配給搶購者的序列號碼，
      await snapSequence(60)

      // 前者為預訂搶購名額，後者為實際搶購名額
      const snapBox = await generateSnapNumber(60, 88)
      // 產生隨機搶購者 (隨機 id)
      const randomIdGroup = await randomIdDistribute(88)

      // 分發搶購號碼給搶購者
      await getSnapNumber(snapBox, randomIdGroup)

      // 當收到 request 並處理完 queue 的 request 時
      // 先給予使用者回應
      // snapUpResponse.push('您的訂單已送出，請耐心等候 !')
      const product = await productDetail(productId)

      const snapperStatus = await snapperStatusCheck(productId)
      const allSnapper = snapperStatus[0]
      const totalQueryAmount = snapperStatus[2]

      const qualifiedSnapper = await qualifiedSnapperSort(productId)

      //[allSnapper, qualifiedSnapper, totalQueryAmount]

      const result = await updateProductStock(productId)
      const qualifiedSnapperUpdate = result[0]
      const productInfo = result[1]
      // [qualifiedSnapper, productInfo]

      // 處理完sqs訊息才能去 db 更動資料
      // update product stock
      // const results = await pool.query(query, [id])

      //   // const time = new Date()
      //   // const renewDBdate = new Date(time - reqAndResDiff)
      //   // const DBsecDiff = renewDBdate.getSeconds()
      //   // const DBmillsecDiff = renewDBdate.getMilliseconds()
      //   // console.log('DBsecDiff is:', secDiff)
      //   // console.log('DBmillsecDiff is:', millsecDiff)
      //   // console.log('-------------')
      //   // renewDBtime.push(`${DBsecDiff}:${DBmillsecDiff}`)
      // }
      return res.render('snapup', {
        product,
        totalQueryAmount,
        productInfo,
        allSnapper,
        qualifiedSnapper,
        qualifiedSnapperUpdate
      })
      // return res.render('snapup', {
      //   productStock,
      //   recordTime,
      //   snapUpResponse,
      //   getProductMsg,
      //   renewDBtime
      // })
    }

    if (restStock === 0) {
      const text = `SELECT * FROM products WHERE id = $1`
      const result = await pool.query(text, [productId])
      const emptyProduct = result.rows[0]
      // console.log('produc is:', product)
      // productMsg.push('本商品已搶購一空 !')
      return res.render('snapup', {
        emptyStock,
        restStock,
        emptyProduct
      })
    }
  } catch (err) {
    console.log('err is:', err)

    // await client.query('ROLLBACK')
    // console.log('transaction err is:', err)
    // return res.render('snapup', {
    //   productStock,
    //   recordTime,
    //   snapUpResponse,
    //   productMsg,
    //   renewDBtime
    // })
    // error: new row for relation "products" violates check constraint "products_quantity_check"
  }
  // finally {
  //   client.release()
  // }
}

module.exports = { getProducts, getProductById, updateProduct }
