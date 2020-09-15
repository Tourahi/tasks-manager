const connectDB = require('../src/db/mongoose.js');
const User = require('../src/models/User.js');
const Task = require('../src/models/Task.js');

connectDB();

Task.deleteOne({_id : '5f60bf1483ddd179f1d6a062'}).then(() => {
  return Task.find({status : { $eq : false }});
}).then((tasks) => {
  console.log(tasks);
}).catch((err) => {
  console.log(err);
});
