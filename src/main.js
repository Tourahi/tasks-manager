const express = require('express');
const connectDB = require('./db/mongoose.js');
const Task = require('./models/Task.js');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8080;

//Database setUp
connectDB();

//middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Routes
app.use(require('./routes/User.route.js'));
app.use(require('./routes/Task.route.js'));


app.listen(PORT , () => {
  console.log(`The server is runnig on PORT ${PORT}`);
});
