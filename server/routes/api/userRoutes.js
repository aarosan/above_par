const express = require('express');
const router = express.Router();
const { signup, login } = require('../../controllers/userController');
const authenticateToken = require('../../middleware/auth');

// User routes
router.post('/signup', signup);
router.post('/login', login);

router.use(authenticateToken); // Authenticate for all following routes

module.exports = router;