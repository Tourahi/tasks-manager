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
  // lastUpdate : { //Date of completion
  //   type : Date,
  //   required : false,
  // },
  owner : {
    type : mongoose.Schema.Types.ObjectId,
    required : true,
    ref : 'User'
  },
  createdAt : {
    type : Date,
    default : Date.now
  }
});

module.exports = mongoose.model('Task' , taskSchema);
