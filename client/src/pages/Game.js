import React from "react";
import { useLocation } from "react-router-dom";
import "../style/Game.css";
import ParInput from "../components/ParInput";

const Game = () => {
    const location = useLocation();
    const { game, course } = location.state;

    return (
        <div className="game">
            <ParInput game={game} course={course} />
        </div>
    );
}

export default Game;