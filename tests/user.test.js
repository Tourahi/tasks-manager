const request = require('supertest');
const app     = require('../src/app.js');
const User = require('../src/models/User.js');

const  {
  userOneId,
  userOne,
  setupUser
} = require('./fixtures/db.js');



beforeEach(setupUser);

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

//Testing avatar uploading
test('Should upload avatar image.',async () => {
  await request(app).post('/users/me/avatar')
                    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                    .attach('avatar','tests/fixtures/blackpara.png')
                    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.avatar.buffer).toEqual(expect.any(Buffer));
});

//Testing user updates
test('Should update the username.',async () => {
  await request(app).patch('/users/me')
                    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                    .send({
                      username: "boss"
                    })
                    .expect(201);
  const user = await User.findById(userOneId);
  expect(user.username).toEqual("boss");
});
