const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
}, { timestamps: true })

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  text: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Thriller', 'Western', 'Sci-Fi', 'Documentary', 'Animation']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [reviewSchema]
}, { timestamps: true })

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie