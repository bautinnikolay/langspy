const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/langspy', { useNewUrlParser: true })

module.exports = {mongoose}
