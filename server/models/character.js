const mongoose = require('mongoose')
const _ = require('lodash')

let CharacterSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    required: true
  },
  interests: {
    type: Array,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Number,
    required: true
  },
  _owner: {
    type: String,
    required: true
  }
})

CharacterSchema.statics.getcharacters = function (ownerId) {
  let character = this
  return character.find({_owner: ownerId}).then((result) => {
    return new Promise((resolve, reject) => {
      resolve(result)
    })
  })
}

const Character = mongoose.model('Character', CharacterSchema)

module.exports = {Character}
