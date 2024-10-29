import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import '../style/Login.css';

const apiUrl = process.env.REACT_APP_HEROKU_URL || 'http://localhost:5000';

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${apiUrl}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            signIn(data.token);
            navigate('/');
        } else {
            alert('Invalid username or password');
        }
    };

    return (
        <div className="login-form-container">
                <img src='/assets/logo.svg' alt="Above Par Logo" />

                <form className="login-form-container-information"onSubmit={handleSubmit}>

                    <input
                    className="text-input"
                    placeholder='e-mail'
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

                    <button className="play-golf"type="submit">play golf!</button>

                </form>

                <p>
                    <Link className="signup-link" to="/signup">sign up</Link>
                </p>
        </div>
    )
}

export default Login;