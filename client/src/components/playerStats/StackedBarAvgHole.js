import React from 'react';
import { Bar } from 'react-chartjs-2';

export const StackedBarAvgHole = ({ gameInformation, selectedPlayer, selectedCourse }) => {
    console.log('StackedBarAvgHole', gameInformation, selectedPlayer, selectedCourse);
    
    const calculateAverageScores = (gameInformation, selectedPlayer, selectedCourse) => {
        console.log('calculateAverageScores', gameInformation, selectedPlayer.name, selectedCourse);
        const holeScores = {};
        const coursePar = {};
    
        gameInformation.forEach(game => {
            game.scores.forEach(playerScore => {
                if (playerScore.player === selectedPlayer.name) {
                    console.log('playerScore matched!!', playerScore, selectedPlayer);
                    playerScore.score.forEach((hole, index) => {
                        if (!holeScores[index]) {
                            holeScores[index] = [];
                        }
                        holeScores[index].push(hole);
                    });
                }
            });
        });

        selectedCourse.holes.forEach((hole, index) => {
            coursePar[index] = hole.par;
        }
        );

        console.log("Post gameInformation loop", "Hole Scores", holeScores, "Course Par", coursePar);
    
        const averageScores = Object.keys(holeScores).map(holeIndex => {
            const scores = holeScores[holeIndex];
            const total = scores.reduce((acc, score) => acc + score, 0);
            return total / scores.length;
        });
    
        return { averageScores, coursePar };
    };
    
    const { averageScores, coursePar } = calculateAverageScores(gameInformation, selectedPlayer, selectedCourse);
    
    const data = {
        labels: Object.keys(coursePar).map(hole => `Hole ${parseInt(hole) + 1}`),
        datasets: [
            {
                label: 'Par',
                data: Object.values(coursePar),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Average Score',
                data: averageScores,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };
    
    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };
    
    return (
        <div>
            <Bar data={data} options={options} />
        </div>
    );
}
