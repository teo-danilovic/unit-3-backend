const express = require('express')
const router = express.Router()

const verifyToken = require('../middleware/verify-token')

const User = require('../models/user')

router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, "username")

    res.json(users)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

router.get('/:userId', verifyToken, async(req, res) => {
  try {
    // If the logged-in user is looking for another user, let's block the request
    if (req.user._id !== req.params.userId) {
      return res.status(403).json({ err: "You are not authorized to see this!" })
    }

    const user = await User.findById(req.params.userId)
    if (!user) {
      return res.status(404).json({ err: 'User not found!' })
    }

    res.json(user)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

module.exports = router 