const productData = require('../../public/json/product.json').results
const configParams = require('../../config/pg')
const { Pool } = require('pg')

// async function processData(data) {}

async function insertData() {
  const pool = await new Pool(configParams)
  productData.forEach((item) => {
    const text = `INSERT INTO products (productname, description,featureone, featuretwo, featurethree, originprice, sellprice,img, quantity) VALUES ('${item.name}','${item.description}','${item.featureone}', '${item.featuretwo}', '${item.featurethree}', ${item.originprice},${item.sellprice},'${item.img}',${item.quantity})`

    pool.query(text)
  })
  await pool.end()
}

async function confirmInsert() {
  try {
    await insertData()
    console.log('All product data inserted successfully.')
  } catch (err) {
    console.log(err)
  }
}

confirmInsert()
