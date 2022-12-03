const AWS = require('aws-sdk')
require('dotenv').config()
const { recordTime } = require('./recordTime')

const config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.region
}
AWS.config.update(config)

const consumerSQS = new AWS.SQS({ apiVersion: '2022/11/15' })
const queueURL = process.env.QueueUrl

const params = {
  AttributeNames: ['SentTimestamp'],
  MaxNumberOfMessages: 10,
  MessageAttributeNames: ['All'],
  QueueUrl: queueURL,
  VisibilityTimeout: 20, // message store
  WaitTimeSeconds: 20 // poll
}

function receiveAndDeleteMsg() {
  const responseTime = recordTime()
  consumerSQS.receiveMessage(params, function (err, data) {
    if (err) {
      console.log('Receive Error', err)
    } else if (data.Messages) {
      console.log(
        `Receive messages with local time ${responseTime[1]}:`,
        data.Messages[0]
      )

      let deleteParams = {
        QueueUrl: queueURL,
        ReceiptHandle: data.Messages[0].ReceiptHandle
      }

      consumerSQS.deleteMessage(deleteParams, function (err, data) {
        if (err) {
          console.log('Delete Error', err)
        } else {
          console.log('Message Deleted', data)
        }
      })
    }
  })
}

module.exports = { receiveAndDeleteMsg }
