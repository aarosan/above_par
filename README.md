# above_par

Welcome to Above Par! This project is a full-stack web application built using the MERN (MongoDB, Express.js, React, Node.js) stack. The application allows users to manage and track mini golf courses, including details about each course, the number of holes, par scores, and more. Users can create, view, and manage courses, making it perfect for mini golf enthusiasts!


## Table of Contents
- [Features](#features) 
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Features
User Authentication: Secure login and registration using JWT (JSON Web Tokens).

Course Management: Create, view, and manage mini golf courses.

Detailed Course Information: Each course includes details like name, number of holes, total par, color, and individual hole information.

Responsive Design: A user-friendly interface that works on both desktop and mobile devices.

Statistics: View stats for each course, enhancing user engagement.

User-specific Data: Each user can only view and manage their own courses.

## Technologies

This application is built with the following technologies:

Frontend:

- React: A JavaScript library for building user interfaces.
- Styled-Components: For writing CSS in JavaScript.
- Chart.js: A JavaScript library for creating charts and graphs, used for visualizing course statistics.

Backend:

- Node.js: JavaScript runtime for server-side development.
- Express.js: Web framework for building APIs.
- MongoDB: NoSQL database for storing user and course data.
- Mongoose: ODM (Object Data Modeling) library for MongoDB.
- JWT: For authentication.

## Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (running locally or using MongoDB Atlas)

### Clone the Repository

```bash
git clone https://github.com/aarosan/above_par.git
cd above_par
```

### Install Dependencies

Root Directory

```bash
npm install
```

### Environment Variables

Create a .env file in your server directory with the following variables:

- MONGODB_URI
- TEST_MONGODB_URI (If you want to run the route Jest tests)
- JWT_SECRET

### Start the Application

Root Directory

```bash
npm run start
```

## Usage

- Register/Login: Navigate to the login page to register or log in to your account.
- Manage Courses: Once logged in, you can add new mini golf courses, view existing ones, and track their details.
- Statistics: View stats for each course to get insights into your mini golf experiences.

## API Endpoints 

### Authentication
- **POST** `/api/user/signup`: Register a new user
- **POST** `/api/user/login`: Log in an existing user

### Course
- **GET** `api/users/courses`: Get all courses from a user
- **GET** `api/users/courses/:courseId`: Get a specific course from a user by the courseId
- **POST** `api/users/courses`: Add a course to the user's account

### Game
- **GET** `api/users/games`: Get all games from a user
- **POST** `api/users/games`: Add a game to the user's account

### Player
- **GET** `api/users/players`: Get all players from a user
- **GET** `api/users/players/:playerId`: Get a specific player from a user by the playerId
- **POST** `api/users/players`: Add a player to the user's account

### Stats
- **GET** `api/users/getAllUserData`: Get all data saved for the logged in user


## License

This project is licensed under the MIT License - see the LICENSE file for details.