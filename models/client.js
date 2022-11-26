// Client model
// set up client schema with Sequelize

module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('client', {
    name: {
      type: DataTypes.STRING
    },
    snapnumber: {
      type: DataTypes.STRING
    },
    quantity: {
      type: DataTypes.STRING
    },
    amount: {
      type: DataTypes.STRING
    }
  })
  return Client
}
