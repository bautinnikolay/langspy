const mongoose = require('mongoose')

let NameSchema = new mongoose.Schema({
  name: {
    type: String
  }
})

NameSchema.statics.getOne = function() {
  let name = this
  return name.find().countDocuments().then((count) => {
    let random = Math.floor(Math.random() * count)
    return name.findOne().skip(random).then((result) => {
      return new Promise((resolve, reject) => {
        resolve(result)
      })
    })
  })
}

const Name = mongoose.model('Name', NameSchema)

module.exports = {Name}
