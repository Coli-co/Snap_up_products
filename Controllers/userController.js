const bcrypt = require('bcrypt')
const db = require('../models/index')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const User = db.users

// sign a user up
const signup = async (req, res) => {
  try {
    const { userName, email, password } = req.body
    const data = { userName, email, password: await bcrypt.hash(password, 10) }
    // create new user
    const user = await User.create(data)

    // if new user created, generate token with user's id and
    // the secret key
    if (user) {
      let token = jwt.sign({ id: user.id }, process.env.secretKey, {
        expiresIn: 86400 // 24 hours
      })
      // set cookie with the token generated
      res.cookie('jwt', token, { maxAge: 360000, httpOnly: true })
      console.log('user', JSON.stringify(user, null, 2))
      console.log(token)
      // send users details
      return res.status(201).send(user)
    } else {
      return res.status(409).send('Details are not correct.')
    }
  } catch (err) {
    console.log(err)
  }
}

// login authentication
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user) {
      const sameUser = await bcrypt.compare(password, user.password)

      if (sameUser) {
        let token = jwt.sign({ id: user.id }, process.env.secretKey, {
          expiresIn: 86400
        })
        // if password match
        // generate token with user id and secretKey
        res.cookie('jwt', token, { maxAge: 360000, httpOnly: true })
        console.log('user', JSON.stringify(user, null, 2))
        console.log(token)
        //send user data
        return res.status(201).send(user)
      } else {
        return res.status(401).send('Authentication failed.')
      }
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
