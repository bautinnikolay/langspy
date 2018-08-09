const expect = require('expect')
const request = require('supertest')

const {Message} = require('./../models/message')
const {Conversation} = require('./../models/conversation')
const {app} = require('./../server')
const {users, characters, seedUsers, seedCharacters, removeUsers, removeChars} = require('./seed/seed')

let cookies
let conversationId

describe('tests for conversations and messages methods', () => {

  before(seedUsers)
  before(seedCharacters)
  before((done) => {
    request(app)
      .post('/signin')
      .send({nickname: users[0].nickname, password: users[0].password})
      .end((err, res) => {
        cookies = res.headers['set-cookie'].pop().split(';')[0];
        done()
      })
  })

  after((done) => {
    Message.deleteMany({conversationId: conversationId}).then(() => {
      return Conversation.remove({_id: conversationId})
    }).then(() => {
      done()
    }).catch((e) => {
      done(e)
    })
  })

  after(removeChars)
  after(removeUsers)

  it('/sendmessage should not send message from anonimous user', (done) => {
    request(app)
      .post('/sendmessage')
      .send({to: characters[1]._id, text: 'Привет друг!'})
      .expect(403)
      .end(done)
  })

  it('should not send message from character which is not owned by the user', (done) => {
    done()
  })

  it('/sendmessage should create new conversation between characterOne and characterTwo', (done) => {
    let req = request(app).post('/sendmessage')
    req.cookies = cookies
    req.send({fromCharacter: characters[0]._id, toCharacter: characters[1]._id, text: 'Привет друг!'})
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
    req.cookies = cookies
    req.send({fromCharacter: characters[1]._id, toCharacter: characters[0]._id, text: 'Привет друг!'})
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
          done()
        }).catch((e) => done(e))
      })
  })

  it('/getconversations should return all character`s conversations list', (done) => {
    let req = request(app).post('/getconversations')
    req.cookies = cookies
    req.send({characterId: characters[0]._id})
      .expect(200)
      .expect((res) => {
        console.log(res.body)
        expect(res.body.conversations.length).toBe(1)
      })
      .end(done)
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
