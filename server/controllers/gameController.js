const mongoose = require('mongoose');
const Game = require('../models/Game');
const Course = require('../models/Course');
const User = require('../models/User');

const getGames = async (req, res) => {
  console.log('getGames function invoked');
  console.log('req.userId:', req.userId);
  try {
    const games = await Game.find({ createdBy: req.userId })

    console.log('games:', games);

    res.setHeader('Content-Type', 'application/json');
    res.json(games);
  } catch (error) {
    console.log('Error:', error);
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createGame = async (req, res) => {
  console.log('createGame function invoked');
  try {
    const { course, players, date, scores, createdBy } = req.body;
    console.log(course);
    
    const currentCourse = await Course.findById(course);
    if (!currentCourse) return res.status(400).json({ error: 'Invalid course' });


    const newGame = new Game({
      course: course,
      date: date || new Date(),
      players,
      scores,
      createdBy: createdBy || req.userId 
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
