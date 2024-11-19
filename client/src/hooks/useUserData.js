import { useState, useEffect } from 'react';

const apiUrl = process.env.REACT_APP_HEROKU_URL || 'http://localhost:5000';

export const useUserData = () => {
    const [userData, setUserData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${apiUrl}/api/users/getAllUserData`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const userData = await response.json();
                setUserData(userData);
                //console.log('userData', userData);
                setError(null);
            } catch (error) {
                setError(`Failed to fetch user data: ${error}`);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [token]);

    return { userData, error, loading };
}
