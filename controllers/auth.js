const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const saltRounds = 10

router.post('/sign-up', async (req, res) => {
  try {
    // Check to see if the username is already in use
    const userInDatabase = await User.findOne({ username: req.body.username })

    if (userInDatabase) {
      return res.status(409).json({ err: 'Username already taken!' })
    }

    // Otherwise, let's create a new user with a hashed password
    const user = await User.create({
      username: req.body.username,
      hashedPassword: bcrypt.hashSync(req.body.password, saltRounds)
    })

    // Let's define our payload
    const payload = { username: user.username, _id: user._id }

    // Now we can create the token based on the above payload
    const token = jwt.sign({ payload }, process.env.JWT_SECRET)

    // And lastly, let's send the token
    res.status(201).json({ token })
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

router.post('/sign-in', async (req, res) => {
  try {
    // Let's fin the user based on their username
    const user = await User.findOne({ username: req.body.username })

    // If the user does not exists, let's return 401
    if (!user) {
      return res.status(401).json({ err: 'Invalid credentials!' })
    }

    // We need to check the password is correct by using bcrypt
    const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.hashedPassword)

    // In case the password is incorrect, we're going to return a 401
    if (!isPasswordCorrect) {
      return res.status(401).json({ err: 'Invalid credentials!' })
    }

    // Let's build a payload to send
    const payload = { username: user.username, _id: user._id }

    // Now we can create the token based on the above payload
    const token = jwt.sign({ payload }, process.env.JWT_SECRET)

    // And lastly, let's send the token
    res.status(200).json({ token })
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

module.exports = router