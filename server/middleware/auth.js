const _ = require('lodash')
const {User} = require('./../models/user')

const createUser = (req, res, next) => {
  let body = _.pick(req.body, ['email', 'password', 'nickname', 'locale'])
  let user = new User(body)
  user.save().then((result) => {
    req.session.suzie = result._id
    req.nickname = user.nickname
    next()
  }).catch((err) => {
    let error = 'none'
    if(err.message.includes('email')) {
      error = 'Email must be unique'
    }
    if(err.message.includes('nickname')) {
      error = 'Nickname must be unique'
    }
    res.status(400).send({error})
  })
}

const loginUser = (req, res, next) => {
  User.signin(req.body.nickname, req.body.password).then((result) => {
    req.session.suzie = result._id
    next()
  }).catch((err) => {
    res.status(400).send({err})
  })
}

const checkAuth = (req, res, next) => {
  if(req.session.suzie) {
    next()
  } else {
    res.status(403).send()
  }
}

module.exports = {createUser, loginUser, checkAuth}
