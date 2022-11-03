const data = require('../../public/json/product.json').results
const pool = require('../../config/pg')

function processData() {
  data.forEach((item) => {
    const text = `INSERT INTO products (productname, description,feature, originprice, sellprice,img,	quantity) VALUES ('${item.name}','${item.description}','${item.feature}',${item.originprice},${item.sellprice},'${item.img}',${item.quantity})`

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
