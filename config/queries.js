const { Pool } = require('pg')
const configParams = require('./pg')
// const dropInUseClientTable = require('../models/drop/dropInUseClient')
// const { insertClientData } = require('../models/seeds/clientSeeder')
// const { dropSequence, snapSequence } = require('../sequences/orderId')
const { Client, snapResult } = require('../models/index')
const { sendRequest, multipleRequest } = require('../aws/producer')
// console.log('insertClientData:', insertClientData)
const {
  emptyStock,
  hasDBProcessTimeKey,
  dbTimeFormatTrans,
  notEnoughAmountCount,
  snapperSuccessCount
} = require('../helper/handlebarsHelper')
// const {
//   generateSnapNumber,
//   randomIdDistribute,
//   getSnapNumber
// } = require('../snap/snapProcedure')
// const { getSnappers } = require('../test')
const {
  productDetail,
  addAmountAndQuantityToSnapper,
  getSnappers
  // snapperStatusCheck,
  // qualifiedSnapperSort,
  // updateProductStock
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

// PUT updated data in an existing product quantity
const updateProduct = async (req, res) => {
  const productId = req.params.id
  // sendRequest(times, productId)
  const pool = new Pool(configParams)
  // // 先檢查商品庫存是否還有
  const query = `SELECT * FROM products WHERE id = $1`
  const results = await pool.query(query, [productId])
  const originalStock = results.rows[0].quantity //原本庫存
  // send multiple request to queue
  // await multipleRequest(5, productId)

  // const pool = await new Pool(configParams)
  // get snapper data
  const allSnapper = await getSnappers()
  const totalSnapperCount = allSnapper.length
  const wholePropertiesSnapper = await addAmountAndQuantityToSnapper(allSnapper)
  // const snapperQuantityBox = await snapperQuantity(allSnapper)
  // id,name, getResponse
  // // we don't need to dispose of the client

  // const productId = parseInt(req.params.id)

  // // const quantity = parseInt(req.body.count)
  // // check rest of quantity of product
  const product = await productDetail(productId)
  const restStock = results.rows[0].quantity // 剩餘庫存

  // let productName = results.rows[0].productname

  // try {
  //   if (restStock > 0) {

  //     // 搶購之前，先給予使用者初步回應，讓使用者不會等太久
  //     // 之後去檢查每位搶購者是否具備資格
  //     // const snapperStatus = await snapperStatusCheck(productId)
  //     // const allSnapper = snapperStatus[0] // 所有搶購者
  //     // // console.log('allSnapper:', allSnapper)
  //     // const totalSnapperCount = allSnapper.length
  //     // const qualifiedSnapper = snapperStatus[1] // 具備資格的搶購者
  //     // const qualifiedSnapperCount = qualifiedSnapper.length
  //     // const totalQueryAmount = snapperStatus[2] // 總搶購數量
  //     // const notInLineSnapperCount = snapperStatus[3].length // 未入隊列的搶購者
  //     // const notEnoughAmountCount = snapperStatus[4].length // 餘額不足的搶購者

  //     // // 更新 DB 資料
  //     // const result = await updateProductStock(productId, qualifiedSnapper)
  //     // const qualifiedSnapperUpdate = result[0]
  //     // const productInfo = result[1]
  //     // const getProductSnapperCount = result[2].length
  //     // const nonGetProductSnapperCount = result[3].length

  return res.render('snapup', {
    wholePropertiesSnapper,
    totalSnapperCount,
    originalStock,
    restStock,
    // product,
    // totalQueryAmount,
    product,
    notEnoughAmountCount,
    snapperSuccessCount,

    // qualifiedSnapper,
    // qualifiedSnapperUpdate,
    // emptyStock
    hasDBProcessTimeKey,
    dbTimeFormatTrans

    // qualifiedSnapperCount,
    // notInLineSnapperCount,
    // notEnoughAmountCount,
    // getProductSnapperCount,
    // nonGetProductSnapperCount
  })
}

//   if (restStock === 0) {
//     const text = `SELECT * FROM products WHERE id = $1`
//     const result = await pool.query(text, [productId])
//     const emptyProduct = result.rows[0]

//     return res.render('snapup', {
//       originalStock,
//       emptyStock,
//       restStock,
//       emptyProduct
//     })
//   }
// } catch (err) {
//   console.log('err is:', err)
// }
// finally {
//   await Client.destroy({ where: {}, truncate: true })
//   // await dropSequence()
//   // await dropInUseClientTable
//   console.log('Clients table data cleared.')
//   // await Client
// }
// }

module.exports = { getProducts, getProductById, updateProduct }
