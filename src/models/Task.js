const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = new mongoose.Schema({
  description : {
    type : String,
    required : true,
    min : 6,
    max : 255
  },
  status : { //if completed
    type : Boolean,
    default : false,
  },
  owner : {
    type : mongoose.Schema.Types.ObjectId,
    required : true,
    ref : 'User'
  }
} , {
  timestamps : true,
});

module.exports = mongoose.model('Task' , taskSchema);
