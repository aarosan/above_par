import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Course from './pages/Course';
import Stats from './pages/Stats';
import Setup from './pages/Setup';
import Game from './pages/Game';
import Recap from './pages/Recap';

import './App.css';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const signIn = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  }

  const signOut = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  };

  return context;
}

const App = () => {
  const { token, signOut } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={token ? <Home signOut={signOut} /> : <Navigate to="/login" />}
      />    
      <Route path="/course" element={<Course />} />
      <Route path="/stats" element={<Stats />} />
      <Route path="/setup" element={<Setup />} />
      <Route path="/game" element={<Game />} />
      <Route path="/recap" element={<Recap />} />


    </Routes>
  );
};

const AppWrapper = () => {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
};

export default AppWrapper;