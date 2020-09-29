const router  = require('express').Router();
const Task = require('../models/Task.js');
const auth = require('../middleware/auth.js');

//Tasks
router.post('/tasks' ,auth ,async (req , res) => {
  const task = new Task({
    ...req.body,
    owner : req.user._id
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/tasks/:id',auth, async (req , res) => {
  let _id = req.params.id;
  try {
    const task = await Task.findOne({_id , owner : req.user._id});
    res.status(200).send(task);
  } catch (err) {
    res.status(404).send(' Task does not exist.');
  }
});

router.get('/tasks' ,auth , async (req , res) => {
  try {
    const tasks = await Task.find({owner : req.user._id});
    res.status(200).send(tasks);
  } catch (e) {
    res.status(400).send('There is no Tasks yet in our database.');
  }
});

router.patch('/tasks/:id', auth , async (req , res) => {
  //THis should be a middleware
  const updates = Object.keys(req.body);
  const allowedUpdates = ['status' , 'description'];
  const isValidOperation = updates.
                           every((update) => allowedUpdates.includes(update));
  if(!isValidOperation) {
    res.status(400).send("One of the updates is not allowed.");
  }
  try {
    let task = await Task.findOne({
        _id : req.params.id,
        owner : req.user._id
    });

    updates.forEach((update) => task[update] = req.body[update]);
    await task.save();

    if(!task) {
      return res.status(400).send("Task not found.");
    }
    res.status(201).send(task);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.delete('/tasks/:id' ,auth, async (req,res) => {
  try {

    const task = await Task.deleteOne({
      _id : req.params.id,
      owner : req.user._id
    });

    if(!task) {
      return res.status(404).send('Task Not found');
    }
    res.status(200).send(task);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
