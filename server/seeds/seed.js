const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');
const Game = require('../models/Game');
const Player = require('../models/Player');
const connection = require('../config/connection');

const seedDB = async () => {
    await User.deleteMany();
    await Course.deleteMany();
    await Game.deleteMany();
    await Player.deleteMany();

    const saltRounds = 10;

    // Create users with hashed passwords
    const user1 = new User({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      password: 'password1',
    });

    const user2 = new User({
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob@example.com',
      password: 'password2',
    });

    await user1.save();
    await user2.save();

    // Create players associated with users
    const player1 = new Player({ name: 'Lucy', user: user1._id });
    const player2 = new Player({ name: 'Linus', user: user2._id });
    
    await player1.save();
    await player2.save();

    // Create courses for the users
    const course1 = new Course({
      courseName: 'Sunny Greens',
      numberOfHoles: 18,
      holes: Array.from({ length: 18 }, (_, i) => ({ holeNumber: i + 1, par: 4 })),
      totalPar: 72,
      color: 'Green',
      createdBy: user1._id
    });
    
    const course2 = new Course({
      courseName: 'Ocean Breeze',
      numberOfHoles: 9,
      holes: Array.from({ length: 9 }, (_, i) => ({ holeNumber: i + 1, par: 3 })),
      totalPar: 27,
      color: 'Blue',
      createdBy: user2._id
    });

    const course3 = new Course({
      courseName: 'Arctic Freeze',
      numberOfHoles: 9,
      holes: Array.from({ length: 9 }, (_, i) => ({ holeNumber: i + 1, par: 3 })),
      totalPar: 27,
      color: 'Purple',
      createdBy: user1._id
    });

    const course4 = new Course({
      courseName: 'Sunny Fires',
      numberOfHoles: 9,
      holes: Array.from({ length: 9 }, (_, i) => ({ holeNumber: i + 1, par: 3 })),
      totalPar: 27,
      color: 'Red',
      createdBy: user1._id
    });

    const course5 = new Course({
      courseName: 'Forest River',
      numberOfHoles: 9,
      holes: Array.from({ length: 9 }, (_, i) => ({ holeNumber: i + 1, par: 3 })),
      totalPar: 27,
      color: 'Blue',
      createdBy: user1._id
    });

    await course1.save();
    await course2.save();
    await course3.save();
    await course4.save();
    await course5.save();

    // Create games associated with courses and players
    const game1 = new Game({
      course: course1._id,
      date: new Date(),
      players: [player1._id],
      scores: [{
        player: player1._id,
        score: Array.from({ length: 18 }, () => Math.floor(Math.random() * 5) + 1) // Random scores for 18 holes
      }],
      createdBy: user1._id
    });

    const game2 = new Game({
      course: course2._id,
      date: new Date(),
      players: [player2._id],
      scores: [{
        player: player2._id,
        score: Array.from({ length: 9 }, () => Math.floor(Math.random() * 4) + 1) // Random scores for 9 holes
      }],
      createdBy: user2._id
    });

    await game1.save();
    await game2.save();

    // Update users to reference courses, games, and players
    user1.courses.push(course1._id, course3._id, course4._id, course5._id);
    user1.games.push(game1._id);
    user1.players.push(player1._id);
    await user1.save();

    user2.courses.push(course2._id);
    user2.games.push(game2._id);
    user2.players.push(player2._id);
    await user2.save();

    console.log('Database seeded with users, courses, games, and players');
};

const runSeed = async () => {
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
