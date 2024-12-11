import React from "react";
import { useLocation } from "react-router-dom";
import "../style/Game.css";
import ParInput from "../components/ParInput";
import NavBar from "../components/NavBar";

const Game = () => {
    const location = useLocation();
    const { game, course } = location.state;

    return (
        <div className="game">
            <NavBar />
            <ParInput game={game} course={course} />
        </div>
    );
}

export default Game;