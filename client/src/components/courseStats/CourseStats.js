import React from 'react';
import { BarHoleNumber } from './barHoleNumber';

const CourseStats = ({ userData }) => {
    //console.log('CourseStats', games);
    return (
        <div className='course-stats-container'>
            <BarHoleNumber userData={userData} />
        </div>
    );
}

export default CourseStats;


