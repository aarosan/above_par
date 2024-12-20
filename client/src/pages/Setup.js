import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "../style/Setup.css";
import NavBar from "../components/NavBar";

const apiUrl = process.env.REACT_APP_HEROKU_URL || 'http://localhost:5000';

const Setup = () => {
    const location = useLocation();
    const course = location.state?.course;
    const [playerData, setPlayerData] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [game, setGame] = useState({
        course: course._id, 
        date: new Date(),
        players: [],
        scores: [],
        createdBy: course.createdBy
    });

    const navigate = useNavigate();

    useEffect(() => {
        const getPlayers = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/users/players`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const playerData = await response.json();
                setPlayerData(playerData);
            } catch (error) {
                console.error(`Failed to fetch players: ${error}`);
            }
        };

        getPlayers();
    }, []);

    const addPlayer = async () => {
        const name = prompt('Enter player name');
        if (!name) return;

        try {
            const response = await fetch(`${apiUrl}/api/users/players`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name, user: localStorage.getItem('userId') })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const newPlayer = await response.json();
            setPlayerData(prevPlayerData => [...prevPlayerData, newPlayer]);
        }
        catch (error) {
            console.error(`Failed to add player: ${error}`);
        }
    };

    const handleSelectPlayer = (player) => {
        // Add player to selectedPlayers and update game state
        setSelectedPlayers(prevSelectedPlayers => [...prevSelectedPlayers, player]);
        setGame(prevGame => ({
            ...prevGame,
            players: [...prevGame.players, player],
            scores: [...prevGame.scores, { player: player._id, score: [] }] 
        }));
    };
    
    const handleRemovePlayer = (playerId) => {
        // Find the player to remove by ID
        const removedPlayer = selectedPlayers.find(player => player._id === playerId);

        console.log('Removing player:', removedPlayer);
    
        // Ensure only the specified player is removed
        setSelectedPlayers(prevSelectedPlayers => {
            const newSelectedPlayers = prevSelectedPlayers.filter(player => player._id !== playerId);

            return newSelectedPlayers;
        });
    
        setGame(prevGame => ({
            ...prevGame,
            players: prevGame.players.filter(player => player._id !== playerId),
            scores: prevGame.scores.filter(score => score.player !== playerId)
        }));

    };

    const startGame = async () => {
        navigate('/game', { state: { game, course } });
    }

    return (
        <div className="setup-container">
            <NavBar />
            <h1 className="setup-title">Game setup</h1>
            <p className="setup-course">{game.courseName}</p>
            <Link to="/" className="setup-back">Change Course</Link>
    
            <div className="player-list">
                <h3>Choose your Players</h3>
                <div className="player-name-container">
                    {playerData.map(player => (
                        <p className="player-name" key={player._id} onClick={() => handleSelectPlayer(player)}>
                            {player.name}
                        </p>
                    ))}
                </div>
                <button className="add-player-button" onClick={addPlayer}>Add New Player</button>
            </div>
            
            {selectedPlayers.length > 0 && (
            <div className="selected-players">
                <h3 className="selected-players-title">Selected Players</h3>
                <div>
                    {selectedPlayers.map((player, index) => (
                        <div className="player-set">
                            <p className="chosen-player" key={player._id}>
                                Player {index + 1}: {player.name} 
                            </p>
                            <button className="remove-player-button" onClick={() => handleRemovePlayer(player._id)}>Remove</button>
                        </div>
                    ))}
                </div>

                <div>
                    <button className="play-golf-button" onClick={() => startGame()}>Play Golf</button>
                </div>
            </div>    

            )}
            

            
            
        </div>
    );
}

export default Setup;
