const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
})

userSchema.set('toJSON', {
  transform: (document, returnedDocument) => {
    delete returnedDocument.hashedPassword
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User