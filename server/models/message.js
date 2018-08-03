const mongoose = require('mongoose')

let MessageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true
  },
  fromCharacter: {
    type: String,
    required: true
  },
  toCharacter: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Number,
    required: true
  }
})

const Message = mongoose.model('Message', MessageSchema)

module.exports = {Message}
