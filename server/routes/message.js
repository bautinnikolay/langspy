const {mongoose} = require('./../db/mongoose')
const {Conversation} = require('./../models/conversation')
const {Message} = require('./../models/message')
const {checkAuth} = require('./../middleware/auth')
const {getConversation, checkCharacterOwner, getConversations, writeMessage, getMessages, markMessages, newMessageCount, getLastMessages} = require('./../middleware/message')

module.exports = function(app) {
  app.post('/sendmessage', checkAuth, checkCharacterOwner, getConversation, writeMessage, (req, res) => {
    res.send()
  })

  app.post('/getnewmessagescount', checkAuth, checkCharacterOwner, newMessageCount, (req, res) => {
    res.send({newmessagescount: req.newmessagescount})
  })

  app.post('/getlastmessages', checkAuth, checkCharacterOwner, getConversations, getLastMessages, (req, res) => {
    res.send({data: req.data})
  })

  app.post('/getmessages', checkAuth, checkCharacterOwner, getMessages, markMessages, (req, res) => {
    res.send({messages: req.messages})
  })
}
