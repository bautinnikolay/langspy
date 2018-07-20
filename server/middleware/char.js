const _ = require('lodash')

let {Character} = require('./../models/character')
let {FamilyName} = require('./../models/familyname')
let {Name} = require('./../models/name')

let activeCharactersCount = (req, res, next) => {
  Character.getcharacters(req.session.suzie).then((charList) => {
    let active = charList.filter(char => char.status)
    if(active.length > 0) {
      res.status(400).send({message: 'You already have one active user'})
    } else {
      next()
    }
  })
}

let createCharacter = (req, res, next) => {
  let character = {}
  Name.getOne().then((name) => {
    character.name = name.name
    return FamilyName.getOne()
  }).then((familyname) => {
    character.familyname = familyname.familyName
    req.character = character
    next()
  }).catch((err) => {
    res.status(400).send()
  })
}

let saveCharacter = (req, res, next) => {
  let body = _.pick(req.body, ['firstName', 'lastName', 'sex', 'interests'])
  body._owner = req.session.suzie
  body.createdAt = new Date().getTime()
  let character = new Character(body)
  character.save().then((result) => {
    next()
  }).catch((err) => {
    res.status(400).send()
  })
}

module.exports = {activeCharactersCount, createCharacter, saveCharacter}
