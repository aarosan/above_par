import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "../style/Setup.css";

const apiUrl = process.env.REACT_APP_HEROKU_URL || 'http://localhost:5000';

const Setup = () => {
    const location = useLocation();
    const course = location.state?.course;
    const [playerData, setPlayerData] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [game, setGame] = useState({
        courseName: course.courseName,
        color: course.color,
        numberOfHoles: course.numberOfHoles,
        totalPar: course.totalPar,
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
        console.log('Removing player with ID:', playerId); // Debugging log
        // Find the player to remove by ID
        const removedPlayer = selectedPlayers.find(player => player._id === playerId);
        console.log('Removed player:', removedPlayer); // Debugging log
    
        // Ensure only the specified player is removed
        setSelectedPlayers(prevSelectedPlayers => {
            const newSelectedPlayers = prevSelectedPlayers.filter(player => player._id !== playerId);
            console.log('Updated selected players:', newSelectedPlayers); // Debugging log
            return newSelectedPlayers;
        });
    
        setGame(prevGame => ({
            ...prevGame,
            players: prevGame.players.filter(player => player._id !== playerId),
            scores: prevGame.scores.filter(score => score.player !== playerId)
        }));

        console.log('Updated game:', game); // Debugging log
    };

    const startGame = async () => {
        console.log('Starting game:', game); // Debugging log
        navigate('/game', { state: { game } });
    }

    return (
        <div className="setup-container">
            <h1 className="setup-title">Game setup</h1>
            <p className="setup-course">{game.courseName}</p>
            <Link to="/" className="setup-back">Change Course</Link>
    
            <div className="player-list">
                <h3>Choose your Players</h3>
                <div>
                    {playerData.map(player => (
                        <p className="player-names" key={player._id} onClick={() => handleSelectPlayer(player)}>
                            {player.name}
                        </p>
                    ))}
                </div>
                <button className="add-player-button" onClick={addPlayer}>Add New Player</button>
            </div>
            
            {selectedPlayers.length > 0 && (
            <div className="selected-players">
                <h3>Selected Players</h3>
                <div>
                    {selectedPlayers.map((player, index) => (
                        <p key={player._id}>
                            Player {index + 1}: {player.name} 
                            <button className="remove-player-button" onClick={() => handleRemovePlayer(player._id)}>Remove</button>
                        </p>
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
