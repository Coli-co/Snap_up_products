const CronJob = require('cron').CronJob
const express = require('express')
const app = express()
const db = require('../config/queries')

const job = new CronJob(
  '0 26 14 * * *',
  function () {
    console.log(`execute time : ${new Date()}`)
    try {
      for (let i = 0; i < 5; i++) {
        const result = app.put(
          'http://localhost:3000/products/2',
          db.updateProduct
        )
        // console.log(`done-${i}`)
        console.log('result is:', result)
      }
    } catch (err) {
      console.log('cron job err is:', err)
    }
  },
  null,
  true
)

// job.start()
