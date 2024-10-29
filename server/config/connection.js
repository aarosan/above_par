const mongoose = require('mongoose');
require('dotenv').config();

const dbUri = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;
console.log('dbUri:', dbUri);

if (!dbUri) {
  throw new Error('Database URI environment variable is not set.');
}

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'abovePar' })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose.connection;
