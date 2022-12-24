const { Pool } = require('pg')
const configParams = require('../config/pg')
const { sendRequest } = require('../aws/producer')
const { recordTime, diffTime } = require('../aws/recordTime')
const { getLogData } = require('../aws/lambdaLog')

async function getPreResponse() {
  const pool = await new Pool(configParams)

  // 實際搶購者名單資訊
  const text = `SELECT * FROM clients WHERE snapNumber IS NOT NULL`
  const result = await pool.query(text)
  const allSnapper = result.rows // 所有搶購者 data
  // 根據搶購號碼順序來處理
  const sortSnapper = await allSnapper.sort((a, b) => {
    // 把 0 當成 infinity 做遞增排序
    function value(x) {
      return Number(x['snapNumber']) === 0 ? Infinity : Number(x['snapNumber'])
    }
    return value(a) - value(b)
  })

  // 紀錄同一時間發出 request 時間
  let requestTime = recordTime()
  const requestDate = requestTime[0]

  sortSnapper.forEach((snapper, index) => {
    // 向 aws sqs 發出 request，並觸發 lambda 擷取 log
    // getLogData(sendRequest(index))
    // getLogData(sendRequest(index))
    // const data = sendRequest(index)
    // const data = getLog(sendRequest(index))
    // console.log('data:', data)
    getLog(sendRequest(index))
    // 只要向 SQS發出訊息，就擷取 log，並給予初步回應
    // if (data) {
    // getLogData(data)
    // 紀錄每位搶購者收到 response 時間
    let responseTime = recordTime()
    let responseDate = responseTime[0]
    let getResponseTime = diffTime(requestDate, responseDate)

    snapper['requestDate'] = requestDate
    snapper['getResMessage'] = '您的訂單已送出。'
    snapper['getResponseTime'] = `${getResponseTime[0]}:${getResponseTime[1]}`
    // }

    // // 紀錄每位搶購者收到 response 時間
    // let responseTime = recordTime()
    // let responseDate = responseTime[0]
    // let getResponseTime = diffTime(requestDate, responseDate)

    // snapper['requestDate'] = requestDate
    // snapper['getResMessage'] = '您的訂單已送出。'
    // snapper['getResponseTime'] = `${getResponseTime[0]}:${getResponseTime[1]}`
  })

  return sortSnapper
}

async function getLog(req) {
  const data = await req
  await getLogData(data.params.MessageBody)

  // return data.params.MessageBody
  // console.log('data is:', data.params.MessageBody)
}
module.exports = { getPreResponse }
