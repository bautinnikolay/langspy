const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const _ = require('lodash')

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  nickname: {
    type: String,
    required: true,
    unique: true,
    minlength: 2
  },
  locale: {
    type: String,
    required: true
  }
})

UserSchema.methods.toJSON = function () {
  let user = this
  let userObject = user.toObject()
  return _.pick(userObject, ['_id', 'email', 'nickname', 'locale'])
}

UserSchema.statics.getUser = function(id) {
  let user = this
  return user.findOne({_id: id}).then((res) => {
    if(!res) {
      return Promise.reject()
    }
    return new Promise((resolve, reject) => {
      resolve(res)
    })
  })
}

UserSchema.statics.signin = function (nickname, password) {
  let user = this
  return user.findOne({nickname: nickname}).then((data) => {
    if (!data) {
      return Promise.reject('User not found')
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, data.password, (err, res) => {
        if(res) {
          resolve(data)
        } else {
          reject('Password incorrect')
        }
      })
    })
  })
}

UserSchema.pre('save', function (next) {
  let user = this
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash
      next()
    })
  })
})

const User = mongoose.model('User', UserSchema)

module.exports = {User}
