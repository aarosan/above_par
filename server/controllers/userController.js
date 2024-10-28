const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signup = async (req, res) => {
  console.log('signup function invoked');
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log('Signup Request body:', req.body);
   
    const newUser = new User({ firstName, lastName, email, password });
    console.log('New  user:', newUser)
    await newUser.save();
    console.log('User saved with hashed password:', newUser.password);

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Return token as JSON
    res.status(201).json({ token });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send('Internal server error');
  }
};

const login = async (req, res) => {
  console.log('login function invoked');

  try {
    const { email, password } = req.body; // This retrieves the email and password from the request body
    console.log('Request body:', req.body);
    
    const user = await User.findOne({ email });
    console.log('User found:', user);
    if (!user) {
      return res.status(401).send('Invalid credentials');
    }
    console.log('Checking password now');
    // Use the password from the request body here
    console.log('Password given:', password);
    console.log('User password', user.password);
    const isMatch = await bcrypt.compare(password, user.password); // Change 'password1' to 'password'
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(401).send('Invalid credentials');
    }

    // Sign token with userId in payload
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal server error');
  }
};


module.exports = { signup, login };