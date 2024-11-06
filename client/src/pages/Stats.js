import React, { useEffect, useState } from "react";
import "../style/Stats.css";

const apiUrl = process.env.REACT_APP_HEROKU_URL || 'http://localhost:5000';

const Stats = () => {
    const [games, setGames] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchGames = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${apiUrl}/api/users/games`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
    
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
                const gameData = await response.json();
                console.log('gameData', gameData);
                await fetchNames(gameData);
            } catch (error) {
                console.error(`Failed to fetch games: ${error}`);
            }
        };

        const getCourseNameById = async (courseId) => {
            try {
                const response = await fetch(`${apiUrl}/api/users/courses/${courseId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                console.log('getCourseNameById response', response);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
                const courseData = await response.json();
                console.log('courseData', courseData);
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
                console.log('playerData', playerData);
                return playerData.name;
            } catch (error) {
                console.error(`Failed to fetch player name: ${error}`);
                return 'Unknown Player';
            }
        };

        const fetchNames = async (gameData) => {
            const updatedGames = await Promise.all(gameData.map(async (game) => {
                const courseName = await getCourseNameById(game.course);
                const scoresWithPlayerNames = await Promise.all(game.scores.map(async (score) => {
                    const playerName = await getPlayerNameById(score.player);
                    return { ...score, player: playerName };
                }));
                return { ...game, course: courseName, scores: scoresWithPlayerNames };
            }));
            console.log('updatedGames', updatedGames);
            setGames(updatedGames);
        };

        fetchGames();
    }, [token]);
    
    console.log('games', games);

    const getTotalScore = (scores) => {
        console.log(scores)
        return scores.reduce((acc, score) => acc + score, 0);
    }

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="stats-container">
            <h1>Stats Page</h1>
            <h2>Games</h2>

            <div className="stats">
                
                {games.map((game, gameIndex) => (
                    <div className="game-stats" key={gameIndex}>
                        <div>{game.course}</div>
                        <div>{formatDate(game.date)}</div>
                        {game.scores.map((score, playerIndex) => (
                            <div className="player-game-stats" key={playerIndex}>
                                <div>{score.player}</div>
                                <div>{getTotalScore(score.score)}</div>
                            </div>
                        ))}
                    </div>      
                ))}

            </div>

        </div>
    )
}

export default Stats;
