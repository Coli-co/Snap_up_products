const bcrypt = require('bcryptjs')
const db = require('../models/index')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// user Schema
const User = db.users

// sign a user up
const signup = async (req, res) => {
  try {
    const { userName, email, password, confirmPassword } = req.body

    // check password and confirmPassword
    if (password !== confirmPassword) {
      return res.status(409).send('Password incorrect.')
    }

    const data = { userName, email, password: await bcrypt.hash(password, 10) }

    // create an instance (just create data)
    const user = await User.build(data)

    // empty token for sig up user
    user.token = ''

    await user.save()

    return res.redirect('/users/login')
  } catch (err) {
    console.log(err)
  }
}

// login authentication
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email: email } })
    const pass = await bcrypt.compare(password, user.password)

    if (user && pass) {
      // if user and password both  match
      // generate token with user id and secretKey
      let token = jwt.sign({ id: user.id }, process.env.secretKey, {
        expiresIn: 86400
      })

      // generate token for login user
      user.token = token

      await user.save()

      res.cookie('provesnpm', token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        signed: true
      })

      return res.redirect('/')
    }
    return res.redirect('/users/login')
  } catch (err) {
    console.log(err)
  }
}

// logout user
const logout = async (req, res) => {
  try {
    let token = req.signedCookies.provesnpm
    console.log('logout token is:', token)
    const user = await User.findOne({ where: { token: token } })

    // cancel current user's token
    user.token = ''
    // clear cookie
    res.clearCookie('provesnpm')

    await user.save()

    return res.redirect('/users/login')
  } catch (err) {
    console.log(err)
  }
}
module.exports = {
  signup,
  login,
  logout
}
