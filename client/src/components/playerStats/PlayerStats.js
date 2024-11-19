import React, { useState } from 'react';
import { VertBarBestWorstHole } from './VertBarBestWorstHole';
import { StackedBarAvgHole } from './StackedBarAvgHole';
import { LineGrowthTotalByGame } from './LineGrowthTotalByGame';

const apiUrl = process.env.REACT_APP_HEROKU_URL || 'http://localhost:5000';

const PlayerStats = ({ userData }) => {
    const token = localStorage.getItem('token');
    const [gameInformation, setGameInformation] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [selectedPlayerName, setSelectedPlayerName] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedCourseName, setSelectedCourseName] = useState('');

    const handlePlayerChange = (event) => {
        const player = getPlayerInfo(event.target.value);
        setSelectedPlayer(player);
        setSelectedPlayerName(player.name);
    };

    const handleCourseChange = (event) => {
        const course = getCourseInfo(event.target.value);
        setSelectedCourse(course);
        setSelectedCourseName(course.courseName);
    };

    const getPlayerInfo = (playerName) => {
        const player = players.find((player) => player.name === playerName);
        return player;
    }

    const getCourseInfo = (courseName) => {
        const course = courses.find((course) => course.courseName === courseName);
        return course;
    }

    const getGameInformation = async (player, course) => {
        const games = userData.games;
        const player_id = player._id;
        const playerGames = games.filter((game) => game.players.some(player => player.includes(player_id)));
        const playerCourseGames = playerGames.filter((game) => game.course === course._id);
        
        const updatedPlayerCourseGames = await Promise.all(playerCourseGames.map(async (game) => {
            const courseName = await getCourseNameById(game.course);
            const scoresWithPlayerNames = await Promise.all(game.scores.map(async (score) => {
                const playerName = await getPlayerNameById(score.player);
                return { ...score, player: playerName };
            }));
            return { ...game, course: courseName, scores: scoresWithPlayerNames, date: new Date(game.date).toLocaleDateString() };
        }));
        
        setGameInformation(updatedPlayerCourseGames);
        return updatedPlayerCourseGames;
    }

    const getCourseNameById = async (courseId) => {
        try {
            const response = await fetch(`${apiUrl}/api/users/courses/${courseId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const courseData = await response.json();
            return courseData.courseName;
        } catch (error) {
            console.error(`Failed to fetch course name: ${error}`);
            return 'Unknown Course';
        }
    };

    const getPlayerNameById = async (playerId) => {
        try {
            const response = await fetch(`${apiUrl}/api/users/players/${playerId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
    
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const playerData = await response.json();
            return playerData.name;
        } catch (error) {
            console.error(`Failed to fetch player name: ${error}`);
            return 'Unknown Player';
        }
    };

    const players = userData.players;
    const courses = userData.courses;

    const playerOptions = React.useMemo(() => (
        players.map((player, index) => (
            <option key={player.id || index} value={player.id}>{player.name}</option>
        ))
    ), [players]);
    
    const courseOptions = React.useMemo(() => (
        courses.map((course, index) => (
            <option key={course.id || index} value={course.id}>{course.courseName}</option>
        ))
    ), [courses]);

    return (
        <div className='user-input-stats-container'>
            
            <div>
                <select className="input-select" id="player-select" value={selectedPlayerName || ''} onChange={handlePlayerChange}>
                    {selectedPlayerName ? null : <option value="">--Please choose a player--</option>}
                    {playerOptions}
                </select>
            </div>
            <div>
                <select className="input-select" id="course-select" value={selectedCourseName || ''} onChange={handleCourseChange}>
                    {selectedCourseName ? null : <option value="">--Please choose a course--</option>}
                    {courseOptions}
                </select>
            </div>

            <div>
                <button className="stats-button" onClick={() => getGameInformation(selectedPlayer, selectedCourse)}>Get Game Information</button>
            </div>

            {gameInformation.length > 0 && (
                <div className="game-information">
                    <VertBarBestWorstHole gameInformation={gameInformation} selectedPlayer={selectedPlayer} />
                    <StackedBarAvgHole gameInformation={gameInformation} selectedPlayer={selectedPlayer} selectedCourse={selectedCourse} />
                    <LineGrowthTotalByGame gameInformation={gameInformation} selectedPlayer={selectedPlayer} />
                    
                </div>
            )}
            
        </div>
    );
}

export default PlayerStats;