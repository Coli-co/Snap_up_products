const { Pool } = require('pg')
const configParams = require('../config/pg')

// 檢查商品資訊 : id 、庫存、價格
async function productDetail(productId) {
  const pool = await new Pool(configParams)
  const text = `SELECT id, productname, sellprice, img, quantity FROM products WHERE id = ${productId}`
  const result = await pool.query(text)
  const snapProduct = result.rows[0] // 搶購商品 data
  return snapProduct
}

// 要檢查的snapper資訊 : snapnumber, quantity, amount
async function snapperStatusCheck(productId) {
  const pool = await new Pool(configParams)
  // 搶購商品資訊
  const snapProduct = await productDetail(productId)
  const price = snapProduct['sellprice']
  // 實搶購者名單資訊
  const text = `SELECT * FROM clients WHERE snapnumber IS NOT NULL`
  const result = await pool.query(text)
  const allSnapper = result.rows // 所有搶購者 data
  // 總搶購數量
  let totalQueryAmount = 0
  // 紀錄有資格的搶購者名單
  let qualifiedSnapper = []
  allSnapper.forEach((snapper, index) => {
    // 沒拿到搶購號碼
    if (snapper['snapnumber'] === '0') {
      snapper['snapstatus'] = '很抱歉 ! 您沒有被加入隊列中'
    } else if (
      // 有拿到號碼，餘額不足
      Number(snapper['snapnumber']) !== 0 &&
      Number(snapper['amount']) < price
    ) {
      snapper['snapstatus'] = '餘額不足、無法搶購 。'
    } else {
      // 有拿到號碼，且餘額足夠
      snapper['snapstatus'] = '排隊中，請耐心等候...'
      totalQueryAmount += Number(snapper['quantity'])
      qualifiedSnapper.push(snapper)
    }
  })
  return [allSnapper, qualifiedSnapper, totalQueryAmount]
}

// 將搶購者按照搶購號碼排序
async function qualifiedSnapperSort(productId) {
  const snapStatus = await snapperStatusCheck(productId)
  // 取得有資格搶購者名單
  const qualifiedSnapper = await snapStatus[1]

  // 按照搶購號碼遞增排序
  qualifiedSnapper.sort((a, b) => {
    return Number(a['snapnumber']) - Number(b['snapnumber'])
  })
  return qualifiedSnapper
}



// 更新商品庫存
async function updateProductStock(productId) {
  const pool = await new Pool(configParams)
  const snapProduct = await productDetail(productId)
  const qualifiedSnapper = await qualifiedSnapperSort(productId)
  // const productId = snapProduct['id']
  let stock = snapProduct['quantity'] // 商品庫存
  const searchQuery = `SELECT * FROM products WHERE id = $1`
  const updateQuery = `
      UPDATE products SET quantity = $1 WHERE id = $2
      `
  // 根據有資格的搶購者的搶購數量來更新搶購狀況
  try {
    qualifiedSnapper.forEach((snapper, index) => {
      let reqQuantity = Number(snapper['quantity'])

      //計算總搶購數量
      if (reqQuantity <= stock) {
        stock -= reqQuantity
        snapper['snapstatus'] = '恭喜您搶到商品'
      } else if (reqQuantity > stock) {
        snapper['snapstatus'] = '商品庫存不足'
      } else if (stock === 0) {
        snapper['snapstatus'] = '商品已搶購一空'
      }
    })
    // 更新 db 中商品庫存
    await pool.query(updateQuery, [stock, productId])
    console.log('Update product quantity is done!')
    // 查詢該商品資訊
    const queryProduct = await pool.query(searchQuery, [productId])
    const productInfo = queryProduct.rows[0]
    const restStock = productInfo.quantity
    console.log('restStock is:', restStock)
    return [qualifiedSnapper, productInfo]
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  productDetail,
  snapperStatusCheck,
  qualifiedSnapperSort,
  updateProductStock
}
