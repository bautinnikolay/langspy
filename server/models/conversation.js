const mongoose = require('mongoose')

let ConversationSchema = new mongoose.Schema({
  users: {
      type: Array,
      required: true,
      validate: {
        validator: function(value) {
          if(value.length !== 2) {
            return false
          }
        },
        message: 'It must be two characters in conversation'
      }
    }
})

const Conversation = mongoose.model('Conversation', ConversationSchema)

module.exports = {Conversation}
