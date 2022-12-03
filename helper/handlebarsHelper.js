const handlebars = require('handlebars')

const emptyStock = handlebars.registerHelper('emptyStock', function (quantity) {
  return Number(quantity) === 0
})

const hasDBProcessTimeKey = handlebars.registerHelper(
  'hasDBProcessTimeKey',
  function (object) {
    return object.hasOwnProperty('dbProcessTime')
  }
)

module.exports = { emptyStock, hasDBProcessTimeKey }
