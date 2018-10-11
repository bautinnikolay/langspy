const {checkAuth} = require('./../middleware/auth')
const {isOwner} = require('./../middleware/char')

const {Note} = require('./../models/note')

module.exports = function(app) {
  app.post('/createnote', checkAuth, isOwner, (req, res) => {
    let note = new Note({text: req.body.text, _owner: req.body._owner})
    note.save().then(() => {
        res.send()
    }).catch((e) => {
      res.status(400).send({error: 'Some error with creating new post ' + e})
    })
    res.send()
  })

  app.post('/getnotes', checkAuth, (req, res) => {
    Note.find({_owner: req.body.owner}).then((data) => {
      if(data.length > 0) {
        res.send({notes: data})
      } else {
        res.send({notes: false})
      }
    })
  })
}
