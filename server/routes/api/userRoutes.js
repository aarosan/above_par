const express = require('express');
const router = express.Router();
const { signup, login } = require('../../controllers/userController');
const { getCourses, createCourse } = require('../../controllers/courseController');
const { getGames, createGame } = require('../../controllers/gameController');
const authenticateToken = require('../../middleware/auth');

// User routes
router.post('/signup', signup);
router.post('/login', login);

router.use(authenticateToken); // Authenticate for all following routes

// Course routes
router.get('/courses', getCourses);
router.post('/courses', createCourse);

// Game routes
router.get('/games', getGames);
router.post('/games', createGame);

module.exports = router;