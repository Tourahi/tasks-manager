const jwt     = require('jsonwebtoken');
const mongoose= require('mongoose');
const User    = require('../../src/models/User.js');

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id      : userOneId,
  username : "test1",
  email    : "test1@test1.com",
  password : "test1",
  tokens   : [{
    token : jwt.sign({_id: userOneId},process.env.TOKEN_SECRET)
  }]
}

const setupUser = async () => {
  await User.deleteMany();
  await new User(userOne).save();
}


module.exports = {
  userOneId,
  userOne,
  setupUser
}
