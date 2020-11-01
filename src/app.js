const express = require('express');
const connectDB = require('./db/mongoose.js');
const Task = require('./models/Task.js');
const app = express();
// require('dotenv').config();

//Database setUp
connectDB();

//middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Routes
app.use(require('./routes/User.route.js'));
app.use(require('./routes/Task.route.js'));

module.exports = app;
