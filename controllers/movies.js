const express = require('express')
const verifyToken = require('../middleware/verify-token')
const Movie = require('../models/movie')
const router = express.Router()

router.post('/', verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id

    const movie = await Movie.create(req.body)

    movie._doc.author = req.user

    res.status(201).json(movie)
  } catch (error) {
    res.status(500).json({ err: error.message })
  }
})

router.get('/', verifyToken, async (req, res) => {
  try {
    const movies = await Movie.find({})
      .populate('author')
      .sort({ createdAt: 'desc'})

    res.status(200).json(movies)
  } catch (error) {
    res.status(500).json({ err: error.message })
  }
})

router.get('/:movieId', verifyToken, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId).populate([
      'author',
      'reviews.author'
    ])

    res.status(200).json(movie)
  } catch (error) {
    res.status(500).json({ err: error.message })
  }
})

router.put('/:movieId', verifyToken, async (req, res) => {
  try {
    // Let's start by finding the movie in question
    const movie = await Movie.findById(req.params.movieId)

    // Are we the user who made this movie?
    if (!movie.author.equals(req.user._id)) {
      return res.status(403).json({ err: "You're not the author of this movie!"})
    }

    // If you are the real author, let's update the movie
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.movieId, req.body, { new: true })

    updatedMovie._doc.author = req.user

    res.status(200).json(updatedMovie)
  } catch (error) {
    res.status(500).json({ err: error.message })
  }
})

router.delete('/:movieId', verifyToken, async (req, res) => {
  try {
    // Let's start by finding the movie in question
    const movie = await Movie.findById(req.params.movieId)

    // Are we the user who made this movie?
    if (!movie.author.equals(req.user._id)) {
      return res.status(403).json({ err: "You're not the author of this movie!"})
    }

    // If you are the real author, let's delete the movie
    const deletedMovie = await Movie.findByIdAndDelete(req.params.movieId)

    res.status(200).json(deletedMovie)
  } catch (error) {
    res.status(500).json({ err: error.message })
  }
})

router.post('/:movieId/reviews', verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id

    const movie = await Movie.findById(req.params.movieId)

    movie.reviews.push(req.body)

    await movie.save()

    const newReview = movie.reviews[movie.reviews.length - 1]

    newReview._doc.author = req.user

    res.status(201).json(newReview)
  } catch (error) {
    res.status(500).json({ err: error.message })
  }
})

module.exports = router