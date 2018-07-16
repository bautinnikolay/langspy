const express = require('express')
const bodyParser = require('body-parser')
const sess = require('express-session')
const _ = require('lodash')

let {mongoose} = require('./db/mongoose')
let {User} = require('./models/user')

let app = express()

app.disable('x-powered-by')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(sess({
  secret: 'blablabla',
  resave: false,
  saveUninitialized: true,
  cookie: { expires: new Date(Date.now() + 9000000000) }
}))

app.post('/signup', (req, res) => {
  let body = _.pick(req.body, ['email', 'password', 'nickname', 'locale'])
  let user = new User(body)
  user.save().then((result) => {
    req.session.suzie = result._id
    res.status(200).send()
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
})

app.post('/signin', (req, res) => {
  User.signin(req.body.nickname, req.body.password).then((result) => {
    req.session.suzie = result._id
    res.status(200).send()
  }).catch((err) => {
    res.status(400).send({err})
  })
})

app.post('/getme', (req, res) => {
  if(req.session.suzie) {
    User.getUser(req.session.suzie).then((userInfo) => {
      if(!userInfo.err) {
        res.send({userInfo})
      }
    }).catch((err) => {
      res.status(400).send()
    })
  } else {
    res.status(403).send()
  }
})

app.listen(3000, () => {
  console.log(`Started on port 3000`)
})

module.exports = {app}
