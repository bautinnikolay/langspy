const {ObjectID} = require('mongodb')
const bcrypt = require('bcryptjs')
const {User} = require('../../models/user.js')
const {Character} = require('../../models/character.js')

function getMockData() {

  const users = [
    {
      _id: new ObjectID(),
      email: "tester1@mail.net",
      password: "",
      nickname: "tester1",
      locale: "ru"
    },
    {
      _id: new ObjectID(),
      email: "tester2@mail.net",
      password: "",
      nickname: "tester2",
      locale: "ru"
    },
    {
      _id: new ObjectID(),
      email: "tester3@mail.net",
      password: "",
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
      createdAt: new Date().getTime(),
      _owner: users[0]._id
    },
    {
      _id: new ObjectID(),
      firstName: "Сидор",
      lastName: "Петров",
      sex: "male",
      interests: ["Sex", "Drugs", "Rock`n`roll"],
      createdAt: new Date().getTime(),
      _owner: users[1]._id
    },
    {
      _id: new ObjectID(),
      firstName: "Василиса",
      lastName: "Антонова",
      sex: "female",
      interests: ["Sex", "Drugs", "Rock`n`roll"],
      createdAt: new Date().getTime(),
      _owner: users[2]._id
    }
  ]


  const seedUsers = (done) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash("qwerty11", salt, (err, hash) => {
        users[0].password = hash
        users[1].password = hash
        users[2].password = hash
        User.insertMany(users).then((res) => {
          done()
        }).catch((e) => done(e))
      })
    })

  }

  const seedCharacters = (done) => {
    Character.insertMany(characters).then((res) => {
      done()
    }).catch((e) => done(e))
  }

  const removeUsers = (done) => {
    User.deleteMany({_id: {$in: [users[0]._id, users[1]._id, users[2]._id]}}).then(() => done()).catch((e) => done(e))
  }


  const removeChars = (done) => {
    Character.deleteMany({_id: {$in: [characters[0]._id, characters[1]._id, characters[2]._id]}}).then(() => done()).catch((e) => done(e))
  }

  return {users, characters, seedUsers, seedCharacters, removeUsers, removeChars};

}

module.exports = getMockData;
