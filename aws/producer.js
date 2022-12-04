const AWS = require('aws-sdk')
require('dotenv').config()
const { recordTime } = require('./recordTime')
const { getLogData } = require('./lambdaLog')

const config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.region
}
AWS.config.update(config)

const producerSQS = new AWS.SQS({ apiVersion: '2022/11/15' })
const queueURL = process.env.QueueUrl

const params = {}
// Calling the listQueues operation
producerSQS.listQueues(params, function (err, data) {
  if (err) {
    console.log('Error', err)
  } else {
    console.log('ListQueues is done.')
  }
})

const requestTime = recordTime()

let posMsgParams = {
  DelaySeconds: 0, //set delay seconds on individual messages
  MessageAttributes: {
    Product: {
      DataType: 'String',
      StringValue: 'Snap Product '
    }
  },
  MessageBody: `I want to snap up with local time: ${requestTime[1]}`,
  QueueUrl: queueURL
}

// send request
function sendRequest() {
  const data = producerSQS.sendMessage(posMsgParams, function (err, data) {
    if (err) {
      console.log('Error', err)
    } else {
      console.log('Send request to SQS is successful.')
    }
    console.log('SendMessage is done.')
  })
  return data
}

module.exports = { sendRequest }
