const { Pool } = require('pg')
const configParams = require('../config/pg')
const { sendRequest } = require('../aws/producer')
const { recordTime, diffTime } = require('../aws/recordTime')
const { getLogData } = require('../aws/lambdaLog')

async function getPreResponse() {
  const pool = await new Pool(configParams)

  // 實際搶購者名單資訊
  const text = `SELECT * FROM clients WHERE snapnumber IS NOT NULL`
  const result = await pool.query(text)
  const allSnapper = result.rows // 所有搶購者 data

  // 紀錄同一時間發出 request 時間
  let requestTime = recordTime()
  const requestDate = requestTime[0]

  allSnapper.forEach((snapper) => {
    // 向 aws sqs 發出 request，並觸發 lambda 擷取 log
    getLogData(sendRequest())

    // 紀錄每位搶購者收到 response 時間
    let responseTime = recordTime()
    let responseDate = responseTime[0]
    let getResponseTime = diffTime(requestDate, responseDate)

    snapper['requestDate'] = requestDate
    snapper['getResMessage'] = '您的訂單已送出。'
    snapper['getResponseTime'] = `${getResponseTime[0]}:${getResponseTime[1]}`
  })

  return allSnapper
}

module.exports = { getPreResponse }
