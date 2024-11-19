import React, { useEffect, useState } from 'react';
import '../style/Home.css';
import { useNavigate } from 'react-router-dom';
import colors from '../utils/colors';
import { isTokenExpired } from '../utils/jwtUtils';
import { useCourses } from '../hooks/useCourses';
import CourseButton from '../components/CourseButton';

const Home = ({ signOut }) => {
    const { courses } = useCourses();
    const [course, setCourse] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || isTokenExpired(token)) {
            signOut();
            navigate('/login');
            return;
        }   
    }, [navigate, signOut]);
        
    const addCourse = () => navigate('/course');
    const viewStats = () => navigate('/stats');
    const gameSetup = (course) => {
        setCourse(course);
        navigate('/setup', { state: { course } });
    };

    return (
        <div className="home-container">
            <div className="home-header">
                <h1 className="home-title">Select Course</h1>
            </div>
            <div className="course-list">
                {courses.map((course, index) => (
                    <div key={`${course.id}-${index}`} className="course-card">
                        <CourseButton 
                            onClick={() => gameSetup(course)}
                            color={colors[course.color]}
                        >
                            <p className="course-name">
                                {course.courseName}
                            </p>
                        </CourseButton>
                    </div>
                ))}
            </div>
            <div className="divider"></div> 
            <div className="home-footer">
                <button onClick={addCourse} className="add-course-button">
                    Add Course +
                </button>
                <button onClick={viewStats} className="view-stats-button">
                    View Stats
                </button>
                <button onClick={signOut} className="sign-out-button">
                    Sign Out
                </button>
            </div>
        </div>
    )
}

export default Home;