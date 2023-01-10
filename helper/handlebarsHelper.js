const handlebars = require('handlebars')
const { diffTime } = require('../aws/recordTime')

const hasDBProcessTimeKey = handlebars.registerHelper(
  'hasDBProcessTimeKey',
  function (object) {
    return object.hasOwnProperty('dbProcessDate')
  }
)

const valueIsNull = handlebars.registerHelper('valueIsNull', function (value) {
  return value === null
})

const dbTimeFormatTrans = handlebars.registerHelper(
  'dbTimeFormatTrans',
  function (requestDate, dbProcessDate) {
    const dateTrans = diffTime(requestDate, dbProcessDate)
    const time = `${dateTrans[0]}:${dateTrans[1]}`
    return time
  }
)

const notEnoughAmountCount = handlebars.registerHelper(
  'notEnoughAmountCount',
  function (allSnapper) {
    let count = 0
    allSnapper.forEach((snapper) => {
      if (snapper['snapStatus'] === '餘額不足') {
        count += 1
      }
    })
    return count
  }
)

const snapperSuccessCount = handlebars.registerHelper(
  'snapperSuccessCount',
  function (allSnapper) {
    let count = 0
    allSnapper.forEach((snapper) => {
      if (snapper['snapStatus'] === '恭喜搶到商品') {
        count += 1
      }
    })
    return count
  }
)

module.exports = {
  hasDBProcessTimeKey,
  valueIsNull,
  dbTimeFormatTrans,
  notEnoughAmountCount,
  snapperSuccessCount
}
