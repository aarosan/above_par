const mongoose = require('mongoose');

const { Schema } = mongoose;

const playerSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
