const Course = require('../models/Course');
const User = require('../models/User');

const getCourses = async (req, res) => {
  console.log('getCourses function invoked');
  try {
    const courses = await Course.find({ createdBy: req.userId }, 'courseName numberOfHoles holes totalPar color');
    res.setHeader('Content-Type', 'application/json');
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createCourse = async (req, res) => {
  console.log('createCourse function invoked');
  try {
    const { courseName, numberOfHoles, holes, totalPar, color } = req.body;

    const newCourse = new Course({
      courseName,
      numberOfHoles,
      holes,
      totalPar,
      color,
      createdBy: req.userId
    });

    const savedCourse = await newCourse.save();

    await User.findByIdAndUpdate(
      req.userId,
      { $push: { courses: savedCourse._id } },
      { new: true }
    );

    res.status(201).json(savedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getCourses, createCourse };
