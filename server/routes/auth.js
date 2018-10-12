const {mongoose} = require('./../db/mongoose')
const {User} = require('./../models/user')
const {createUser, loginUser, checkAuth} = require('./../middleware/auth')

module.exports = function(app) {
  app.post('/signup', createUser, (req, res) => {
    res.send({nickname: req.nickname})
  })

  app.post('/signin', loginUser, (req, res) => {
      res.send({nickname: req.nickname})
  })

  app.post('/signout', checkAuth, (req, res) => {
    req.session.destroy()
    res.status(200).send()
  })

  app.post('/getme', (req, res) => {
    if(req.session.suzie) {
      User.getUser(req.session.suzie).then((userInfo) => {
        if(!userInfo.err) {
          res.send({userInfo: userInfo})
        }
      }).catch((err) => {
        res.status(400).send()
      })
    } else {
      res.send({userInfo: false})
    }
  })
}
