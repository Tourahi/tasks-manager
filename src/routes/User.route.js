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
    return res.status(200).send({user : user , token});
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/users/logout', auth , async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/users/logoutall', auth , async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});

router.patch('/users/me', auth ,async (req , res) => {
  //THis should be a middleware
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username' , 'email' , 'password'];
  const isValidOperation = updates.
                           every((update) => allowedUpdates.includes(update));
  if(!isValidOperation) {
    res.status(400).send("One of the updates is not allowed.");
  }
  try {
    updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    res.status(201).send(req.user);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.delete('/users/me' ,auth,async (req,res) => {
  try {
    req.user.remove();
    res.status(200).send(req.user);
  } catch (err) {
    res.status(404).send(err);
  }
});


module.exports = router;
