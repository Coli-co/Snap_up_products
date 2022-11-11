// Check for duplicate usernames and emails
const express = require('express')
const db = require('../models/index')
const jwt = require('jsonwebtoken')
const user = require('../models/user')
require('dotenv').config()
const User = db.users

const saveUser = async (req, res, next) => {
  try {
    // check duplicate username
    const username = await User.findOne({
      where: {
        userName: req.body.userName
      }
    })

    if (username) {
      return res.status(409).send('Username had already been used!')
    }

    // check duplicate email
    const email = await User.findOne({
      where: {
        email: req.body.email
      }
    })
    if (email) {
      return res.status(409).send('Email had already been used!')
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
    return res.redirect('/users/login')
  } catch (err) {
    console.log(err)
  }
}
module.exports = { saveUser, checkToken }
