const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {Note} = require('./../models/note')

const {app} = require('./../server')
const getMockData = require('./seed/seed')
const {users, characters, seedUsers, seedCharacters, removeUsers, removeChars} = getMockData()

let cookies = []

describe('tests for posts methods', () => {

  before('save test-users to db', seedUsers)
  before('insert test-characters to db', seedCharacters)
  before('logging in fisrt user', (done) => {
    request(app)
      .post('/signin')
      .send({nickname: users[0].nickname, password: "qwerty11"})
      .end((err, res) => {
        cookies.push(res.headers['set-cookie'].pop().split(';')[0])
        done()
      })
  })

  before('save two posts for second user character', (done) => {
    const posts = [{
      _id: new ObjectID(),
      text: 'it is a firts post from second user',
      _owner: characters[1]._id
    }, {
      _id: new ObjectID(),
      text: 'it is a second post from second user',
      _owner: characters[1]._id
    }]
    Note.insertMany(posts).then(() => done())
  })

  after('delete created tests notes', (done) => {
    Note.deleteMany({_owner: {$in: [characters[0]._id.toString(), characters[1]._id.toString()]}}).then(() => done())
  })
  after('delete test-characters from db', removeChars)
  after('delete test-users from db', removeUsers)


  it('should not create a note for non-authorize user', (done) => {
    request(app)
      .post('/createnote')
      .send()
      .expect(403)
      .end(done)
  })

  it('should return notes false for first user character notes request', (done) => {
    let req = request(app).post('/getnotes')
    req.cookies = cookies[0]
    req.send({owner: characters[0]._id})
      .expect(200)
      .expect((res) => {
        expect(res.body.notes).toBeFalsy()
      })
      .end(done)
  })

  it('should create new note', (done) => {
    let req = request(app).post('/createnote')
    req.cookies = cookies[0]
    req.send({text: 'Short text for new note creating', _owner: characters[0]._id})
      .expect(200)
      .end((err, res) => {
        if(err) {
          return done(err)
        }
        Note.find({_owner: characters[0]._id}).then((data) => {
          expect(data.length).toBe(1)
          expect(data[0].text).toBe('Short text for new note creating')
          done()
        }).catch((e) => done(e))
      })
  })

  it('should return all second user character notes for first user character request', (done) => {
    let req = request(app).post('/getnotes')
    req.cookies = cookies[0]
    req.send({owner: characters[1]._id})
      .expect(200)
      .expect((res) => {
        expect(res.body.notes.length).toBe(2)
        expect(res.body.notes[0].text).toBe('it is a firts post from second user')
        expect(res.body.notes[1].text).toBe('it is a second post from second user')
      })
      .end(done)
  })
})
