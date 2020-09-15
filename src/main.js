const express = require('express');
const connectDB = require('./db/mongoose.js');
const User = require('./models/User.js');
const Task = require('./models/Task.js');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({extended:false}));
app.use(express.json());
connectDB();


app.post('/users' , async  (req , res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/users/:id', async (req , res) => {
  let _id = req.params.id;
  try {
    let user = await User.findById(_id);
    res.status(200).send(user);
  } catch (e) {
    res.status(404).send('User does not exist.');
  }
});

app.get('/users' , async (req , res) => {
  try {
      let users = await User.find({});
      res.status(200).send(users);
  } catch (e) {
      res.status(400).send('There is no users yet in our database.');
  }
});


//Posts
app.post('/posts' ,async (req , res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(err);
  }
});

app.get('/posts/:id', async (req , res) => {
  let _id = req.params.id;
  try {
    let task = await Task.findById(_id);
    res.status(200).send(task);
  } catch (err) {
    res.status(404).send(' Task does not exist.');
  }
});

app.get('/posts' , async (req , res) => {
  try {
    let tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (e) {
    res.status(400).send('There is no users yet in our database.');
  }
});

app.listen(PORT , () => {
  console.log(`The server is runnig on PORT ${PORT}`);
});
