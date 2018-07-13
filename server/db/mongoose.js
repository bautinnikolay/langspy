const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/langspy')
console.log('DB connected')

module.exports = {mongoose}
