var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  _id: String,
  username: String,
  email: String,
  password: String
},{ collection: 'Users' });

// schema.set('collection', 'info');
var Info = module.exports = mongoose.model('Users', schema);