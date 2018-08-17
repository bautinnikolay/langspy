const {ObjectID} = require('mongodb')

const {User} = require('../../models/user.js')
const {Character} = require('../../models/character.js')

function getMockData() {

const users = [
  {
    email: "tester1@mail.net",
    password: "qwerty11",
    nickname: "tester1",
    locale: "ru"
  },
  {
    email: "tester2@mail.net",
    password: "qwerty11",
    nickname: "tester2",
    locale: "ru"
  },
  {
    email: "tester3@mail.net",
    password: "qwerty11",
    nickname: "tester3",
    locale: "ru"
  }
]

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
    createdAt: new Date().getTime()
  },
  {
    _id: new ObjectID(),
    firstName: "Василиса",
    lastName: "Антонова",
    sex: "female",
    interests: ["Sex", "Drugs", "Rock`n`roll"],
    createdAt: new Date().getTime()
  }
]


const seedUsers = (done) => {
  users.forEach((item, i, arr) => {
    new User(item).save().then((res) => {
      characters[i]._owner = res._id
      users[i]._id = res._id
    }).catch((e) => {
      done(e)
    })
  })
  done()
}

const seedCharacters = (done) => {
  Character.insertMany(characters).then((res) => {
    done()
  }).catch((e) => {
    done(e)
  })
}

const removeUsers = (done) => {
  users.forEach((item, i, arr) => {
    User.deleteOne({_id: item._id}).then().catch((e) => done(e))
  })
  done()
}


const removeChars = (done) => {
  characters.forEach((item, i, arr) => {
    Character.deleteOne({_id: item._id}).then().catch((e) => done(e))
  })
  done()
}

return {users, characters, seedUsers, seedCharacters, removeUsers, removeChars};
  
}

module.exports = getMockData;

