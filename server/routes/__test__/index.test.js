process.env.NODE_ENV = 'test';
const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../../models/User');
const Game = require('../../models/Game');
const Course = require('../../models/Course');
const Player = require('../../models/Player');
const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('../index');

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

describe('Test the root path', () => {
    it('GET /', async () => {
        const res = await request(app).get('/')
    
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Basic Test Works!');
    })

    it('GET /wrongroute', async () => {
        const res = await request(app).get('/wrongroute')
    
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Wrong route!');
    });
}); 

describe('Test the api route', () => {
    it('GET /api/test', async () => {
        const res = await request(app).get('/api/test')
    
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Hello World!');
    })
}); 

describe('Test the user route', () => {
    beforeAll(async () => {
      await mongoose.connect(process.env.TEST_MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });
  
    afterEach(async () => {
      await User.deleteMany({});
    });
  
    afterAll(async () => {
      await mongoose.connection.close();
    });
  
    it('POST /api/users/signup should create a new user and return a JWT token', async () => {
      const res = await request(app).post('/api/users/signup').send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password'
      });
  
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(typeof res.body.token).toBe('string');
    });

    it('POST /api/users/login should return a JWT token', async () => {
        await request(app).post('/api/users/signup').send({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'password'
        });
    
        const res = await request(app).post('/api/users/login').send({
            email: 'john@example.com',
            password: 'password'
        });
    
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(typeof res.body.token).toBe('string');
    });
});

describe('Test the authenticated course and game routes', () => {
    let token;
    let userId;
  
    beforeAll(async () => {
      await mongoose.connect(process.env.TEST_MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });
  
    afterEach(async () => {
      await User.deleteMany({});
      await Game.deleteMany({});
      await Course.deleteMany({});
    });
  
    afterAll(async () => {
      await mongoose.connection.close();
    });
  
    it('should sign up and log in a user to obtain a JWT token', async () => {
      // Sign up the user
      await request(app).post('/api/users/signup').send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password'
      });

      const user = await User.findOne({ email: 'john@example.com' });
      userId = user._id;
  
      // Log in the user
      const res = await request(app).post('/api/users/login').send({
        email: 'john@example.com',
        password: 'password'
      });
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      token = res.body.token;
    });
  
    console.log('Token Test:', token);
  
    it('should create a new game with JWT token', async () => {
      const course = await new Course({
        courseName: 'Test Course',
        numberOfHoles: 9,
        holes: [
            { holeNumber: 1, par: 4 },
            { holeNumber: 2, par: 4 },
            { holeNumber: 3, par: 4 },
            { holeNumber: 4, par: 4 },
            { holeNumber: 5, par: 4 },
            { holeNumber: 6, par: 4 },
            { holeNumber: 7, par: 4 },
            { holeNumber: 8, par: 4 },
            { holeNumber: 9, par: 4 },
        ],
        totalPar: 36,
        color: 'Blue',
        createdBy: userId
      }).save();

      const player1 = await new Player({ name: 'Alice', user: userId }).save();
      const player2 = await new Player({ name: 'Bob', user: userId }).save();
  
      const gameData = {
        courseName: 'Test Course',
        color: 'Blue',
        numberOfHoles: 9,
        totalPar: 36,
        date: new Date(),
        players: [player1._id, player2._id]
      };
  
      const res = await request(app)
        .post('/api/users/games')
        .set('Authorization', `Bearer ${token}`) 
        .send(gameData);
  
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('courseName', gameData.courseName);
    });
  

    it('should access /api/user/games route with JWT token', async () => {
        const res = await request(app)
          .get('/api/users/games')
          .set('Authorization', `Bearer ${token}`); 
    
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true); 
      });

    it('should create a new course with JWT token', async () => {
        const courseData = {
            courseName: 'Test Course',
            numberOfHoles: 9,
            holes: [
                { holeNumber: 1, par: 4 },
                { holeNumber: 2, par: 4 },
                { holeNumber: 3, par: 4 },
                { holeNumber: 4, par: 4 },
                { holeNumber: 5, par: 4 },
                { holeNumber: 6, par: 4 },
                { holeNumber: 7, par: 4 },
                { holeNumber: 8, par: 4 },
                { holeNumber: 9, par: 4 },
            ],
            totalPar: 36,
            color: 'Green',
            createdBy: userId
        };
    
        const res = await request(app)
          .post('/api/users/courses')
          .set('Authorization', `Bearer ${token}`) 
          .send(courseData);
    
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('courseName', courseData.courseName);
      });

    it('should access /api/users/courses route with JWT token', async () => {
      const res = await request(app)
        .get('/api/users/courses')
        .set('Authorization', `Bearer ${token}`); 

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true); 
    });    
  });