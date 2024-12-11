import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../style/Home.css";

const NavBar = () => {
    const navigate = useNavigate();

    const navigateHome = () => navigate('/');
    const navigateStats = () => navigate('/stats');

    return (
        <nav>
            <button className="nav-button" onClick={navigateHome}>Home</button>
            <button className="nav-button" onClick={navigateStats}>Stats</button>
        </nav>
    );
};

export default NavBar;