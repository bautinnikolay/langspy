const {mongoose} = require('./../db/mongoose')
const {checkAuth} = require('./../middleware/auth')
const {activeCharactersCount, createCharacter, saveCharacter, getCharacters} = require('./../middleware/char')

module.exports = function(app) {
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
