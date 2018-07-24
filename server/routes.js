const {mongoose} = require('./db/mongoose')
const {User} = require('./models/user')
const {Character} = require('./models/character')
const {createUser, loginUser, checkAuth} = require('./middleware/auth')
const {activeCharactersCount, createCharacter, saveCharacter, getCharacters} = require('./middleware/char')

module.exports = function(app) {
  app.post('/signup', createUser, (req, res) => {
    res.send()
  })

  app.post('/signin', loginUser, (req, res) => {
    res.send()
  })

  app.post('/signout', checkAuth, (req, res) => {
    req.session.destroy()
    res.status(200).send()
  })

  app.post('/getme', checkAuth, (req, res) => {
    User.getUser(req.session.suzie).then((userInfo) => {
      if(!userInfo.err) {
        res.send({userInfo})
      }
    }).catch((err) => {
      res.status(400).send()
    })
  })

  app.post('/createcharacter', checkAuth, activeCharactersCount, createCharacter, (req, res) => {
    res.send({character: req.character})
  })

  app.post('/savecharacter', checkAuth, activeCharactersCount, saveCharacter, (req, res) => {
    res.send()
  })

  app.post('/getcharacters', checkAuth, getCharacters, (req, res) => {
    res.send({characters: req.characters})
  })
}
