import React from 'react';
import { Bar } from 'react-chartjs-2';

export const VertBarBestWorstHole = ({ gameInformation, selectedPlayer }) => {

    const getBestWorstScores = (gameInformation, selectedPlayer) => {
        const holeCount = gameInformation[0].scores[0].score.length;
        const bestScores = Array(holeCount).fill(Infinity);
        const worstScores = Array(holeCount).fill(-Infinity);

        gameInformation.forEach(game => {
            game.scores.forEach(playerScore => {
                if (playerScore.player === selectedPlayer.name) {
                    playerScore.score.forEach((score, index) => {
                        if (score < bestScores[index]) bestScores[index] = score;
                        if (score > worstScores[index]) worstScores[index] = score;
                    });
                }
            });
        });

        return { bestScores, worstScores };
    };

    const { bestScores, worstScores } = getBestWorstScores(gameInformation, selectedPlayer);

    const data = {
        labels: bestScores.map((_, index) => `Hole ${index + 1}`),
        datasets: [
            {
                label: 'Best Scores',
                data: bestScores,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Worst Scores',
                data: worstScores,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
        ],
    };

    return (
        <div>
            <Bar data={data} />
        </div>
    );
};
