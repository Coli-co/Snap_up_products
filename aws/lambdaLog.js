const { LambdaLog } = require('lambda-log')
const fs = require('fs')
const { Console } = require('console')

// Create write streams for standard log messages and error messages.
const logFile = fs.createWriteStream('log/out.log')
const errorLogFile = fs.createWriteStream('log/errors.log')

const log = new LambdaLog({
  tags: ['snp_up'],
  logHandler: new Console({ stdout: logFile, stderr: errorLogFile })
})
// data.params.MessageBody

module.exports = {
  getLogData: async function getData(event) {
    log.info('訂單已送出。', {
      event: event
    })
  }
}
