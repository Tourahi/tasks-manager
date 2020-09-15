const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  username : {
    type : String,
    required : true,
    min : 6,
    max : 255
  },
  email : {
    type : String,
    required : true,
    min : 6,
    max : 255,
    validate (val) {
      if(!validator.isEmail(val)) {
        throw new Error('Invalide email');
      }
    }
  },
  password : {
    type : String,
    required : true,
    min : 6,
    max : 1024
  },
  createdAt : {
    type : Date,
    default : Date.now
  }
});

module.exports = mongoose.model('User' , userSchema);
