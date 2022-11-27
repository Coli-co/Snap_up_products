const handlebars = require('handlebars')

const emptyStock = handlebars.registerHelper('emptyStock', function (quantity) {
  return Number(quantity) === 0
})

module.exports = { emptyStock }
