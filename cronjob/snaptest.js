const db = require('../config/queries')

function test() {
  console.log(`execute time : ${new Date()}`)

  for (let i = 0; i < 1; i++) {
    try {
      db.updateProduct()
    } catch (err) {
      console.log('cron job err is:', err)
    }
  }
}

test()
