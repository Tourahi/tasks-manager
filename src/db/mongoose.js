const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://127.0.0.1:27017';
const DBNAME    = 'task-manager-api';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect( MONGO_URI+`/${DBNAME}`, {
      useNewUrlParser : true ,
      useUnifiedTopology: true,
      useFindAndModify : false,
      useCreateIndex : true
    });
    console.log(`MongoDB connected : ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

module.exports = connectDB;
