const expect = require('expect')
const request = require('supertest')

const {Message} = require('./../models/message')
const {Conversation} = require('./../models/conversation')
const {app} = require('./../server')
const getMockData = require('./seed/seed')
const {users, characters, seedUsers, seedCharacters, removeUsers, removeChars} = getMockData()

let cookies = []
let conversationId

describe('tests for conversations and messages methods', () => {

  before('save test-users to db', seedUsers)
  before('insert test-characters to db', seedCharacters)
  before('logging in fisrt user', (done) => {
    request(app)
      .post('/signin')
      .send({nickname: users[0].nickname, password: "qwerty11"})
      .end((err, res) => {
        cookies.push(res.headers['set-cookie'].pop().split(';')[0]);
        done()
      })
  })

  before('logging in second user', (done) => {
    request(app)
      .post('/signin')
      .send({nickname: users[1].nickname, password: "qwerty11"})
      .end((err, res) => {
        cookies.push(res.headers['set-cookie'].pop().split(';')[0]);
        done()
      })
  })

  after('delete messages and conversation from first and second user from db', (done) => {
    Message.deleteMany({conversationId: conversationId}).then(() => {
      return Conversation.remove({_id: conversationId})
    }).then(() => {
      done()
    }).catch((e) => {
      done(e)
    })
  })

  after('delete test-characters from db', removeChars)
  after('delete test-users from db', removeUsers)

  describe('when messages can not send', () => {
    it('/sendmessage should not send message from anonimous user', (done) => {
      request(app)
        .post('/sendmessage')
        .send({to: characters[1]._id, text: 'Привет друг!'})
        .expect(403)
        .end(done)
    })

    it('should not send message from character which is not owned by the user', (done) => {
      let req = request(app).post('/sendmessage')
      req.cookies = cookies[1]
      req.send({fromCharacter: characters[0]._id, toCharacter: characters[1]._id, text: 'Это сообщение не должно отправиться'})
          .expect(403)
          .end(done)
    })
  })

  describe('messages sending and conversations creating', () => {
    it('/sendmessage should create new conversation between characterOne and characterTwo', (done) => {
      let req = request(app).post('/sendmessage')
      req.cookies = cookies[0]
      req.send({fromCharacter: characters[0]._id, toCharacter: characters[1]._id, text: 'Сообщение от первого персонажа второму'})
        .expect(200)
        .end((err, res) => {
          if(err) {
            return done(err)
          }
          Conversation.find({users: {$all: [characters[0]._id.toString(), characters[1]._id.toString()]}}).then((data) => {
            expect(data.length).toBe(1)
            done()
          }).catch((e) => done(e))
        })
    })

    it('/sendmessage should send new message in conversation between characterOne and characterTwo and not create new conversation', (done) => {
      let req = request(app).post('/sendmessage')
      req.cookies = cookies[1]
      req.send({fromCharacter: characters[1]._id, toCharacter: characters[0]._id, text: 'Сообщение от второго персонажа первому'})
        .expect(200)
        .end((err, res) => {
          if(err) {
            return done(err)
          }
          Conversation.find({users: {$all: [characters[0]._id.toString(), characters[1]._id.toString()]}}).then((data) => {
            expect(data.length).toBe(1)
            conversationId = data[0]._id.toString()
            return Message.find({conversationId: data[0]._id.toString()})
          }).then((data) => {
            expect(data.length).toBe(2)
            expect(data[0].status).toBe('new')
            expect(data[1].status).toBe('new')
            done()
          }).catch((e) => done(e))
        })
    })
  })

  describe('conversations and messages logic work together', () => {

    let secondaryConversation

    before('logging in third user', (done) => {
      request(app)
        .post('/signin')
        .send({nickname: users[2].nickname, password: "qwerty11"})
        .end((err, res) => {
          cookies.push(res.headers['set-cookie'].pop().split(';')[0]);
          done()
        })
    })

    before('third user`s character send message to first user`s character', (done) => {
      let req = request(app).post('/sendmessage')
      req.cookies = cookies[2]
      req.send({fromCharacter: characters[2]._id, toCharacter: characters[0]._id, text: 'Сообщение от третьего персонажа первому'})
        .end((err, res) => {
          if(err) {
            done(err)
          }
          done()
        })
    })

    after('delete third user`s conversation and message from db', (done) => {
      Message.remove({fromCharacter: characters[2]._id}).then(() => {
        return Conversation.remove({user: {$all: [characters[0]._id, characters[2]._id]}})
      }).then(() => {
        done()
      }).catch((e) => {
        done(e)
      })
    })

    it('should return count of not read messages for character in conversations', (done) => {
      let req = request(app).post('/getnewmessagescount')
      req.cookies = cookies[0]
      req.send({characterId: characters[0]._id})
        .expect(200)
        .expect((res) => {
          expect(res.body.newmessagescount).toBe(2)
        })
        .end(done)
    })

    it('should return all messages from conversation and mark all messages to character in conversation as readed', (done) => {
      let req = request(app).post('/getmessages')
      req.cookies = cookies[0]
      req.send({conversationId: conversationId, characterId: characters[0]._id})
        .expect(200)
        .expect((res) => {
          expect(res.body.messages.length).toBe(2)
        })
        .end((err, res) => {
          if(err) {
            done(err)
          }
          Message.find({conversationId: conversationId}).then((data) => {
            expect(data[0].status).toBe('new')
            expect(data[1].status).toBe('readed')
            done()
          }).catch((e) => {
            done(e)
          })
        })
    })

    it('should return last messages from all character`s conversations', (done) => {
      let req = request(app).post('/getlastmessages')
      req.cookies = cookies[0]
      req.send({characterId: characters[0]._id})
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBe(2)
          expect(res.body.data[0].conversationId).toBeTruthy()
          expect(res.body.data[0].message).toBeTruthy()
          expect(res.body.data[0].message.date > res.body.data[1].message.date).toBeTruthy()
        })
        .end(done)
    })
  })
})
