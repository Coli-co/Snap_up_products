const AWS = require('aws-sdk')
require('dotenv').config()

const config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.region
}
AWS.config.update(config)

const sqs = new AWS.SQS({ apiVersion: '2022/11/15' })
const queueURL = process.env.QueueUrl

const params = {
  AttributeNames: ['SentTimestamp'],
  MaxNumberOfMessages: 1,
  MessageAttributeNames: ['All'],
  QueueUrl: queueURL,
  VisibilityTimeout: 2, // message store
  WaitTimeSeconds: 3 // poll
}

sqs.receiveMessage(params, function (err, data) {
  if (err) {
    console.log('Receive Error', err)
  } else if (data.Messages) {
    console.log('Receive messages:', data.Messages)

    let deleteParams = {
      QueueUrl: queueURL,
      ReceiptHandle: data.Messages[0].ReceiptHandle
    }

    sqs.deleteMessage(deleteParams, function (err, data) {
      if (err) {
        console.log('Delete Error', err)
      } else {
        console.log('Message Deleted', data)
      }
    })
  }
})
