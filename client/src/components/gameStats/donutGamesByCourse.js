import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ArcElement } from 'chart.js';

export const DonutGamesByCourse = ({ games }) => {
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
    
    const generateDonutChartData = (games) => {
        const coursePlayCount = games.reduce((acc, game) => {
            acc[game.course] = (acc[game.course] || 0) + 1;
            return acc;
        }, {});
    
        const labels = Object.keys(coursePlayCount);
        //console.log('labels', labels);
        const data = Object.values(coursePlayCount);
    
        const datasets = [{
            label: 'Course Play Count',
            data: data,
            backgroundColor: labels.map((_, index) => `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 0.5)`),
            borderColor: labels.map((_, index) => `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 1)`),
            borderWidth: 1,
        }];
    
        return {
            labels,
            datasets,
        };
    };

    const donutChartData = generateDonutChartData(games);

    return (
        <div>
            <Doughnut 
                    data={donutChartData} 
                    options={{ 
                        responsive: true, 
                        plugins: { 
                            legend: { position: 'top' }, 
                            title: { display: true, text: `Amount of Games played by Course` } 
                        } 
                    }} 
            />  
        </div>
    );
};


        