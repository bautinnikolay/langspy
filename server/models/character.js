const mongoose = require('mongoose')

let CharacterSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  interests: {
    type: Array,
    required: true
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

let Character = mongoose.model('Character', CharacterSchema)

module.exports = {Character}
