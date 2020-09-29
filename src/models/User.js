const mongoose  = require('mongoose');
const validator = require('validator');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const Task      = require('./Task');

const userSchema = new mongoose.Schema({
  username : {
    type : String,
    required : true,
    min : 6,
    max : 255
  },
  email : {
    type : String,
    unique : true,
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
  tokens : [{
    token : {
      type : String,
      required : true
    }
  }],
  createdAt : {
    type : Date,
    default : Date.now
  }
});

userSchema.pre('save' ,async function (next) {
  if(this.isModified('password')) {
    this.password = await bcrypt.hash(this.password , 8);
  }
  next();
});

// Delete all task of a user if he removes his account
userSchema.pre('remove' , async function(next) {
  await Task.deleteMany({owner : this._id});
  next();
});


userSchema.statics.findByCredentials = async function (email , password){
  const user = await this.findOne({ email });
  if(!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password , user.password);
  if(!isMatch) {
    throw new Error('Unable to login');
  }
  return user;
}

userSchema.methods.genereteAuthToken = async function() {
  const token = jwt.sign({ _id : this._id.toString() } ,
                        process.env.TOKEN_SECRET || 'TheSecretTOTOTOKEN');
  this.tokens = this.tokens.concat({token});
  await this.save();
  return token;
}

userSchema.virtual('tasks' , {
	ref : 'Task',
	localField : '_id',
	foreignField : 'owner'
});

userSchema.methods.toJSON = function() {
  const userObj = this.toObject();
  delete userObj.password ;
  delete userObj.tokens   ;
  delete userObj.__v   ;
  return userObj;
}


module.exports = mongoose.model('User' , userSchema);
