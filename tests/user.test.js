const request = require('supertest');
const app     = require('../src/app.js');
const User    = require('../src/models/User.js');
const jwt     = require('jsonwebtoken');
const mongoose= require('mongoose');

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

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

// Sign-Up
test('Should signUp a new user', async () => {
  await request(app).post('/users').send({
    username : "maromaro",
    email    : "maromaro@maromaro.com",
    password : "maromaro"
  })
  .expect(201)
});


// Login failure
test('Should successfully ;) fail to login.',async () => {
  await request(app).post('/users/login').send({
    email    : "userOne.email",
    password : "userOne.password"
  })
  .expect(400)
});

// Login
test('Should successfully LogIn a user', async () => {
  await request(app).post('/users/login').send({
    email    : userOne.email,
    password : userOne.password
  })
  .expect(200)
});

// get Profile testing
test('Should get profile for user', async () => {
  await request(app).get('/users/me')
                    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
                    .send()
                    .expect(200)
});

// Testing the deleting routes
test('Should delete a user.' , async () => {
  await request(app).delete('/users/me')
                    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
                    .send()
                    .expect(200);
});
