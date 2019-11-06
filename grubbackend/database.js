const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/grubhub1', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports.mongoose = mongoose.connection;