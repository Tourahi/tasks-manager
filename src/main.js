const express = require('express');
const connectDB = require('./db/mongoose.js');
const User = require('./models/User.js');
const Task = require('./models/Task.js');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({extended:false}));
app.use(express.json());
connectDB();


app.post('/users' , (req , res) => {
  const user = new User(req.body);
  user.save().then(() => {
    res.status(201).send(user);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/users/:id', async (req , res) => {
  let _id = req.params.id;
  User.findById(_id)
              .then(( user ) => {
                res.status(200).send(user);
              }).catch((err) => {
                res.status(404).send('User does not exist.');
              });
});

app.get('/users' , async (req , res) => {
    console.log("in users");
  let users = await User.find({});
  if(!users) return res.status(400).send('There is no users yet in our database.');
  res.status(200).send(users);
});


//Posts
app.post('/posts' , (req , res) => {
  const task = new Task(req.body);
  task.save()
      .then(() => {
        res.status(201).send(task);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
});

app.get('/posts/:id', async (req , res) => {
  let _id = req.params.id;
  Task.findById(_id)
              .then(( task ) => {
                res.status(200).send(task);
              }).catch((err) => {
                res.status(404).send('Task does not exist.');
              });
});

app.get('/posts' , async (req , res) => {
    console.log("in users");
  let tasks = await Task.find({});
  if(!tasks) return res.status(400).send('There is no users yet in our database.');
  res.status(200).send(tasks);
});

app.listen(PORT , () => {
  console.log(`The server is runnig on PORT ${PORT}`);
});
