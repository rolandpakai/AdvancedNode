const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.connection.on('open', () => {
  // console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB error: ', error);
});

async function mongoDisconnect() {
  await mongoose.disconnect();
}

async function mongoConnect() {
  await mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
  });
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
}