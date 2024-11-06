import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import colors from "../utils/colors";
import '../style/Recap.css';

const Recap = () => {
    const location = useLocation();
    const [game, setGame] = useState(() => {
        const savedGame = localStorage.getItem('game');
        return savedGame ? JSON.parse(savedGame) : location.state?.game;
    });
    const course = location.state?.course;

    useEffect(() => {
        if (game?.players) {
            const updatedPlayers = getTotals(game.players);
            setGame(prevGame => ({ ...prevGame, players: updatedPlayers }));
            localStorage.setItem('game', JSON.stringify({ ...game, players: updatedPlayers }));
        }
    }, [game]);

    const getTotals = (players) => {
        return players.map(player => ({
            ...player,
            total: player.scores.reduce((a, b) => a + b, 0)
        }));
    }

    const findWinner = (players) => {
        let winner = players[0];
        players.forEach(player => {
            if (player.total < winner.total) {
                winner = player;
            }
        });
        return winner;
    }

    return (
        <div className="recap-container">
            <h1 className="winning-title">{findWinner(game.players).name} Wins!</h1>

            <div className="nav-buttons">
                <button className="return-button" onClick={() => window.location.href = '/'}>home</button>
                <button className="return-button" onClick={() => window.location.href = '/stats'}>stats</button>
            </div>

            <div className="player-totals">
                {game?.players.map(player => (
                    <div className="individual-player-total" key={player.name}>
                        <p className="recap-name">{player.name}</p>
                        <p className="recap-total">{player.total}</p>
                    </div>
                ))}
            </div>

            <div className="hole-details">
                {course?.holes.map(hole => (
                    <div className="hole-information" key={hole.holeNumber}>
                        <div className="hole-header">
                            <p>hole {hole.holeNumber} - par {hole.par}</p>
                        </div>
                        <div className="hole-scores">
                            {game?.players.map(player => (
                                <div className="individual-hole-scores" key={player.name}>
                                    <p className="recap-name">{player.name}</p>
                                    <p 
                                        className="recap-total" 
                                        style={{
                                            backgroundColor: player.scores[hole.holeNumber - 1] < hole.par ? `${colors.Green.light}` : 
                                                   player.scores[hole.holeNumber - 1] === hole.par ? `${colors.Blue.light}` : 
                                                   `${colors.Red.light}`,
                                            border: `1px solid ${player.scores[hole.holeNumber - 1] < hole.par ? colors.Green.dark : 
                                                   player.scores[hole.holeNumber - 1] === hole.par ? colors.Blue.dark : 
                                                   colors.Red.dark}`
                                    
                                        }}
                                    >
                                        {player.scores[hole.holeNumber - 1]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Recap;
