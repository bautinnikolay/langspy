const {mongoose} = require('./../db/mongoose')
const {Conversation} = require('./../models/conversation')
const {Message} = require('./../models/message')
const {checkAuth} = require('./../middleware/auth')

module.exports = function(app) {
  app.post('sendmessage', checkAuth, (req, res) => {
    res.send()
  })

  app.post('getconversations', checkAuth, (req, res) => {
    res.send()
  })

  app.post('getnewmessagescount', checkAuth, (req, res) => {
    res.send()
  })

  app.post('getlastmessages', checkAuth, (req, res) => {
    res.send()
  })

  app.post('getmessages', checkAuth, (req, res) => {
    res.send()
  })
}
