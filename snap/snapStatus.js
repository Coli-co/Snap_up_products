const { Pool } = require('pg')
const configParams = require('../config/pg')
const { snapResult } = require('../models/index')
const axios = require('axios')

// 檢查商品資訊 : id 、庫存、價格
async function productDetail(productId) {
  const pool = await new Pool(configParams)
  const text = `SELECT id, productname, sellprice, img, quantity FROM products WHERE id = ${productId}`
  const result = await pool.query(text)
  const snapProduct = result.rows[0] // 搶購商品 data
  return snapProduct
}

async function getSnappers() {
  try {
    const data = await snapResult.findAll({
      order: [['updatedAt', 'ASC']],
      raw: true
    })
    return data
  } catch (err) {
    console.log(err)
  }
}

// add amount and quantity key to snapper
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

function sendRequestToQueue(productId, times) {
  for (let i = 0; i < times; i++) {
    axios.post(`${process.env.BASE_URL}/products/${productId}`)
  }
}

module.exports = {
  productDetail,
  getSnappers,
  addAmountAndQuantityToSnapper,
  sendRequestToQueue
}
