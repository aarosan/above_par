const mongoose = require('mongoose');
const Game = require('../models/Game');
const Course = require('../models/Course');
const User = require('../models/User');

const getGames = async (req, res) => {
  try {
    const games = await Game.find({ createdBy: req.userId })


    res.setHeader('Content-Type', 'application/json');
    res.json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createGame = async (req, res) => {
  try {
    const { course, players, date, scores, createdBy } = req.body;

    
    const currentCourse = await Course.findById(course);
    if (!currentCourse) return res.status(400).json({ error: 'Invalid course' });

    const formattedScores = scores.map(score => ({
      player: score.player,
      score: score.scores 
    }));

    const newGame = new Game({
      course: course,
      date: date || new Date(),
      players,
      scores: formattedScores,
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
