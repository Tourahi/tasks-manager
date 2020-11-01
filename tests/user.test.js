const request = require('supertest');
const app     = require('../src/app.js');
const User    = require('../src/models/User.js');

const userOne = {
  username : "test1",
  email    : "test1@test1.com",
  password : "test1"
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
  }).expect(201)
});

// Login
test('Should LogIn a user', async () => {
  await request(app).post('/users/login').send({
    email    : userOne.email,
    password : userOne.password
  }).expect(200)
});
