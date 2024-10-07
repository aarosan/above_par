const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Import bcrypt
const connection = require('../config/connection'); // Import your existing connection

const seedDB = async () => {
    await User.deleteMany(); // Clear existing users
  
    const saltRounds = 10; // Adjust this value for security
  
    // Create users with hashed passwords
    const hashedPassword1 = await bcrypt.hash('password1', saltRounds);
    const user1 = new User({
      firstName: 'Alice',
      lastName: 'Smith',
      username: 'alice',
      password: hashedPassword1, // Use the hashed password
    });
  
    const hashedPassword2 = await bcrypt.hash('password2', saltRounds);
    const user2 = new User({
      firstName: 'Bob',
      lastName: 'Johnson',
      username: 'bob',
      password: hashedPassword2, // Use the hashed password
    });
  
    // Save users to DB
    await user1.save();
    await user2.save();

    console.log('Database seeded');
};

const runSeed = async () => {
    // Ensure the connection is established before running the seed
    connection.on('connected', async () => {
      await seedDB();
      mongoose.connection.close();
    });
  
    connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
  };
  
  // Start the seeding process
  runSeed();