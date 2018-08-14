const _ = require('lodash')

const {Conversation} = require('./../models/conversation')
const {Message} = require('./../models/message')
const {Character} = require('./../models/character')

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

const checkCharacterOwner = (req, res, next) => {
  if(req.body.characterId) {
    Character.findOne({_id: req.body.characterId}).then((result) => {
      if(result._owner === req.session.suzie) {
        next()
      } else {
        res.status(403).send()
      }
    }).catch((e) => {
      res.status(400).send('Some error with checking for character`s owner')
    })
  }
  if(req.body.fromCharacter) {
    Character.findOne({_id: req.body.fromCharacter}).then((result) => {
      if(result._owner === req.session.suzie) {
        next()
      } else {
        res.status(403).send()
      }
    }).catch((e) => {
      res.status(400).send('Some error with checking for character`s owner')
    })
  }
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
  req.message.status = 'new'
  new Message(req.message).save().then(() => {
    next()
  }).catch((e) => {
    res.status(400).send('Some error with write message')
  })
}

const getMessages = (req, res, next) => {
  Message.find({conversationId: req.body.conversationId}).sort({date: 'asc'}).then((result) => {
    req.messages = result
    next()
  }).catch((e) => {
    res.status(400).send('Some error occured while searching conversation messages')
  })
}

const markMessages = (req, res, next) => {
  req.messages.filter((message) => {
    if(message.toCharacter === req.body.characterId) {
      Message.update({_id: message._id}, { $set: { status: 'readed'}}).then().catch((e) => {
        res.status(400).send('Some error occured while updating messages status')
      })
    }
  })
  next()
}

const newMessageCount = (req, res, next) => {
  Message.countDocuments({toCharacter: req.body.characterId, status: 'new'}).then((result) => {
    req.newmessagescount = result
    next()
  }).catch((e) => {
    res.status(400).send('Some error occured while counting new messages for character')
  })
}

const getLastMessages = (req, res, next) => {
  const data = []
  req.conversations.forEach((item, i, arr) => {
    Message.find({conversationId: item._id}).sort({date: 'desc'}).limit(1).then((result) => {
      data.push({conversationId: item._id, message: result[0]})
      if(i === req.conversations.length-1) {
        data.sort((a, b) => {
          return a.message.date < b.message.date
        })
        req.data = data
        next()
      }
    }).catch((e) => {
      console.log(e)
      res.status(400).send('Some error occured while finding last messages for all character`s conversations')
    })
  })
}

module.exports = {getConversation, checkCharacterOwner, writeMessage, getConversations, getMessages, markMessages, newMessageCount, getLastMessages}
