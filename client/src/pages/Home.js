import React, { useEffect } from 'react';
import '../style/Home.css';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/jwtUtils';

// const apiUrl = process.env.REACT_APP_HEROKU_URL || 'http://localhost:5000';

const Home = ({ signOut }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (isTokenExpired(token)) {
            navigate('/login');
        } 
    }, [navigate]);

    return (
        <div className="home-container">
            <div className="header-container">
                <div className="header-actions">
                    <button onClick={signOut} className="sign-out-button">
                        Sign Out
                    </button>
                </div>
            </div>

            <div className="home-content">
                <h1>Welcome to the Home Page</h1>
            </div>
        </div>
    )
}

export default Home;