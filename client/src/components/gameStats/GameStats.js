import React from 'react';
import { DonutGamesByCourse } from './donutGamesByCourse';
import { BarGamesByMonth } from './barGamesByMonth';

const GameStats = ({ games }) => {
    //console.log('CourseStats', games);
    return (
        <div className='course-stats-container'>
            <DonutGamesByCourse games={games} />
            <BarGamesByMonth games={games} />
        </div>
    );
}

export default GameStats;