const mongoose  = require('mongoose');
const validator = require('validator');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');

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
  const token = jwt.sign({ _is : this._id.toString() } ,
                        process.env.TOKEN_SECRET || 'TheSecretTOTOTOKEN');
  this.tokens = this.tokens.concat({token});
  await this.save();
  return token;
}


module.exports = mongoose.model('User' , userSchema);
