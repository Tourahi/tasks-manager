const router  = require('express').Router();
const User = require('../models/User.js');
const auth = require('../middleware/auth.js');

router.get('/users/me' , auth , async (req , res) => {
  res.status(200).send(req.user);
});

router.post('/users'  , async  (req , res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token  = await user.genereteAuthToken();
    return res.status(201).send({user , token});
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/users/login' , async  (req , res) => {
  try {
    const user = await User.findByCredentials(req.body.email ,req.body.password);
    const token  = await user.genereteAuthToken();
    return res.status(200).send({user , token});
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/users/:id', async (req , res) => {
  let _id = req.params.id;
  try {
    let user = await User.findById(_id);
    res.status(200).send(user);
  } catch (e) {
    res.status(404).send('User does not exist.');
  }
});


router.patch('/users/:id', async (req , res) => {
  //THis should be a middleware
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username' , 'email' , 'password'];
  const isValidOperation = updates.
                           every((update) => allowedUpdates.includes(update));
  if(!isValidOperation) {
    res.status(400).send("One of the updates is not allowed.");
  }
  try {
    const user = await User.findById(
      req.params.id
    );

    updates.forEach((update) => user[update] = req.body[update]);
    await user.save();

    if(!user) {
      return res.status(400).send("User not found.");
    }
    res.status(201).send(user);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.delete('/users/:id' , async (req,res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) {
      return res.status(404).send('User Not found');
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(404).send(err);
  }
});


module.exports = router;
