const mongoose = require('mongoose');

const { Schema } = mongoose;

const gameSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    color: {
        type: String,
        required: true,
    },
    numberOfHoles: {
        type: Number,
        required: true
    },
    totalPar: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    players: [{
        player: {
            type: Schema.Types.ObjectId,
            ref: 'Player',
            required: true
        },
        scores: [{
            type: Number,
            required: true
        }]
    }]
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
