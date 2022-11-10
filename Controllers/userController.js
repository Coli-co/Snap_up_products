const bcrypt = require('bcryptjs')
const db = require('../models/index')
const jwt = require('jsonwebtoken')
const user = require('../models/user')
require('dotenv').config()

// user Schema
const User = db.users

// sign a user up
const signup = async (req, res) => {
  try {
    const { userName, email, password } = req.body
    const data = { userName, email, password: await bcrypt.hash(password, 10) }

    // create an instance (just create data)
    const user = await User.build(data)

    //  generate token with user's id and the secret key
    let token = jwt.sign({ id: user.id }, process.env.secretKey, {
      expiresIn: 86400 // 24 hours
    })

    // save token to database
    user.token = token

    await user.save()

    // set cookie with the token generated
    res.cookie('jwt', token, { maxAge: 360000, httpOnly: true })
    console.log('user', JSON.stringify(user, null, 2))
    console.log(token)
    // send users details
    return res.status(201).send({ user, token })
  } catch (err) {
    console.log(err)
  }
}

// login authentication
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    const pass = await bcrypt.compare(password, user.password)

    if (user && pass) {
      // create an instance to get default values
      // if password match
      // generate token with user id and secretKey
      let token = jwt.sign({ id: user.id }, process.env.secretKey, {
        expiresIn: 86400
      })
      // generate token for login user
      user.token = token

      await user.save()

      res.cookie('jwt', token, { maxAge: 360000, httpOnly: true })
      console.log('user', JSON.stringify(user, null, 2))
      console.log(token)
      //send user data
      return res.status(201).send({ user, token })
    } else {
      return res.status(401).send('Authentication failed.')
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  signup,
  login
}
