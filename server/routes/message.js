const {mongoose} = require('./../db/mongoose')
const {Conversation} = require('./../models/conversation')
const {Message} = require('./../models/message')
const {checkAuth} = require('./../middleware/auth')
const {getConversation, checkCharacterOwner, getConversations, writeMessage} = require('./../middleware/message')

module.exports = function(app) {
  app.post('/sendmessage', checkAuth, getConversation, checkCharacterOwner, writeMessage, (req, res) => {
    res.send()
  })

  app.post('/getconversations', checkAuth, getConversations, (req, res) => {
    res.send({conversations: req.conversations})
  })

  app.post('/getnewmessagescount', checkAuth, (req, res) => {
    res.send()
  })

  app.post('/getlastmessages', checkAuth, (req, res) => {
    res.send()
  })

  app.post('/getmessages', checkAuth, (req, res) => {
    res.send()
  })
}
