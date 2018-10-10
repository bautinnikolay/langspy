const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({
  text: {
    type: String,
    require: true
  },
  date: {
    type: Number
  },
  _owner: {
    type: String,
    require: true
  }
})

NoteSchema.pre('save', function (next) {
  let post = this
  post.date = new Date().getTime()
  next()
})

const Note = mongoose.model('Note', NoteSchema)

module.exports = {Note}
