const User = require('../models/User');
const Game = require('../models/Game');
const Course = require('../models/Course');
const Player = require('../models/Player');

const getAllUserData = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const games = await Game.find({ createdBy: req.userId });
        const courses = await Course.find({ createdBy: req.userId });
        const players = await Player.find({ user: req.userId });
        res.json({ user, games, courses, players });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getGamesAndScores = async (req, res) => {
    try {
        const games = await Game.find({ createdBy: req.userId });
        const players = await Player.find({ user: req.userId });
        res.json({ games, players });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAllUserData, getGamesAndScores };