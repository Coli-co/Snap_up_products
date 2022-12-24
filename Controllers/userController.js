const bcrypt = require('bcryptjs')
// const db = require('../models/index')
const { User } = require('../models/index')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// user Schema
// const User = db.users
// console.log('User:',User)
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
    req.flash('warning_msg', '請先登入才能搶購 !')

    return res.redirect('/users/login')
  } catch (err) {
    console.log(err)
  }
}

// login authentication
const login = async (req, res) => {
  const errors = []
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email: email } })

    if (!user) {
      errors.push({ message: '您尚未註冊 !' })
    }

    if (user !== null) {
      const pass = await bcrypt.compare(password, user.password)

      if (password !== pass) {
        errors.push({ message: '密碼錯誤 !' })
      }
      // if user and password both  match
      // generate token with user id and secretKey
      if (user && pass) {
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
    }
    return res.render('login', { errors, email, password })
  } catch (err) {
    console.log(err)
  }
}

// logout user
const logout = async (req, res) => {
  try {
    let token = req.signedCookies.provesnpm
    const user = await User.findOne({ where: { token: token } })

    // cancel current user's token
    user.token = ''
    // clear cookie
    res.clearCookie('provesnpm')

    await user.save()
    req.flash('success_msg', '您已成功登出 !')

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
