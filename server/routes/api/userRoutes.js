const express = require('express');
const router = express.Router();
const { signup, login } = require('../../controllers/userController');
const { getCourses, createCourse } = require('../../controllers/courseController');
const { getGames, createGame } = require('../../controllers/gameController');
const { getAllUserData, getGamesAndScores } = require('../../controllers/statsController');
const { getPlayers, addPlayer } = require('../../controllers/playerController');
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

router.get('/players', getPlayers);
router.post('/players', addPlayer);

// Stats routes
router.get('/stats', (req, res) => {
    res.send('Stats!');
});

router.get('/getalluserdata', getAllUserData);
router.get('/getgamesandscores', getGamesAndScores);

module.exports = router;