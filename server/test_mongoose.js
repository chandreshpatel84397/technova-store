const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

console.log('Connecting to MongoDB...');
mongoose.connect('xuioujy.mongodb.net/technova')
  .then(() => console.log('connected'))
  .catch(err => {
    console.error('MongoDB connection error message:', err.message);
    process.exit(1);
  });
