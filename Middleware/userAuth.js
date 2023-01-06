// Check for duplicate usernames and emails
const express = require('express')
// const db = require('../models/index')
const { User } = require('../models/index')
// const jwt = require('jsonwebtoken')
// const user = require('../models/user')
// const { password } = require('../config/pg')
require('dotenv').config()

const saveUser = async (req, res, next) => {
  await User
  const errors = []
  const { userName, email, password, confirmPassword } = req.body
  try {
    // check duplicate username
    const username = await User.findOne({
      where: {
        userName: userName
      }
    })
    if (username) {
      errors.push({ message: '姓名已被使用過 !' })
      // return res.render('register', { errors })
    }

    // check duplicate email
    const hasEmail = await User.findOne({
      where: {
        email: email
      }
    })
    if (hasEmail) {
      errors.push({ message: '信箱已被註冊 !' })
      // req.flash('warning_msg', '信箱已被註冊 !')
      // return res.render('register', { errors })
    }

    if (password !== confirmPassword) {
      errors.push({ message: '密碼不一致 !' })
      // return res.render('register', { errors })
    }

    if (errors.length) {
      return res.render('register', {
        errors,
        userName,
        email,
        password,
        confirmPassword
      })
    }
    return next()
  } catch (err) {
    console.log(err)
  }
}

const checkToken = async (req, res, next) => {
  try {
    const token = req.signedCookies.provesnpm
    //check cookie whether is modified by else
    if (token) {
      return next()
    }
    req.flash('warning_msg', '請先登入才能搶購!')
    return res.redirect('/users/login')
  } catch (err) {
    console.log(err)
  }
}
module.exports = { saveUser, checkToken }
