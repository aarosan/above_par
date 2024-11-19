import { useState, useEffect } from 'react';

const apiUrl = process.env.REACT_APP_HEROKU_URL || 'http://localhost:5000';

export const useCourses = () => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${apiUrl}/api/users/courses`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const courseData = await response.json();
                setCourses(courseData);
                setError(null);
            } catch (error) {
                setError(`Failed to fetch courses: ${error}`);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return { courses, error, loading, setCourses};
};