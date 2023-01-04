const productData = require('../../public/json/product.json').results
const { Pool } = require('pg')
const configParams = require('../../config/pg')
const { Product } = require('../../models/index')

async function insertProductData() {
  const pool = await new Pool(configParams)

  try {
    for (let i = 0; i < productData.length; i++) {
      const result = await Product.create({
        productname: productData[i].name,
        description: productData[i].description,
        featureone: productData[i].featureone,
        featuretwo: productData[i].featuretwo,
        featurethree: productData[i].featurethree,
        originprice: productData[i].originprice,
        sellprice: productData[i].sellprice,
        img: productData[i].img,
        quantity: productData[i].quantity
      })
      await result.save()
    }
    console.log('All product data inserted successfully.')
  } catch (err) {
    console.log(err)
  }
  await pool.end()
}

insertProductData()
