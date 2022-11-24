// Client model
// set up client schema with Sequelize

module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    'client',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      snap_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      quantity: {
        type: DataTypes.STRING,
        allowNull: false
      },
      amount: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { timestamps: true }
  )
  return Client
}
