const expect = require('expect')
const request = require('supertest')

const {Character} = require('./../models/character')
const {app} = require('./../server')
const getMockData = require('./seed/seed');

const {users, seedUsers, removeUsers} = getMockData();

let character = {
  sex: 'male',
  interests: ['videogames', 'reading', 'fishing']
}

let cookies

describe('tests for characters methods', () => {

  before(seedUsers)

  before((done) => {
    request(app)
      .post('/signin')
      .send({nickname: users[0].nickname, password: users[0].password})
      .end((err, res) => {
        cookies = res.headers['set-cookie'].pop().split(';')[0];
        done()
      })
  })

  after(removeUsers)

  it('/createcharacter should return new character first name and last name', (done) => {
    let req = request(app).post('/createcharacter')
    req.cookies = cookies
    req.expect(200)
      .expect((res) => {
        expect(res.body.character.name).toBeTruthy()
        expect(res.body.character.familyname).toBeTruthy()
      })
      .end((err, res) => {
        if(err) {
          return done(err)
        }
        character.firstName = res.body.character.name
        character.lastName = res.body.character.familyname
        done()
      })
  })

  it('/savecharacter should save character to database', (done) => {
    let req = request(app).post('/savecharacter')
    req.cookies = cookies
    req.send(character)
      .expect(200)
      .end((err, res) => {
        if(err) {
          return done(err)
        }
        Character.findOne(character).then((char) => {
          expect(char).toBeTruthy()
          done()
        }).catch((err) => {
          done(err)
        })
      })
  })

  it('/createcharacter should not return new character first and last name for user with one active character', (done) => {
    let req = request(app).post('/createcharacter')
    req.cookies = cookies
    req.expect(403)
      .expect((res) => {
        expect(res.body.message).toBe('You already have one active character')
      })
      .end(done)
  })

  it('/getcharacters should return all user characters', (done) => {
    let req = request(app).post('/getcharacters')
    req.cookies = cookies
    req.expect(200)
      .expect((res) => {
        expect(res.body.characters.length).toBe(1)
      })
      .end(done)
  })

  it('/savecharacter should not save character to database for user with one active character', (done) => {
    let req = request(app).post('/savecharacter')
    req.cookies = cookies
    req.send(character)
      .expect(403)
      .expect((res) => {
        expect(res.body.message).toBe('You already have one active character')
      })
      .end((err, res) => {
        if(err) {
          return done(err)
        }
        Character.findOneAndRemove(character).then((res) => {
          done()
        }).catch((err) => {
          done(err)
        })
      })
  })

  it('/savecharacter should return error without saving character to database for non-valid character info', (done) => {
    let req = request(app).post('/savecharacter')
    req.cookies = cookies
    req.send({firstName: character.firstName, lastName: character.lastName})
      .expect(400)
      .end(done)
  })

  it('/getcharacter should return only active user`s character', (done) => {
    //TODO
    done()
  })

  it('/getcharacter should not return character which isn`t owned by user', (done) => {
    //TODO
    done()
  })
})
