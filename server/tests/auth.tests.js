const expect = require('expect')
const request = require('supertest')

const {app} = require('./../server')
const {User} = require('./../models/user')

const userOne = {
  "email": "test@test.ru",
  "password": "qwerty11",
  "nickname": "tester1",
  "locale": "ru"
}

const userTwo = {
  "email": "test@test2.ru",
  "password": "qwerty11",
  "nickname": "tester1",
  "locale": "ru"
}

let cookies

describe('/signup', () => {
  it('should create new user', (done) => {
    request(app)
      .post('/signup')
      .send(userOne)
      .expect(200)
      .end((err, res) => {
        if(err) {
          return done(err)
        }
        User.find({email: userOne.email}).then((user) => {
          expect(user.length).toBe(1)
          done()
        }).catch((err) => {
          done(err)
        })
      })
  })

  it('should not create new user with duplicate email', (done) => {
    request(app)
      .post('/signup')
      .send(userOne)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('Email must be unique')
      })
      .end((err, res) => {
        if(err) {
          return done(err)
        }
        User.find({email: userOne.email}).then((user) => {
          expect(user.length).toBe(1)
          done()
        }).catch((err) => {
          done(err)
        })
      })
  })

  it('should not create new user with duplicate nickname', (done) => {
    request(app)
      .post('/signup')
      .send(userTwo)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('Nickname must be unique')
      })
      .end((err, res) => {
        if(err) {
          return done(err)
        }
        User.find({email: userTwo.email}).then((user) => {
          expect(user.length).toBe(0)
          done()
        }).catch((err) => {
          done(err)
        })
      })
  })
})

describe('/signin', () => {
  it('should not authorize user with unknown nickname', (done) => {
    request(app)
      .post('/signin')
      .send({nickname: 'user', password: 'password'})
      .expect(400)
      .expect((res) => {
        expect(res.body.err).toBe('User not found')
      })
      .end(done)
  })

  it('should not authorize user with bad password', (done) => {
    request(app)
      .post('/signin')
      .send({nickname: userOne.nickname, password: 'password'})
      .expect(400)
      .expect((res) => {
        expect(res.body.err).toBe('Password incorrect')
      })
      .end(done)
  })

  it('should authorize user', (done) => {
    request(app)
      .post('/signin')
      .send({nickname: userOne.nickname, password: userOne.password})
      .expect(200)
      .end((err, res) => {
        cookies = res.headers['set-cookie'].pop().split(';')[0];
        done()
      })
  })
})

describe('/getme', () => {
  it('should return user information to authorize user', (done) => {
    let req = request(app).post('/getme')
    req.cookies = cookies
    req.set('Accept', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body.userInfo.nickname).toBe(userOne.nickname)
      })
      .end((err, res) => {
        User.findOneAndRemove({email: userOne.email}).then((res) => {
          done()
        }).catch((err) => done(err))
      })
  })

  it('should return 403 forbidden to not authorize user', (done) => {
    request(app)
      .post('/getme')
      .send()
      .expect(403)
      .end(done)
  })
})
