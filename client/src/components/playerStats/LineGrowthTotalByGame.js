import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export const LineGrowthTotalByGame = ({ gameInformation }) => {

    const getChartData = (gameInformation) => {
        const labels = gameInformation.map(game => game.date);
        const data = gameInformation.map(game => game.scores[0].score.reduce((acc, curr) => acc + curr, 0));
    
        return {
            labels,
            datasets: [
                {
                    label: 'Total Score by Game',
                    data,
                    fill: false,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                },
            ],
        };
    };
    
    return (
        <div>
            <Line data={getChartData(gameInformation)} />
        </div>
    );
}