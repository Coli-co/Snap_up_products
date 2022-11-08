const data = require('../../public/json/product.json').results
const { pool } = require('../../config/pg')

async function processData(data) {
  data.forEach((item) => {
    const text = `INSERT INTO products (productname, description,featureone, featuretwo, featurethree, originprice, sellprice,img,	quantity) VALUES ('${item.name}','${item.description}','${item.featureone}', '${item.featuretwo}', '${item.featurethree}', ${item.originprice},${item.sellprice},'${item.img}',${item.quantity})`
    1
    pool.query(text, (err, res) => {
      if (err) {
        console.log(err)
      }
      console.log('Data insert successfully.')
    })
  })
  pool.end()
}

processData()
