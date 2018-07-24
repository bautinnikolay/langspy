const mongoose = require('mongoose')

let FamilynameSchema = new mongoose.Schema({
  familyName: {
    type: String
  }
})

FamilynameSchema.statics.getOne = function() {
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

const FamilyName = mongoose.model('Familyname', FamilynameSchema)

module.exports = {FamilyName}
