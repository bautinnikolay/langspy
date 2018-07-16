const mongoose = require('mongoose')

let NameSchema = new mongoose.Schema({
  name: {
    type: String
  }
})

NameSchema.statics.getName = function() {
  let name = this
  return name.count().then((count) => {
    let random = Math.floor(Math.random() * count)
    return name.findOne().skip(random).then((result) => {
      return new Promise((resolve, reject) => {
        resolve(result)
      })
    })
  })
}

let Name = mongoose.model('Name', NameSchema)

module.exports = {Name}
