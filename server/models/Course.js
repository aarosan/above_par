const mongoose = require('mongoose');

const { Schema } = mongoose;

const holeSchema = new mongoose.Schema({
    holeNumber: {
        type: Number,
        required: true
    },
    par: {
        type: Number,
        required: true
    }
});

const courseSchema = new Schema({
    courseName: {
        type: String,
        required: true,
        trim: true,
    },
    numberOfHoles: {
        type: Number,
        required: true
    },
    holes: [holeSchema],
    totalPar: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
        required: true,
    }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
