const Game = require('../models/Game');
const Course = require('../models/Course');
const User = require('../models/User');

const getGames = async (req, res) => {
  console.log('getGames function invoked');
  try {
    const games = await Game.find({ createdBy: req.userId }, 'courseName color numberOfHoles totalPar date players');
    res.setHeader('Content-Type', 'application/json');
    res.json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createGame = async (req, res) => {
  console.log('createGame function invoked');
  try {
    const { courseName, color, players, numberOfHoles, totalPar, date } = req.body;
    console.log(req.body);
    // Ensure the course exists
    const course = await Course.findOne({ courseName });
    if (!course) return res.status(400).json({ error: 'Invalid course' });

    const newGame = new Game({
      courseName: course.courseName,
      color,
      numberOfHoles,
      totalPar,
      date: date || new Date(),
      players,
      createdBy: req.userId 
    });

    const savedGame = await newGame.save();

    await User.findByIdAndUpdate(
      req.userId,
      { $push: { games: savedGame._id } },
      { new: true }
    );

    res.status(201).json(savedGame);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getGames, createGame };
