const {ObjectID} = require('mongodb')

const {User} = require('../../models/user.js')
const {Character} = require('../../models/character.js')

const users = [
  {
    email: "testerOne@mail.net",
    password: "qwerty11",
    nickname: "testerOne",
    locale: "ru"
  },
  {
    email: "testerTwo@mail.net",
    password: "qwerty11",
    nickname: "testerTwo",
    locale: "ru"
  }
]

const getNewUser = (user) => {
  return new User(user)
}

const characters = [
  {
    _id: new ObjectID(),
    firstName: "Петр",
    lastName: "Сидоров",
    sex: "male",
    interests: ["Sex", "Drugs", "Rock`n`roll"],
    createdAt: new Date().getTime()
  },
  {
    _id: new ObjectID(),
    firstName: "Сидор",
    lastName: "Петров",
    sex: "male",
    interests: ["Sex", "Drugs", "Rock`n`roll"],
    createdAt: new Date().getTime(),
    _owner: users[1]._id
  }
]


//TODO create users fabric
const seedUsers = (done) => {
  getNewUser(users[0]).save().then((res) => {
    users[0]._id = res._id
    characters[0]._owner = users[0]._id
    return getNewUser(users[1]).save()
  }).then((res) => {
    users[1]._id = res._id
    characters[1]._owner = users[1]._id
    done()
  }).catch((e) => {
    done(e)
  })
}

const seedCharacters = (done) => {
  Character.insertMany(characters).then((err, res) => {
    done()
  }).catch((e) => {
    done(e)
  })
}

const removeUsers = (done) => {
  User.deleteOne({_id: users[0]._id}).then(() => {
    return User.deleteOne({_id: users[1]._id})
  }).then(() => {
    done()
  }).catch((e) => {
    done(e)
  })
}


const removeChars = (done) => {
  Character.deleteOne({_id: characters[0]._id}).then((err, res) => {
    return Character.deleteOne({_id: characters[1]._id})
  }).then((err, res) => {
    done()
  }).catch((e) => {
    done(e)
  })
}

module.exports = {users, characters, seedUsers, seedCharacters, removeUsers, removeChars}
