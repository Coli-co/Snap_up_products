const AWS = require('aws-sdk')
require('dotenv').config()

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
    console.log('Success', data)
  }
  console.log('ListQueues is done.')
})

function getRequestTime() {
  let requestTime = ''
  const requestDate = new Date()
  const hours = new Date().getHours()
  const minutes = new Date().getMinutes()
  const seconds = new Date().getSeconds()
  requestTime = `${hours}:${minutes}:${seconds}`
  console.log('Request time is:', requestTime)
  return [requestDate, requestTime]
}

const requestTime = getRequestTime()

let posMsgParams = {
  DelaySeconds: 10, //set delay seconds on individual messages
  MessageAttributes: {
    Title: {
      DataType: 'String',
      StringValue: 'AWS 30 Days'
    },
    Author: {
      DataType: 'String',
      StringValue: 'Blackie'
    }
  },
  MessageBody: `I want to snap up with local time: ${requestTime[1]}`,
  QueueUrl: queueURL
}

// send request
function sendRequest() {
  producerSQS.sendMessage(posMsgParams, function (err, data) {
    if (err) {
      console.log('Error', err)
    } else {
      console.log('Success', data)
    }
    console.log('SendMessage is done.')
  })
}

module.exports = { sendRequest, getRequestTime }
