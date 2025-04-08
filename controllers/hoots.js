const express = require('express')
const verifyToken = require('../middleware/verify-token')
const Hoot = require('../models/hoot')
const router = express.Router()

router.post('/', verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id

    const hoot = await Hoot.create(req.body)

    hoot._doc.author = req.user

    res.status(201).json(hoot)
  } catch (error) {
    res.status(500).json({ err: error.message })
  }
})

router.get('/', verifyToken, async (req, res) => {
  try {
    const hoots = await Hoot.find({})
      .populate('author')
      .sort({ createdAt: 'desc'})

    res.status(200).json(hoots)
  } catch (error) {
    res.status(500).json({ err: error.message })
  }
})

router.get('/:hootId', verifyToken, async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId).populate([
      'author',
      'comments.author'
    ])

    res.status(200).json(hoot)
  } catch (error) {
    res.status(500).json({ err: error.message })
  }
})

router.put('/:hootId', verifyToken, async (req, res) => {
  try {
    // Let's start by finding the hoot in question
    const hoot = await Hoot.findById(req.params.hootId)

    // Are we the user who made this hoot?
    if (!hoot.author.equals(req.user._id)) {
      return res.status(403).json({ err: "You're not the author of this hoot!"})
    }

    // If you are the real author, let's update the hoot
    const updatedHoot = await Hoot.findByIdAndUpdate(req.params.hootId, req.body, { new: true })

    updatedHoot._doc.author = req.user

    res.status(200).json(updatedHoot)
  } catch (error) {
    res.status(500).json({ err: error.message })
  }
})

router.delete('/:hootId', verifyToken, async (req, res) => {
  try {
    // Let's start by finding the hoot in question
    const hoot = await Hoot.findById(req.params.hootId)

    // Are we the user who made this hoot?
    if (!hoot.author.equals(req.user._id)) {
      return res.status(403).json({ err: "You're not the author of this hoot!"})
    }

    // If you are the real author, let's delete the hoot
    const deletedHoot = await Hoot.findByIdAndDelete(req.params.hootId)

    res.status(200).json(deletedHoot)
  } catch (error) {
    res.status(500).json({ err: error.message })
  }
})

router.post('/:hootId/comments', verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id

    const hoot = await Hoot.findById(req.params.hootId)

    hoot.comments.push(req.body)

    await hoot.save()

    const newComment = hoot.comments[hoot.comments.length - 1]

    newComment._doc.author = req.user

    res.status(201).json(newComment)
  } catch (error) {
    res.status(500).json({ err: error.message })
  }
})

module.exports = router