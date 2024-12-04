import React, { useState } from "react";
import "../style/Game.css";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_HEROKU_URL || 'http://localhost:5000';

const ParInput = ({ game, course }) => {
    const navigate = useNavigate();
    const [currentHole, setCurrentHole] = useState(1);
    const [scores, setScores] = useState(
        game.players.map(player => ({ name: player.name, scores: Array(course.holes.length).fill(null) }))
    );

    const handleScoreChange = (playerIndex, scoreIndex, value) => {
        const newScores = [...scores];
        newScores[playerIndex].scores[scoreIndex] = value;
        setScores(newScores);
    };

    const navigateHome = () => {
        navigate('/');
    };

    const handleNextHole = () => {
        if (currentHole < course.holes.length) {
            setCurrentHole(currentHole + 1);
        }
    };

    const handlePreviousHole = () => {
        if (currentHole > 1) {
            setCurrentHole(currentHole - 1);
        }
    };

    const handleSubmit = async () => {
        const updatedGame = {
            ...game,
            players: game.players.map((player, index) => ({
                ...player,
                scores: scores[index].scores
            })),
            scores: game.players.map((player, index) => ({
                player: player._id,
                scores: scores[index].scores
            }))
        };
        // Make a POST request with updatedGame data

        updatedGame.players.forEach((player, index) => {
            //console.log(`Player ${index + 1} - ${player.name}: Scores -`, player.scores);
        });

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/api/users/games`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedGame)
            });

            if (!response.ok) throw new Error('Failed to create game');

            const data = await response.json();
            console.log('Game created:', data);
            navigate('/recap', { state: { game: updatedGame, course } });
        } catch {
            console.error('Failed to create game');
        }
    };

    return (
        <div className="par-input-container">
            <p className="hole-title">Hole {currentHole}</p>
            <p className="par-title">Par {course.holes[currentHole - 1].par}</p>

            <div className="parInput-divider"></div> 

            {game.players.map((player, playerIndex) => (
                <div className="player-par-inputs" key={playerIndex}>
                    <h3>{player.name}</h3>
                    <div className="score-buttons">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((score) => (
                            <button
                                key={score}
                                onClick={() => handleScoreChange(playerIndex, currentHole - 1, score)}
                                className={`par-value-button ${scores[playerIndex].scores[currentHole - 1] === score ? 'active' : ''}`}
                            >
                                {score}
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            <div className="buttons">
                {currentHole === 1 && <button className="parInput-nav-buttons" onClick={navigateHome}>Home</button>}
                {currentHole > 1 && <button className="parInput-nav-buttons" onClick={handlePreviousHole}>Last Hole</button>}
                {currentHole < course.holes.length && <button className="parInput-nav-buttons" onClick={handleNextHole}>Next Hole</button>}
                {currentHole === course.holes.length && <button className="parInput-nav-buttons" onClick={handleSubmit}>Submit</button>}
            </div>
        </div>
    );
};

export default ParInput;
