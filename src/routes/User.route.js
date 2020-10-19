const router  = require('express').Router();
const User = require('../models/User.js');
const auth = require('../middleware/auth.js');
const multer = require('multer');
const sharp = require('sharp');

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
    const user   = await User.findByCredentials(req.body.email ,req.body.password);
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

//Uploading
//Multer settings
const upload = multer({
  limits : {
    fileSize : 1000000,
  },
  fileFilter(req,file,cb) {
    if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
      return cb(new Error('Only the extensions (png|jpeg|jpg) are acceptable'));
    }
    cb(undefined,true);
  }
});
//Avatar Uploading

router.post('/users/me/avatar' ,auth,upload.single('avatar'),async (req ,res) => {
  req.user.avatar = {
    buffer : await sharp(req.file.buffer).resize({width : 250, height : 250})
            .png().toBuffer(),
    ext    : req.file.originalname.split('.').pop()
  }
  await req.user.save();
  res.status(200).send();
} , (error , req , res,next) => {
  res.status(400).send({error : error.message});
});

router.delete('/users/me/avatar' , auth, async (req , res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.status(200).send();
});

router.get('/users/:id/avatar', async (req , res) => {
  try {
    const user = await User.findById(req.params.id);
    if(!user || !user.avatar) throw new Error();
    res.set('Content-Type', `image/${user.avatar.ext}`);
    res.status(200).send(user.avatar.buffer);
  }catch(e) {
    res.status(404).send();
  }
});


module.exports = router;
