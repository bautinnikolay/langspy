const expect = require('expect')
const request = require('supertest')

const {Message} = require('./../models/message')
const {Conversation} = require('./../models/conversation')
const {app} = require('./../server')

let characters = [{

}, {

}]

let cookies

// TODO: Надо добавить еще одного тестового пользователя, затем создавать двух персонажей - по одному на пользователя, и слать сообщения между ними

describe('tests for conversations and messages methods', () => {

  it('should not create new conversation with only one user', (done) => {
    done()
  })

  it('should create new conversation between userOne and userTwo', (done) => {
    //TODO '/sendmessage(fromUser, toUser, text)'
    done()
  })

  it('should send new message in conversation between userOne and userTwo and not create new conversation', (done) => {
    //TODO '/sendmessage(fromUser, toUser, text)'
    done()
  })

  it('should return all user`s conversations list', (done) => {
    //TODO '/getconversations(userId)'
    done()
  })

  it('should return all messages from conversation and mark all messages in conversation as readed', (done) => {
    //TODO '/getmessages(conversationId)'
    done()
  })

  it('should return count of not read messages for userOne in conversation', (done) => {
    //TODO '/getnewmessagescount(toUser: userId)'
    done()
  })


  it('should return last messages from conversations list', (done) => {
    //TODO '/getlastmessages(...conversationIdList)'
    done()
  })
})
