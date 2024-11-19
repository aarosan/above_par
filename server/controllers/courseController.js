const Course = require('../models/Course');
const User = require('../models/User');

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find(
      { createdBy: req.userId },
      'courseName numberOfHoles holes totalPar color createdBy _id'
    );
    res.setHeader('Content-Type', 'application/json');
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createCourse = async (req, res) => {
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

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getCourses, createCourse, getCourseById };
