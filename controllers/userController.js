const User = require('../models/userModel')
const bcrypt = require('bcryptjs')


exports.signUp = async (req, res, next) => {
  const { username, password } = req.body

  try {
    const hashpassword = await bcrypt.hash(password, 12)
    const newUser = await User.create({ username, password: hashpassword })
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    })
  } catch (e) {
    res.status(400).json({
      status: 'fail'
    })
  }
}

exports.login = async (req, res, next) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username })
    if (!user) { return res.status(400).json({ status: 'fail', message: 'User not found' }) }

    const passwordIsCorrect = await bcrypt.compare(password, user.password)
    if (passwordIsCorrect) {
      res.status(200).json({
        status: 'success',
        message: 'User logged in'
      })
    } else {
      res.status(400).json({
        status: 'fail',
        message: 'Incorrect username or password'
      })
    }

  } catch (e) {
    res.status(400).json({
      status: 'fail'
    })
    console.log(e)
  }
}