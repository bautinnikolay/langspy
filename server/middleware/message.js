const _ = require('lodash')

const {Conversation} = require('./../models/conversation')
const {Message} = require('./../models/message')

const getConversation = (req, res, next) => {
  let message = _.pick(req.body, ['fromCharacter', 'toCharacter', 'text'])
  message.date = new Date().getTime()
  Conversation.findOne({users: {$all: [message.fromCharacter, message.toCharacter]}}).then((result) => {
    if(!result) {
      const newConversation = new Conversation({users: [message.fromCharacter, message.toCharacter]})
      newConversation.save().then((result) => {
        message.conversationId = result._id
        req.message = message
        next()
      }).catch((e) => {
        res.status(400).send('Some error with create new conversation')
      })
    } else {
      message.conversationId = result._id
      req.message = message
      next()
    }
  }).catch((e) => {
    res.status(400).send('Some error with find or create conversation')
  })
}

const getConversations = (req, res, next) => {
  Conversation.find({users: {$all: [req.body.characterId]}}).then((result) => {
    req.conversations = result
    next()
  }).catch((e) => {
    res.status(400).send('Some error with find all user`s conversation')
  })
}

const writeMessage = (req, res, next) => {
  new Message(req.message).save().then((res) => {
    next()
  }).catch((e) => {
    res.status(400).send('Some error with write message')
  })
}

module.exports = {getConversation, writeMessage, getConversations}
