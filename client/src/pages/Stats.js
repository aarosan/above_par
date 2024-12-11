import React, { useEffect, useState } from "react";
import "../style/Stats.css";
import { useUserData } from '../hooks/useUserData';
import CourseStats from '../components/courseStats/CourseStats';
import GameStats from "../components/gameStats/GameStats";
import PlayerStats from "../components/playerStats/PlayerStats";
import NavBar from "../components/NavBar";

const apiUrl = process.env.REACT_APP_HEROKU_URL || 'http://localhost:5000';

const Stats = () => {
    const { userData } = useUserData();
    const [games, setGames] = useState([]);
    const [statsDefault, setStatsDefault] = useState(true);
    const [showGames, setShowGames] = useState(false);
    const [gameSelected, setGameSelected] = useState(false);
    const [courseSelected, setCourseSelected] = useState(false);
    const [playerSelected, setPlayerSelected] = useState(false);
    const token = localStorage.getItem('token');
    const [dataFetched, setDataFetched] = useState(false);

    useEffect(() => {
        if (userData && userData.games && !dataFetched) {
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

            const fetchCourseNames = async () => {
                const updatedGames = await Promise.all(userData.games.map(async (game) => {
                    const courseName = await getCourseNameById(game.course);
                    const scoresWithPlayerNames = await Promise.all(game.scores.map(async (score) => {
                        const playerName = await getPlayerNameById(score.player);
                        return { ...score, player: playerName };
                    }));
                    return { ...game, course: courseName, scores: scoresWithPlayerNames };
                }));
                setGames(updatedGames);
                setDataFetched(true); // Set the flag to true after data is fetched
            };
            fetchCourseNames();
        }
    }, [userData, token, dataFetched]);

    //console.log('games', games);
    //console.log('userData', userData);
    
    const getTotalScore = (scores) => {
        //console.log(scores)
        return scores.reduce((acc, score) => acc + score, 0);
    }

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const showGameStats = () => {
        //console.log('game selected');
        setStatsDefault(false);
        setCourseSelected(false);
        setPlayerSelected(false);
        setGameSelected(true);
    }

    const showCourseStats = () => {
        //console.log('course selected');
        setStatsDefault(false);
        setGameSelected(false);
        setPlayerSelected(false);
        setCourseSelected(true);
    }

    const showPlayerStats = () => {
        //console.log('player selected');
        setStatsDefault(false);
        setGameSelected(false);
        setCourseSelected(false);
        setPlayerSelected(true);
    }

    return (
        <div className="stats-container">
            <NavBar />
            <h1>Stats Page</h1>
            <p className="show-games" onClick={() => setShowGames(!showGames)}>Toggle Games</p>
            <div className="stats-buttons">
                <button className="stats-button" onClick={showGameStats}>Games</button>
                <button className="stats-button" onClick={showCourseStats}>Courses</button>
                <button className="stats-button" onClick={showPlayerStats}>Players</button>
            </div>

            <div className="stats">

                <div className="stats-divider"></div>

                <div className="data-container">
                    
                    {statsDefault && (
                        
                        <div className="data-stats">
                            <p>Welcome! To begin, please select what kind of data you would like to see!</p>
                        </div>
                    )}


                    {gameSelected && (
                        <div className="data-stats">
                            <p>Game Statistics</p>
                            <GameStats games={games}/>
                        </div>      
                    )}

                    {courseSelected && (
                        <div className="data-stats">
                            <p>Course Statistics</p>
                            <CourseStats userData={userData}/>
                        </div>      
                    )}
                
                    {playerSelected && (
                        <div className="data-stats">
                            <p>Player Statistics</p>
                            <PlayerStats games={games} userData={userData}/>
                        </div>      
                    )}
                </div>


                <div className="stats-divider"></div>
    
                {showGames && games.map((game, gameIndex) => (
                    <div className="game-stats" key={gameIndex}>
                        <h3>All Games</h3>
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
    );
}

export default Stats;