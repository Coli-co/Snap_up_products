const { Pool } = require('pg')
const configParams = require('../config/pg')
const { recordTime, diffTime } = require('../aws/recordTime')
const { getPreResponse } = require('./getPreMsg')

// 檢查商品資訊 : id 、庫存、價格
async function productDetail(productId) {
  const pool = await new Pool(configParams)
  const text = `SELECT id, productname, sellprice, img, quantity FROM products WHERE id = ${productId}`
  const result = await pool.query(text)
  const snapProduct = result.rows[0] // 搶購商品 data
  return snapProduct
}

const getSnappers = async (req, res) => {
  const pool = await new Pool(configParams)
  const query = `SELECT * FROM snapresults ORDER BY id ASC`
  try {
    const results = await pool.query(query)
    const data = results.rows
    // console.log('data is:', data)
    return data
  } catch (err) {
    console.log(err)
  }
}

// 查詢 snapper amount
async function addAmountAndQuantityToSnapper(allSnapper) {
  const pool = await new Pool(configParams)
  for (let i = 0; i < allSnapper.length; i++) {
    const text = `SELECT amount, quantity FROM clients WHERE name = '${allSnapper[i]['name']}'`
    const result = await pool.query(text)
    const amount = result.rows[0].amount
    const quantity = result.rows[0].quantity
    allSnapper[i]['amount'] = amount
    allSnapper[i]['quantity'] = quantity
  }
  return allSnapper
}

// 查詢 snaper amount
// async function snapperQuantity(allSnapper) {
//   const quantityBox = []
//   const pool = await new Pool(configParams)
//   for (let i = 0; i < allSnapper.length; i++) {
//     const text = `SELECT quantity FROM clients WHERE name = '${allSnapper[i]['name']}'`
//     const result = await pool.query(text)
//     const quantity = result.rows[0].quantity
//     quantityBox.push(quantity)
//   }

//   return quantityBox
// }

// 要檢查的snapper資訊 : snapNumber, quantity, amount
// async function snapperStatusCheck(productId) {
//   const pool = await new Pool(configParams)
//   // 搶購商品資訊
//   const snapProduct = await productDetail(productId)
//   const price = snapProduct['sellprice']
//   // 實際搶購者名單資訊
//   const text = `SELECT * FROM clients WHERE snapnumber IS NOT NULL`
//   const result = await pool.query(text)
//   // console.log('result:', result.rows)
//   // console.log('original allSnapper:', result.rows)
//   // const allSnapper = result.rows // 所有搶購者 data
//   // 總搶購數量
//   let totalQueryAmount = 0
//   // 紀錄有資格的搶購者名單
//   let qualifiedSnapper = []
//   // 紀錄餘額不足的搶購者名單
//   let notEnoughAmount = []
//   // 紀錄未入隊列的搶購者名單
//   let notInLine = []

//   // 給予搶購者初步回應之後，再去確認搶購者資訊
//   const getPreResponseSnapper = await getPreResponse()

//   getPreResponseSnapper.forEach((snapper) => {
//     // 沒拿到搶購號碼
//     if (snapper['snapnumber'] === '0') {
//       snapper['snapStatus'] = '很抱歉 ! 您沒有被加入隊列中'
//       snapper['dbProcessTime'] = '0:000' // 不具備資格，不用給 DB 處理
//       notInLine.push(snapper)
//     } else if (
//       // 有拿到號碼，餘額不足
//       Number(snapper['snapnumber']) !== 0 &&
//       Number(snapper['amount']) < price
//     ) {
//       snapper['snapStatus'] = '餘額不足、無法搶購 。'
//       snapper['dbProcessTime'] = '0:000'
//       notEnoughAmount.push(snapper)
//     } else {
//       // 有拿到號碼，且餘額足夠
//       snapper['snapStatus'] = '排隊中，請耐心等候...'
//       totalQueryAmount += Number(snapper['quantity'])
//       qualifiedSnapper.push(snapper)
//     }
//   })
//   // 按照搶購號碼遞增排序
//   const qualifiedSnapperSort = qualifiedSnapper.sort((a, b) => {
//     return Number(a['snapnumber']) - Number(b['snapnumber'])
//   })

//   return [
//     getPreResponseSnapper,
//     qualifiedSnapperSort,
//     totalQueryAmount,
//     notInLine,
//     notEnoughAmount
//   ]
// }

// snapperStatusCheck(2)
// 更新商品庫存
// async function updateProductStock(productId, qualifiedSnapper) {
//   const pool = await new Pool(configParams)
//   const snapProduct = await productDetail(productId)
//   let stock = snapProduct['quantity'] // 商品庫存
//   const searchQuery = `SELECT * FROM products WHERE id = $1`
//   const updateQuery = `
//       UPDATE products SET quantity = $1 WHERE id = $2
//       `
//   let getProduct = [] // 搶到商品的搶購名單
//   let nonGetProduct = [] //未搶到商品的搶購名單

//   // 根據有資格的搶購者的搶購數量來更新搶購狀況
//   try {
//     qualifiedSnapper.forEach((snapper, index) => {
//       let reqQuantity = Number(snapper['quantity'])

//       //計算總搶購數量
//       if (reqQuantity <= stock) {
//         stock -= reqQuantity
//         snapper['snapStatus'] = '恭喜您搶到商品'
//         // 更新 db 中商品庫存
//         pool.query(updateQuery, [stock, productId])
//         getProduct.push(snapper)
//       } else if (reqQuantity > stock) {
//         snapper['snapStatus'] = '商品庫存不足'
//         nonGetProduct.push(snapper)
//       } else if (stock === 0) {
//         snapper['snapStatus'] = '商品已搶購一空'
//       }
//       // // 更新 db 中商品庫存
//       // pool.query(updateQuery, [stock, productId])
//       // 紀錄 db 處理時間
//       let dbProcessMsgTime = recordTime()
//       let dbProcessMsgDate = dbProcessMsgTime[0]
//       let dbResponseTime = diffTime(snapper['requestDate'], dbProcessMsgDate)
//       // 紀錄更新資料完的時間
//       snapper['dbProcessTime'] = `${dbResponseTime[0]}:${dbResponseTime[1]}`
//     })
//     // // 更新 db 中商品庫存
//     // await pool.query(updateQuery, [stock, productId])
//     console.log('Update product quantity is done!')

//     // // 把 db處理每位 client 的訂單時間紀錄於 table

//     // // 紀錄 db 處理時間
//     // let dbProcessMsgTime = recordTime()
//     // let dbProcessMsgDate = dbProcessMsgTime[0]

//     // qualifiedSnapper.forEach((snapper) => {
//     //   let dbResponseTime = diffTime(snapper['requestDate'], dbProcessMsgDate)
//     //   // 紀錄更新資料完的時間
//     //   snapper['dbProcessTime'] = `${dbResponseTime[0]}:${dbResponseTime[1]}`
//     // })

//     // 查詢該商品資訊
//     const queryProduct = await pool.query(searchQuery, [productId])
//     const productInfo = queryProduct.rows[0]
//     const restStock = productInfo.quantity
//     console.log('restStock is:', restStock)
//     return [qualifiedSnapper, productInfo, getProduct, nonGetProduct]
//   } catch (err) {
//     console.log(err)
//   }
// }

module.exports = {
  productDetail,
  getSnappers,
  addAmountAndQuantityToSnapper
  // snapperQuantity
  // snapperStatusCheck,
  // updateProductStock
}
