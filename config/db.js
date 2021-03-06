const mongoose = require('mongoose');

const url = 'mongodb://localhost/tacobell';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  // ssl: true,  True by default by the use of "mongodb+srv://"
//   sslValidate: false,
};

mongoose.connect(url2, options, (err) => {
  if(!err) {
    console.log('Server is connected to mongo'); 
  }
  else {
    console.log('connection error: ' + err);
  }
});
