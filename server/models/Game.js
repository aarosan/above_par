const mongoose = require('mongoose');
const { Schema } = mongoose;

const gameSchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  }],
  scores: [{
    player: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true
    },
    score: [{
      type: Number,
      required: true
    }]
  }],
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
