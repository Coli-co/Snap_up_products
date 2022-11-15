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

const params = {}

sqs.listQueues(params, function (err, data) {
  console.log('ListQueues is done.')
  if (err) {
    console.log('Error', err)
  } else {
    console.log('Success', data)
  }
})

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
  MessageBody: `This is test msg with local time: ${(timeInMs = Date.now())}`,
  QueueUrl: queueURL
}

sqs.sendMessage(posMsgParams, function (err, data) {
  console.log('SendMessage is done.')
  if (err) {
    console.log('Error', err)
  } else {
    console.log('Success', data)
  }
})
