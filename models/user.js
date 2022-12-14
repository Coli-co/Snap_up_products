// User model
// set up user schema with Sequelize
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      userName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        isEmail: true, // check for email format
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { timestamps: true }
  )
  return User
}
