import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import '../style/Login.css';

const apiUrl = process.env.REACT_APP_HEROKU_URL || 'http://localhost:5000';

const Signup = ({ setToken }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const response = await fetch(`${apiUrl}/api/users/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, email, password }),
        });
        if (response.ok) {
            const data = await response.json();
            signIn(data.token);
            navigate('/');
        } else {
            alert('Signup failed');
        }
    };

    return (
        <div className="sign-up-form-container">
                
                <img src='/assets/logo.svg' alt="Above Par Logo" />

                <form className="sign-up-form-container-information" onSubmit={handleSubmit}>

                    <input
                    className="text-input"
                    placeholder='first name'
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    />

                    <input
                    className="text-input"
                    placeholder='last name'
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    />

                    <input
                    className="text-input"
                    placeholder='email'
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                    className="text-input"
                    placeholder='password'
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className='signup-buttons'>
                        <button className="play-golf"type="submit">play golf!</button>
                        <button className="login-return" onClick={() => navigate('/login')}>login</button>
                    </div>

                </form>
            </div>
    )
}

export default Signup;